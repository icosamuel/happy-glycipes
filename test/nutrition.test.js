import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecipes,recipeJsonLd,validateRecipe} from '../scripts/content.js';
import {recipePage} from '../src/pages.11ty.js';

test('les estimations des pains gardent leur base et séparent glucides totaux et nets',()=>{
  for(const [id,calories,total,net,basis] of [
    ['pain-olives','~185 kcal','~6 g','~2','par tranche si coupé en 12'],
    ['pain-citrouille','291 kcal','~11 g','~6','par portion — environ 8 portions']
  ]) {
    const d=loadRecipes().find(d=>d.wiki.id===id),ld=recipeJsonLd(d),html=recipePage(d);
    assert.equal(ld.nutrition.calories,calories);
    assert.equal(ld.nutrition.carbohydrateContent,total);
    assert.equal(ld.nutrition.netCarbs,undefined);
    assert.equal(d.wiki.netCarbs.value,net);
    assert.ok(html.includes(basis));
    assert.ok(html.includes('fibres'));
    assert.ok(html.includes(d.wiki.nutritionProvenance.source));
    assert.ok(!html.includes('non reprises'));
  }
  const pumpkin=loadRecipes().find(d=>d.wiki.id==='pain-citrouille');
  assert.equal(recipeJsonLd(pumpkin).nutrition.sodiumContent,'~220 mg');
  assert.ok(recipePage(pumpkin).includes('<span>sodium</span>'));
});

test('les croquettes affichent les fourchettes sans inventer une portion ni des glucides totaux',()=>{
  const d=loadRecipes().find(d=>d.wiki.id==='croquettes-poulet'),html=recipePage(d);
  for(const value of ['350–390 kcal','30–35 g','22–27 g','3–5 g','2–4 g']) assert.ok(html.includes(value));
  assert.ok(html.includes('Base : non précisée dans la source'));
  assert.ok(!html.includes('Par portion, selon'));
  assert.equal(recipeJsonLd(d).nutrition,undefined);
  assert.equal(d.wiki.reportedNutrition.carbohydrateContent,undefined);
  const invalid=structuredClone(d);
  invalid.recipe.nutrition=invalid.wiki.reportedNutrition;
  assert.throws(()=>validateRecipe(invalid),/base nutrition inconnue/);
  delete invalid.recipe.nutrition;
  delete invalid.wiki.nutritionProvenance;
  assert.throws(()=>validateRecipe(invalid),/provenance nutrition absente/);
});
