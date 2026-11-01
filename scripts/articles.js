import {readdirSync,readFileSync} from 'node:fs';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({html:false,linkify:false});
export function loadArticles(dir='content/articles') {
  return readdirSync(dir).filter(f=>f.endsWith('.md')).map(f=>{
    const raw=readFileSync(`${dir}/${f}`,'utf8');
    const match=raw.match(/^---json\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if(!match) throw new Error(`${f}: en-tête article absent`);
    return {...JSON.parse(match[1]),html:md.render(match[2])};
  });
}
export function validateRelations(recipes,articles) {
  const byId=new Map();
  for(const a of articles) {
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id) || byId.has(a.id) || !a.name || !a.summary || !/^https:\/\//.test(a.source) || !['ingredient','technique'].includes(a.type)) throw new Error(`${a.id}: rubrique invalide/dupliquée`);
    byId.set(a.id,a);
  }
  const visit=(id,chain=[])=>{
    if(chain.includes(id)) throw new Error(`Cycle de dépendances: ${[...chain,id].join(' → ')}`);
    if(!byId.has(id)) throw new Error(`Rubrique inconnue: ${id}`);
    for(const ref of byId.get(id).references??[]) visit(ref,[...chain,id]);
  };
  for(const a of articles) visit(a.id);
  for(const {wiki:w} of recipes) {
    for(const i of w.ingredients) if(i.article && !byId.has(i.article)) throw new Error(`${w.id}: ingrédient lié inconnu ${i.article}`);
    const allocated=new Map();
    for(const a of w.allocations??[]) {
      const ingredient=w.ingredients.find(i=>i.id===a.ingredient);
      if(!ingredient || !Number.isFinite(a.quantity) || a.quantity<=0 || a.unit!==ingredient.unit) throw new Error(`${w.id}: allocation invalide ${a.ingredient}`);
      const external=(w.dependencies??[]).some(d=>d.id===a.target && !d.includedInIngredientTotal);
      if(!external) allocated.set(a.ingredient,(allocated.get(a.ingredient)??0)+a.quantity);
    }
    for(const [id,total] of allocated) if(Math.abs(total-w.ingredients.find(i=>i.id===id).quantity)>1e-8) throw new Error(`${w.id}: allocation contradictoire ${id}`);
    for(const d of w.dependencies??[]) {
      if(!byId.has(d.id)) throw new Error(`${w.id}: préparation inconnue ${d.id}`);
      if(!w.allocations?.some(a=>a.target===d.id && a.ingredient===d.usesIngredient && a.quantity===d.quantity)) throw new Error(`${w.id}: allocation de préparation absente ${d.id}`);
    }
  }
}
// Included allocations partition the declared usage; external allocations add only their explicit amount.
export function plannedIngredients(w) {
  return w.ingredients.map(i=>({...i,quantity:i.quantity===null?null:i.quantity+(w.dependencies??[]).filter(d=>d.usesIngredient===i.id && !d.includedInIngredientTotal).reduce((n,d)=>n+d.quantity,0)})).filter(i=>!i.pantry);
}
