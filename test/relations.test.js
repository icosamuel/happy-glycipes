import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadRecipes} from '../scripts/content.js';
import {loadArticles,validateRelations,plannedIngredients} from '../scripts/articles.js';
const fresh=()=>structuredClone(loadRecipes().filter(d=>d.wiki.id==='galettes-poireaux-ricotta'));
test('allocations incluses: trois œufs, sans double comptage',()=>{
  const recipes=fresh();validateRelations(recipes,loadArticles());
  assert.equal(plannedIngredients(recipes[0].wiki).find(i=>i.id==='oeuf').quantity,3);
});
test('deux préparations partagent un usage; ajout externe explicite et huile planifiable',()=>{
  const recipes=fresh(),w=recipes[0].wiki;
  w.dependencies.push({id:'farine-amande',quantity:1,unit:'œuf',usesIngredient:'oeuf',includedInIngredientTotal:false});
  w.allocations.push({ingredient:'oeuf',target:'farine-amande',quantity:1,unit:'gros'});
  validateRelations(recipes,loadArticles());
  assert.equal(plannedIngredients(w).find(i=>i.id==='oeuf').quantity,4);
  w.ingredients.push({id:'huile',name:'Huile',quantity:250,unit:'ml',sourceLine:'250 ml huile',pantry:false});
  assert.ok(plannedIngredients(w).find(i=>i.id==='huile'));
  w.ingredients.at(-1).pantry=true;
  assert.ok(!plannedIngredients(w).find(i=>i.id==='huile'));
});
test('références cassées, cycles et allocations contradictoires échouent précisément',()=>{
  let recipes=fresh();recipes[0].wiki.ingredients[0].article='absent';
  assert.throws(()=>validateRelations(recipes,loadArticles()),/inconnu/);
  const articles=loadArticles();articles.find(a=>a.id==='farine-amande').references=['oeuf-poche'];articles.find(a=>a.id==='oeuf-poche').references=['farine-amande'];
  assert.throws(()=>validateRelations(fresh(),articles),/Cycle/);
  recipes=fresh();recipes[0].wiki.allocations[0].quantity=3;
  assert.throws(()=>validateRelations(recipes,loadArticles()),/contradictoire/);
});
