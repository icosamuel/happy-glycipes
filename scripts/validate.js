import {loadRecipes} from './content.js';
import {loadArticles,validateRelations} from './articles.js';
const recipes = loadRecipes();
validateRelations(recipes,loadArticles());
console.log(`${recipes.length} recette(s) valide(s).`);
