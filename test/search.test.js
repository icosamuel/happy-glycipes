import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog,incoming,validateTaxonomy} from '../scripts/catalog.js';
import {loadRecipes} from '../scripts/content.js';
import {loadArticles} from '../scripts/articles.js';
import {searchIndex,matchesFilters} from '../src/assets/search.js';
test('index dérivé: accents, ligatures, alias, recettes et rubriques',()=>{
  const index=catalog(loadRecipes(),loadArticles());
  for(const query of ['amande','almond flour','oeuf poche','ŒUF POCHÉ','dejeuner']) assert.ok(searchIndex(index,query).length,query);
  assert.deepEqual(searchIndex(index,'inconnu-zzy'),[]);
  assert.deepEqual(searchIndex(index,''),[]);
});
test('ajout publié régénère index et liens entrants; brouillon exclu',()=>{
  const recipes=structuredClone(loadRecipes()),d=structuredClone(recipes.find(d=>d.wiki.id==='galettes-poireaux-ricotta'));
  d.wiki.id='deuxieme';d.recipe.name='Deuxième plat';recipes.push(d);
  assert.equal(incoming(recipes,'farine-amande').length,2);
  assert.ok(catalog(recipes,loadArticles()).some(e=>e.id==='deuxieme'));
  d.wiki.status='draft';assert.equal(incoming(recipes,'farine-amande').length,1);
  assert.ok(!catalog(recipes,loadArticles()).some(e=>e.id==='deuxieme'));
});
test('taxonomie contrôlée et filtres combinés/réinitialisés',()=>{
  const recipes=loadRecipes();validateTaxonomy(recipes);
  recipes[0].wiki.tags.push('Inconnu');assert.throws(()=>validateTaxonomy(recipes),/tag inconnu/);
  const card={category:'dejeuner',tags:['vegetarien']};
  assert.equal(matchesFilters(card,'dejeuner','vegetarien'),true);
  assert.equal(matchesFilters(card,'autre',''),false);
  assert.equal(matchesFilters(card,'',''),true);
});
