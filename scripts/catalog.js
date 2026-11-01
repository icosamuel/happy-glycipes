import {readFileSync} from 'node:fs';
import {prefix} from './content.js';
export const taxonomy=JSON.parse(readFileSync('content/taxonomy.json','utf8'));
export function validateTaxonomy(recipes) {
  for(const {recipe:r,wiki:w} of recipes) {
    if(!taxonomy.categories.some(c=>c.name===r.recipeCategory)) throw new Error(`${w.id}: catégorie inconnue`);
    if((w.tags??[]).some(t=>!taxonomy.tags.some(x=>x.name===t))) throw new Error(`${w.id}: tag inconnu`);
  }
}
export function catalog(recipes,articles) {
  const published=recipes.filter(d=>d.wiki.status==='published');
  return [...published.map(({recipe:r,wiki:w})=>({id:w.id,name:r.name,type:'Recette',url:`${prefix}recettes/${w.id}/`,terms:[r.recipeCategory,...w.tags,...w.ingredients.map(i=>i.name),...articles.filter(a=>w.ingredients.some(i=>i.article===a.id)||(w.dependencies??[]).some(d=>d.id===a.id)).flatMap(a=>a.aliases??[])]})),...articles.map(a=>({id:a.id,name:a.name,type:a.type==='ingredient'?'Ingrédient':'Technique',url:`${prefix}rubriques/${a.id}/`,terms:a.aliases??[]}))];
}
export function incoming(recipes,id) {return recipes.filter(d=>d.wiki.status==='published' && (d.wiki.ingredients.some(i=>i.article===id)||(d.wiki.dependencies??[]).some(dep=>dep.id===id)))}
