import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecipes,validateRecipe,recipeJsonLd,json} from '../scripts/content.js';
test('la recette témoin conserve provenance, inconnus et glucides nets séparés',()=>{
  const d=loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta'); assert.equal(validateRecipe(d),true);
  const ld=recipeJsonLd(d);
  assert.equal(ld.recipeYield,'2'); assert.equal(ld.recipeIngredient.length,8);
  assert.equal(ld.nutrition.carbohydrateContent,undefined); assert.equal(ld.wiki,undefined);
  assert.equal(ld.image,undefined); assert.match(ld.isBasedOn,/keysnutrition/);
});
test('les données invalides bloquent le build et le JSON-LD ne ferme pas son script',()=>{
  const d=structuredClone(loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta')); d.wiki.ingredients[0].quantity=-1;
  assert.throws(()=>validateRecipe(d),/quantité/);
  assert.ok(!json({name:'</script><img onerror=alert(1)>'}).includes('<'));
});
