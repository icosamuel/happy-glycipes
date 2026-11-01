import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateMedia,validateEditorial} from '../scripts/editorial.js';
import {loadRecipes,validateRecipe,recipeJsonLd} from '../scripts/content.js';
import {recipePage} from '../src/pages.11ty.js';
test('publication exige une relecture explicite et conserve l’ambiguïté témoin',()=>{
  const d=loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta');assert.ok(d.wiki.warnings.some(w=>w.includes('2 portions')));
  const w=structuredClone(d.wiki);delete w.review;assert.throws(()=>validateEditorial(w),/relecture/);
  assert.equal(recipeJsonLd(d).nutrition.carbohydrateContent,undefined);
});
test('photo: permission documentée acceptée; crédit, permission, fichier et chemin contrôlés',()=>{
  const media={path:'assets/media/photo.webp',credit:'Auteur',source:'https://example.com/photo',permission:{license:'CC BY 4.0',evidenceUrl:'https://example.com/license'}};
  assert.doesNotThrow(()=>validateMedia(media,{exists:()=>true}));
  assert.throws(()=>validateMedia({...media,credit:''},{exists:()=>true}),/requis/);
  assert.throws(()=>validateMedia({...media,permission:{}},{exists:()=>true}),/requis/);
  assert.throws(()=>validateMedia(media,{exists:()=>false}),/absent/);
  assert.throws(()=>validateMedia({...media,path:'../secret.jpg'},{exists:()=>true}),/chemin/);
});
test('texte hostile reste du texte et une quantité structurée manquante bloque',()=>{
  const d=structuredClone(loadRecipes().find(d=>d.wiki.id==='galettes-poireaux-ricotta'));d.recipe.name='</script><img onerror=evil()>';d.wiki.steps[0].text='<img src=x onerror=evil()>';
  const rendered=recipePage(d);
  assert.ok(!rendered.includes('<img onerror=evil()>'));assert.ok(rendered.includes('&lt;img src=x onerror=evil()&gt;'));
  d.wiki.steps[0].text='Texte et {{ingredient:absent}}';
  assert.throws(()=>validateRecipe(d),/quantité structurée inconnue/);
});
