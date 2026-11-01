import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scaleQuantity,loadNote,saveNote} from '../src/assets/quantities.js';
import {loadRecipes,recipeJsonLd} from '../scripts/content.js';
import {expandStep} from '../scripts/steps.js';
test('×1 → ×3 → ×1 est calculé depuis la base, avec fractions et inconnus',()=>{
  assert.equal(scaleQuantity(3,2),6);assert.equal(scaleQuantity(2,2),4);assert.equal(scaleQuantity(1,2),2);
  for(const m of [1,3,1])assert.equal(scaleQuantity(0.5,m),0.5*m);
  assert.equal(scaleQuantity(null,2),null);
});
test('seules les références de quantité changent; temps, nutrition et source restent stables',()=>{
  const d=loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta'),w=d.wiki;
  assert.equal(expandStep('3 minutes et {{allocation:pate}} œufs',w),'3 minutes et 2 œufs');
  assert.match(expandStep(w.steps[1].text,w,{html:true,link:()=> 'farine'}),/data-scale="2"/);
  const ld=recipeJsonLd(d);assert.equal(ld.cookTime,'PT15M');assert.equal(ld.nutrition.calories,'342 kcal');
  assert.ok(!JSON.stringify(ld).includes('{{'));assert.ok(!JSON.stringify(ld).includes('data-scale'));
});
test('notes isolées par recette; stockage indisponible signalé sans exception',()=>{
  const data=new Map(),storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
  assert.equal(saveNote(storage,'a','<script>texte personnel</script>'),true);
  assert.equal(loadNote(storage,'a').value,'<script>texte personnel</script>');assert.equal(loadNote(storage,'b').value,'');
  const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
  assert.equal(loadNote(blocked,'a').ok,false);assert.equal(saveNote(blocked,'a','note'),false);
});
