import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecipes,recipeJsonLd} from '../scripts/content.js';
import {recipePage} from '../src/pages.11ty.js';
import {incoming,catalog} from '../scripts/catalog.js';
import {loadArticles,plannedIngredients} from '../scripts/articles.js';

test('les rendements en pièces restent distincts des portions dans la page et le JSON-LD',()=>{
  for(const [id,count,unit] of [['pain-olives',12,'tranches'],['croquettes-poulet',90,'croquettes']]){
    const d=loadRecipes().find(d=>d.wiki.id===id);
    assert.equal(recipeJsonLd(d).recipeYield,`${count} ${unit}`);
    assert.ok(recipePage(d).includes(`${count}</span> ${unit}`));
    assert.equal(recipeJsonLd(d).image,undefined);
    assert.equal(d.wiki.rights.mode,'reference-notes');
  }
});
test('technique liée recherchable sans ajouter les provisions de panure ni les variantes',()=>{
  const recipes=loadRecipes(),d=recipes.find(d=>d.wiki.id==='croquettes-poulet');
  assert.ok(incoming(recipes,'paner').some(d=>d.wiki.id==='croquettes-poulet'));
  assert.ok(catalog(recipes,loadArticles()).find(d=>d.id==='croquettes-poulet').terms.includes('panure'));
  const provisions=plannedIngredients(d.wiki,{includePantry:true});
  assert.equal(provisions.find(i=>i.id==='oeufs').quantity,10);
  assert.equal(provisions.find(i=>i.id==='parmesan').quantity,450);
  assert.equal(provisions.filter(i=>i.id==='amande').length,1);
  assert.equal(provisions.find(i=>i.id==='huile').quantity,null);
});
