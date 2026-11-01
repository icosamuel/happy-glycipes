import {mkdirSync,writeFileSync} from 'node:fs';
import {publicFetch} from './public-fetch.js';
import {normalizeImport} from './importer.js';
import {loadArticles} from './articles.js';
import {authorize,parseProposal,retryMode,githubApi as api} from './proposal.js';
const issue=process.env.ISSUE_NUMBER,actor=process.env.GITHUB_ACTOR,repo=process.env.GITHUB_REPOSITORY;
const output='proposal-output';
async function comment(body){return api(`/issues/${issue}/comments`,{method:'POST',body:{body}})}
async function main(){
  if(!/^\d+$/.test(issue??'') || !/^[\w.-]+\/[\w.-]+$/.test(repo??'') || !/^[\w-]+$/.test(actor??''))throw Error('Contexte GitHub invalide.');
  const permission=await api(`/collaborators/${encodeURIComponent(actor)}/permission`);authorize(permission.permission);
  const proposal=await api(`/issues/${issue}`);
  if(proposal.pull_request || proposal.state!=='open')throw Error('Choisir une issue de proposition ouverte.');
  const url=parseProposal(proposal.body),branch=`codex/proposal-${issue}`;
  const refPath=`/git/ref/heads/${branch}`;
  const existing=await api(refPath,{allow404:true});
  const prs=await api(`/pulls?state=all&head=${repo.split('/')[0]}:${encodeURIComponent(branch)}&per_page=100`);
  let pr=prs.find(p=>p.head.ref===branch);
  const mode=retryMode(pr,Boolean(existing));
  if(mode==='closed'){await comment(`La PR existante est fermée : ${pr.html_url}. Aucun doublon ni remplacement. Ouvrir une nouvelle proposition pour une autre révision.`);return}
  const recipeChoice=process.env.RECIPE_INDEX;
  const fetched=await publicFetch(url);
  const result=normalizeImport({html:fetched.html,url,finalUrl:fetched.finalUrl,choice:recipeChoice?Number(recipeChoice):undefined,articles:loadArticles()});
  mkdirSync(output,{recursive:true});
  const request={issue:Number(issue),url,canonicalUrl:result.report.canonicalUrl,authorizedBy:actor};
  const files=mode==='comparison'?{'comparison.json':{...result,request}}:{'recipe.json':result.draft,'source.json':result.source,'report.json':result.report,'request.json':request};
  for(const [file,data] of Object.entries(files))writeFileSync(`${output}/${file}`,JSON.stringify(data,null,2)+'\n');
  const base=existing?.object.sha??(await api('/git/ref/heads/main')).object.sha;
  const commit=await api(`/git/commits/${base}`);
  const tree=await api('/git/trees',{method:'POST',body:{base_tree:commit.tree.sha,tree:Object.entries(files).map(([file,data])=>({path:`drafts/proposals/issue-${issue}/${file}`,mode:'100644',type:'blob',content:JSON.stringify(data,null,2)+'\n'}))}});
  const next=await api('/git/commits',{method:'POST',body:{message:`${mode==='comparison'?'Compare':'Import'} recipe proposal #${issue}`,tree:tree.sha,parents:[base]}});
  if(existing)await api(`/git/refs/heads/${branch}`,{method:'PATCH',body:{sha:next.sha,force:false}});
  else await api('/git/refs',{method:'POST',body:{ref:`refs/heads/${branch}`,sha:next.sha}});
  if(!pr)pr=await api('/pulls',{method:'POST',body:{title:`Recette proposée #${issue} — brouillon à relire`,head:branch,base:'main',draft:true,body:`Import autorisé par @${actor}. Proposition : #${issue}.\n\nAucune publication avant relecture et fusion explicites. Source et rapport dans le dossier du brouillon.\n\n- [ ] Portions, quantités, étapes et allocations relues\n- [ ] Rubriques, produits courants, catégorie et tags validés\n- [ ] Attribution, droits des textes et médias vérifiés séparément\n- [ ] Nutrition et ambiguïtés reconnues\n- [ ] Contenu éditorial déplacé vers content/recipes, review renseignée\n- [ ] Tests, build et vérification Pages\n\nVoir docs/editorial.md. Une relance préserve les corrections et ajoute uniquement comparison.json.`}});
  await comment(`${mode==='comparison'?'Comparaison ajoutée; corrections du brouillon conservées':'Brouillon prêt à relire'} : ${pr.html_url}. Rien n’est publié automatiquement.`);
  console.log(pr.html_url);
}
try{await main()}catch(error){
  console.error(`Proposition impossible : ${error.message}`);
  // Only a verified maintainer reaches writable work. Do not comment on invalid/unauthorized context.
  if(/^\d+$/.test(issue??'') && repo && actor){
    try{const p=await api(`/collaborators/${encodeURIComponent(actor)}/permission`);authorize(p.permission);await comment(`Import non terminé : ${error.message}\n\nConsulter le run Actions et son artefact s'il existe. Corriger puis relancer; ne pas supposer une PR créée.`)}catch{}
  }
  process.exitCode=1;
}
