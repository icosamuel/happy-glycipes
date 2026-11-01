import {loadRecipes} from './content.js';
const recipes = loadRecipes();
console.log(`${recipes.length} recette(s) valide(s).`);
