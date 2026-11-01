import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {normalizeImport,writeImport,extractRecipes,canonicalUrl} from '../scripts/importer.js';
import {publicFetch,isPublicAddress,publicUrl,MAX_BYTES} from '../scripts/public-fetch.js';
const recipe={'@type':'Recipe',name:'Recette de test',author:{name:'Auteur'},recipeYield:'2',recipeIngredient:['80 ml farine d’amande','1/2 tasse inconnue'],recipeInstructions:[{'@type':'HowToSection',name:'Pâte',itemListElement:[{'@type':'HowToStep',text:'Mélanger.'}]}]};
const html=data=>`<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`;
test('Recipe, tableau et @graph; sections et source conservées; quantités inconnues explicites',()=>{
  for(const data of [recipe,[recipe],{'@graph':[recipe]}]){
    const result=normalizeImport({html:html(data),url:'https://example.com/recette?utm_source=test'});
    assert.equal(result.draft.wiki.status,'draft');assert.equal(result.draft.wiki.sourceUrl,'https://example.com/recette');
    assert.equal(result.draft.wiki.ingredients[1].quantity,null);
    assert.equal(result.draft.wiki.steps[0].section,'Pâte');
    assert.deepEqual(result.source.recipeInstructions,recipe.recipeInstructions);
    assert.equal(result.draft.recipe.image,undefined);assert.equal(result.draft.recipe.nutrition,undefined);
  }
});
test('sélection explicite, page partielle, sans Recipe et JSON-LD hostile',()=>{
  assert.throws(()=>normalizeImport({html:html([recipe,recipe]),url:'https://example.com/'}),/Plusieurs recettes/);
  assert.equal(normalizeImport({html:html([recipe,recipe]),url:'https://example.com/',choice:1}).report.candidates,2);
  assert.throws(()=>normalizeImport({html:html(recipe),url:'https://example.com/',choice:4}),/Sélection/);
  const manual=normalizeImport({html:'<html>sans Recipe</html>',url:'https://example.com/'});
  assert.ok(manual.report.warnings.some(w=>w.includes('Aucun Recipe')));
  const hostile=normalizeImport({html:html({...recipe,name:'<img onerror="evil()">Titre',image:'https://example.com/photo.jpg'}),url:'https://example.com/'});
  assert.equal(hostile.draft.recipe.name,'Titre');assert.equal(hostile.draft.recipe.image,undefined);
  assert.equal(extractRecipes('<script type="application/ld+json">invalid</script>').diagnostics.length,1);
});
test('réimport conserve les corrections et ne crée qu’une comparaison',()=>{
  const root=mkdtempSync(join(tmpdir(),'glycipes-import-'));
  try{
    const result=normalizeImport({html:html(recipe),url:'https://example.com/',now:'2026-11-01'});
    const output=writeImport(result,{root});
    const file=`${output.dir}/recipe.json`;writeFileSync(file,'correction manuelle');
    assert.equal(writeImport(result,{root}).comparison,true);
    assert.equal(readFileSync(file,'utf8'),'correction manuelle');
    assert.ok(readFileSync(`${output.dir}/comparison.json`,'utf8').includes('Recette de test'));
    assert.equal(canonicalUrl('https://example.com/?utm_source=x#part'),'https://example.com/');
  }finally{rmSync(root,{recursive:true,force:true})}
});
test('HTTPS et destinations publiques exclusivement, y compris IPv6 et DNS mixte',async()=>{
  for(const url of ['file:///tmp/a','http://example.com','https://localhost','https://127.1/','https://[::1]/','https://user:pass@example.com/','https://example.com:8443/','$(whoami)'])assert.throws(()=>publicUrl(url));
  for(const ip of ['10.0.0.1','169.254.169.254','100.64.0.1','::ffff:127.0.0.1','fc00::1','2001:db8::1','2002:7f00:1::','3fff::1'])assert.equal(isPublicAddress(ip),false,ip);
  assert.equal(isPublicAddress('8.8.8.8'),true);assert.equal(isPublicAddress('2606:4700:4700::1111'),true);
  await assert.rejects(publicFetch('https://example.com/',{resolve:async()=>[{address:'8.8.8.8',family:4},{address:'127.0.0.1',family:4}],request:()=>{throw Error('ne doit pas connecter')}}),/DNS privée/);
});
test('redirection privée, taille, erreurs HTTP et trop de redirections refusées',async()=>{
  const resolve=async()=>[{address:'8.8.8.8',family:4}];
  await assert.rejects(publicFetch('https://example.com/',{resolve,request:async()=>({status:302,headers:{location:'https://127.0.0.1/'},body:''})}),/privée/);
  await assert.rejects(publicFetch('https://example.com/',{resolve,request:async()=>({status:200,headers:{},body:'a'.repeat(MAX_BYTES+1)})}),/volumineuse/);
  await assert.rejects(publicFetch('https://example.com/',{resolve,request:async()=>({status:503,headers:{},body:''})}),/HTTP 503/);
  await assert.rejects(publicFetch('https://example.com/',{resolve,request:async()=>({status:302,headers:{location:'/again'},body:''})}),/Trop de redirections/);
  await assert.rejects(publicFetch('https://example.com/',{resolve:async()=>{throw Error('DNS unavailable')}}),/DNS unavailable/);
  await assert.rejects(publicFetch('https://example.com/',{resolve:()=>new Promise(()=>{}),timeout:10}),/Délai DNS/);
  let pinned;
  await publicFetch('https://example.com/',{resolve,request:async(_url,address)=>{pinned=address.address;return {status:200,headers:{},body:'OK'}}});assert.equal(pinned,'8.8.8.8');
});
