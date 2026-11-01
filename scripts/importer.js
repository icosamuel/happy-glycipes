import {createHash} from 'node:crypto';
import {mkdirSync,readdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {decodeHTML} from 'entities';
import {publicUrl} from './public-fetch.js';
import {normalize} from '../src/assets/search.js';
export const importerVersion='1.0.0';
export function canonicalUrl(input){
  const url=publicUrl(input);for(const key of [...url.searchParams.keys()])if(/^utm_|^fbclid$|^gclid$/.test(key))url.searchParams.delete(key);
  url.searchParams.sort();return url.href;
}
const clean=value=>decodeHTML(String(value??'').replace(/<[^>]*>/g,'')).trim();
function walk(value,recipes){
  if(Array.isArray(value)){value.forEach(v=>walk(v,recipes));return}
  if(!value || typeof value!=='object')return;
  if([value['@type']].flat().some(t=>t==='Recipe'||t==='https://schema.org/Recipe'))recipes.push(value);
  if(value['@graph'])walk(value['@graph'],recipes);
}
export function extractRecipes(html){
  const recipes=[],diagnostics=[];
  for(const [,attributes,body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes))continue;
    try{walk(JSON.parse(body),recipes)}catch{diagnostics.push('Bloc JSON-LD illisible ignoré.')}
  }
  return {recipes,diagnostics};
}
function stepsOf(value,section){
  return [value].flat().filter(Boolean).flatMap(s=>{
    if(typeof s==='string')return [{name:section??'Préparation',text:clean(s),...(section?{section}: {})}];
    if(s.itemListElement)return stepsOf(s.itemListElement,clean(s.name)||section);
    return [{name:clean(s.name)||section||'Préparation',text:clean(s.text),...(section?{section}: {})}];
  });
}
export function normalizeImport({html,url,finalUrl=url,choice,articles=[],now=new Date().toISOString()}){
  const sourceUrl=canonicalUrl(url),canonical=canonicalUrl(finalUrl);
  const {recipes,diagnostics}=extractRecipes(html);
  if(recipes.length>1 && choice===undefined)throw Error(`Plusieurs recettes : choisir --recipe INDEX (0 à ${recipes.length-1}). ${recipes.map((r,i)=>`${i}: ${clean(r.name)}`).join('; ')}`);
  if(choice!==undefined && (!Number.isInteger(choice)||choice<0||choice>=recipes.length))throw Error('Sélection de recette invalide.');
  const raw=recipes[choice??0]??{};
  const id='import-'+createHash('sha256').update(sourceUrl+`#${choice??0}`).digest('hex').slice(0,16);
  const warnings=[...diagnostics,'Brouillon : conformité keto, nutrition, portions et droits à relire.'];
  if(!recipes.length)warnings.push('Aucun Recipe exploitable. Compléter manuellement depuis la référence; aucune publication automatique.');
  const sourceIngredients=[raw.recipeIngredient??[]].flat().map(clean).filter(Boolean);
  const ingredients=sourceIngredients.map((sourceLine,i)=>{
    let match=sourceLine.match(/^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|c\.? à soupe|c\.? à thé)?\s+(.+)$/i);
    if(match && !match[2] && /^(?:cups?|tasses?|tbsp|tsp|oz|lb|cuillères?|\/|½|¼|¾)\b/i.test(match[3]))match=null;
    const name=match?match[3]:sourceLine;
    const article=articles.find(a=>a.type==='ingredient' && [a.name,...(a.aliases??[])].some(alias=>normalize(name).includes(normalize(alias))));
    if(!match)warnings.push(`Quantité/unité inconnue : ${sourceLine}`);
    return {id:`usage-${i+1}`,name,quantity:match?Number(match[1].replace(',','.')):null,unit:match?.[2]??'',note:match?'Quantité proposée, à vérifier.':'Quantité inconnue, à relire.',sourceLine,...(article?{suggestedArticle:article.id}: {})};
  });
  const sourceAuthor=[raw.author??[]].flat().map(a=>clean(typeof a==='string'?a:a?.name)).filter(Boolean).join(', ');
  const steps=stepsOf(raw.recipeInstructions);
  if(!steps.length)warnings.push('Étapes manquantes.');
  const yieldText=clean(raw.recipeYield);const portions=/^\d+(?:[.,]\d+)?$/.test(yieldText)?yieldText.replace(',','.'):null;
  if(!portions)warnings.push(`Portions non normalisées : ${yieldText||'absentes'}`);
  const recipe={'@context':'https://schema.org','@type':'Recipe',name:clean(raw.name)||'Recette à documenter',description:clean(raw.description),author:{'@type':'Person',name:sourceAuthor||'Auteur à identifier'},inLanguage:clean(raw.inLanguage)||'fr-CA',recipeYield:portions,recipeCategory:null};
  for(const key of ['prepTime','cookTime','totalTime'])if(/^PT[\dHMS.]+$/.test(raw[key]??''))recipe[key]=raw[key];
  if(raw.nutrition)warnings.push('Nutrition source conservée dans source.json; base et valeurs à vérifier avant publication.');
  const draft={version:1,recipe,wiki:{id,status:'draft',experience:'non testé',sourceUrl,canonicalUrl:canonical,originalUrl:url,importedAt:now,importerVersion,tags:[],ingredients,sourceIngredients,steps,sourceInstructions:raw.recipeInstructions??[],sourceYield:yieldText,dependencies:[],allocations:[],warnings,adaptations:[],rights:{mode:'reference-notes',text:'Permission non établie : référence et notes seulement.',photos:'Permission non établie : aucune photo téléchargée.'}}};
  // Retain useful source fields as data, never a downloaded page or executable script.
  const source=Object.fromEntries(['@id','name','author','recipeYield','recipeIngredient','recipeInstructions','nutrition','image','license','url'].filter(k=>raw[k]!==undefined).map(k=>[k,raw[k]]));
  return {draft,source,report:{id,sourceUrl,canonicalUrl:canonical,importerVersion,importedAt:now,candidates:recipes.length,warnings}};
}
export function writeImport(result,{root='drafts',publishedDir='content/recipes'}={}){
  const identity=result.draft.wiki;
  const known=[];
  if(existsSync(publishedDir))for(const f of readdirSync(publishedDir).filter(f=>f.endsWith('.json')))known.push(JSON.parse(readFileSync(`${publishedDir}/${f}`,'utf8')));
  if(existsSync(root))for(const f of readdirSync(root,{withFileTypes:true}).filter(f=>f.isDirectory()))if(existsSync(`${root}/${f.name}/recipe.json`)){
    try{known.push(JSON.parse(readFileSync(`${root}/${f.name}/recipe.json`,'utf8')))}catch{/* A manually edited unreadable draft must still never be replaced. */}
  }
  const existing=known.find(d=>d.wiki.id===identity.id || canonicalUrl(d.wiki.canonicalUrl??d.wiki.sourceUrl)===identity.canonicalUrl);
  const dir=`${root}/${existing?.wiki.id??identity.id}`;mkdirSync(dir,{recursive:true});
  const file=`${dir}/recipe.json`;
  if(existsSync(file)||existing){
    const current=existsSync(file)?readFileSync(file,'utf8'):'';
    const candidate=JSON.stringify(result.draft,null,2)+'\n';
    if(current===candidate)return {dir,comparison:false,unchanged:true};
    writeFileSync(`${dir}/comparison.json`,JSON.stringify(result,null,2)+'\n');
    return {dir,comparison:true,unchanged:false};
  }
  for(const [name,data] of [['recipe',result.draft],['source',result.source],['report',result.report]])writeFileSync(`${dir}/${name}.json`,JSON.stringify(data,null,2)+'\n');
  return {dir,comparison:false,unchanged:false};
}
