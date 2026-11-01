import {readdirSync, readFileSync} from 'node:fs';
export const prefix = '/happy-glycipes/';
export const origin = 'https://icosamuel.github.io';
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export function validateRecipe({version, recipe:r, wiki:w}) {
  const fail = message => {throw new Error(`${w?.id ?? 'recette'}: ${message}`)};
  if(version !== 1 || !r || r['@type'] !== 'Recipe' || !r.name?.trim()) fail('version ou titre absent');
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(w?.id)) fail('identifiant invalide');
  if(!['draft','ready','published'].includes(w.status)) fail('état éditorial invalide');
  if(!/^https:\/\//.test(w.sourceUrl) || !r.author?.name) fail('source/auteur absent');
  if(!r.recipeInstructions?.length || !r.recipeInstructions.every(s => s.text || s.itemListElement)) fail('instructions absentes');
  if(!Number.isFinite(Number(r.recipeYield)) || Number(r.recipeYield)<=0) fail('portions non numériques');
  if(!w.ingredients?.length || !w.sourceIngredients?.length) fail('ingrédients absents');
  const ids = new Set();
  for(const i of w.ingredients) {
    if(!i.id || ids.has(i.id) || !i.name || !i.sourceLine) fail('usage sans identité/source ou doublon');
    ids.add(i.id);
    if(i.quantity !== null && (!Number.isFinite(i.quantity) || i.quantity<=0)) fail(`quantité invalide: ${i.id}`);
  }
  if(r.nutrition && (!w.nutritionProvenance?.source || w.nutritionProvenance.basis !== 'par portion')) fail('provenance nutrition absente');
  if(w.status === 'published' && (!w.rights?.mode || !w.warnings?.length)) fail('droits ou incertitudes absents');
  if(r.image) fail('photo non autorisée: ajouter un contrat média avant publication');
  return true;
}
export function loadRecipes(dir='content/recipes') {
  const result = readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
  const ids = new Set();
  for(const d of result) {validateRecipe(d); if(ids.has(d.wiki.id)) throw new Error(`Identité dupliquée: ${d.wiki.id}`); ids.add(d.wiki.id)}
  return result;
}
export function recipeJsonLd(d) {
  return {...d.recipe, recipeIngredient: d.wiki.sourceIngredients, url: origin+prefix+'recettes/'+d.wiki.id+'/', isBasedOn:d.wiki.sourceUrl};
}
