import {loadRecipes} from './content.js';
import {loadArticles,validateRelations} from './articles.js';
import {validateTaxonomy} from './catalog.js';
const recipes = loadRecipes();
validateRelations(recipes,loadArticles());
validateTaxonomy(recipes);
console.log(`${recipes.length} recette(s) valide(s).`);
