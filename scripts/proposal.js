import {publicUrl} from './public-fetch.js';
export function authorize(permission){
  if(!['admin','maintain','write'].includes(permission))throw Error('Autorisation mainteneur requise (write, maintain ou admin).');
}
export function parseProposal(body){
  const match=String(body).match(/(?:^|\n)### URL\s*\r?\n+([^\r\n]+)(?=\r?\n|$)/);
  if(!match)throw Error('Proposition invalide : champ « URL » absent. Utiliser le formulaire.');
  const url=match[1].trim();publicUrl(url);return url;
}
export function retryMode(pr,exists){
  if(pr?.state==='closed')return 'closed';
  return exists?'comparison':'initial';
}
export async function githubApi(path,{method='GET',body,allow404=false}={}){
  const response=await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}${path}`,{method,headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  if(response.status===404 && allow404)return null;
  if(!response.ok)throw Error(`GitHub API ${response.status} (${method} ${path.split('?')[0]}).`);
  return response.status===204?null:response.json();
}
