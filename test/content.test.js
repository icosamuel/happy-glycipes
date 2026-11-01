import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecipes,validateRecipe,recipeJsonLd,json} from '../scripts/content.js';
test('la recette témoin conserve provenance, inconnus et glucides nets séparés',()=>{
  const d=loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta'); assert.equal(validateRecipe(d),true);
  const ld=recipeJsonLd(d);
  assert.equal(ld.recipeYield,'2'); assert.equal(ld.recipeIngredient.length,d.wiki.ingredients.length);
  assert.equal(d.wiki.sourceIngredients.length,8);assert.ok(ld.recipeIngredient.includes('3 gros Œufs'));
  assert.equal(ld.nutrition.carbohydrateContent,undefined); assert.equal(ld.wiki,undefined);
  assert.equal(ld.image,undefined); assert.match(ld.isBasedOn,/keysnutrition/);
});
test('le JSON-LD suit les quantités éditoriales, sans modifier les lignes source',()=>{
  const d=structuredClone(loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta'));
  d.wiki.ingredients.find(i=>i.id==='amande').quantity=160;
  const ld=recipeJsonLd(d);assert.ok(ld.recipeIngredient.includes('160 ml Farine d’amande'));
  assert.ok(d.wiki.sourceIngredients.some(line=>line.startsWith('80 ml')));
  assert.ok(ld.recipeIngredient.some(line=>line.includes('Vinaigre')));
});
test('les données invalides bloquent le build et le JSON-LD ne ferme pas son script',()=>{
  const d=structuredClone(loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta')); d.wiki.ingredients[0].quantity=-1;
  assert.throws(()=>validateRecipe(d),/quantité/);
  assert.ok(!json({name:'</script><img onerror=alert(1)>'}).includes('<'));
});
