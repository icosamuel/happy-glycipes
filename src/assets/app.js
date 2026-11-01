import {searchIndex,matchesFilters} from './search.js';
import {scaleQuantity,loadNote,saveNote} from './quantities.js';
let anchor;
let multiplier=1;
const pop=document.querySelector('#preview');
function closePreview(restore=false) {
  if(!pop || pop.hidden)return;
  pop.hidden=true;anchor?.setAttribute('aria-expanded','false');
  if(restore)anchor?.focus();
}
function positionPreview() {
  if(!anchor || !pop || pop.hidden)return;
  const r=anchor.getBoundingClientRect();
  if(r.bottom<0 || r.top>innerHeight){closePreview();return}
  const width=pop.offsetWidth,height=pop.offsetHeight;
  pop.style.left=Math.max(12,Math.min(r.left,innerWidth-width-12))+'px';
  pop.style.top=Math.max(12,Math.min(r.bottom+8,innerHeight-height-12))+'px';
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[data-preview]');
  if(link && pop && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button===0){
    event.preventDefault();
    if(anchor===link && !pop.hidden){closePreview(true);return}
    closePreview();anchor=link;
    pop.querySelector('h2').textContent=link.dataset.title;
    pop.querySelector('p').textContent=link.dataset.summary+(link.dataset.allocation?` Dans cette recette : ${scaleQuantity(Number(link.dataset.allocation),multiplier)} œuf(s), déjà inclus dans le total.`:'');
    pop.querySelector('a').href=link.href;
    pop.hidden=false;anchor.setAttribute('aria-expanded','true');positionPreview();
    pop.querySelector('button').focus();
  }else if(event.target.closest('[data-close-preview]'))closePreview(true);
  else if(pop && !pop.contains(event.target))closePreview();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closePreview(true)});
addEventListener('resize',positionPreview);addEventListener('scroll',positionPreview,true);

const search=document.querySelector('#search'),results=document.querySelector('#results');
let indexPromise;
function hideResults(){results.hidden=true;search.setAttribute('aria-expanded','false')}
if(search && results){
  search.addEventListener('input',async()=>{
    const query=search.value;
    if(!query.trim()){results.replaceChildren();hideResults();return}
    indexPromise??=fetch(new URL('../search-index.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('index');return r.json()});
    try {
      const matches=searchIndex(await indexPromise,query);
      if(query!==search.value)return;
      results.replaceChildren();
      for(const entry of matches){const a=document.createElement('a');a.href=entry.url;a.textContent=`${entry.name} · ${entry.type}`;results.append(a)}
      if(!matches.length)results.textContent='Aucun résultat. Essayez un ingrédient ou parcourez les rubriques.';
    }catch{results.textContent='Recherche indisponible. Parcourez les rubriques dans la navigation.';indexPromise=undefined}
    results.hidden=false;search.setAttribute('aria-expanded','true');
  });
  search.addEventListener('keydown',event=>{
    if(['ArrowDown','Enter'].includes(event.key) && results.querySelector('a')){event.preventDefault();results.querySelector('a').focus()}
    if(event.key==='Escape')hideResults();
  });
  results.addEventListener('keydown',event=>{
    const links=[...results.querySelectorAll('a')],pos=links.indexOf(document.activeElement);
    if(event.key==='Escape'){hideResults();search.focus()}
    if(event.key==='ArrowDown'){event.preventDefault();links[(pos+1)%links.length]?.focus()}
    if(event.key==='ArrowUp'){event.preventDefault();if(pos<=0)search.focus();else links[pos-1]?.focus()}
  });
  document.addEventListener('click',event=>{if(!event.target.closest('.header-search'))hideResults()});
}

const cooking=document.querySelector('[data-cooking]');
if(cooking){
  document.querySelectorAll('[data-cooking-control]').forEach(el=>el.hidden=false);
  for(const button of document.querySelectorAll('[data-mult]'))button.addEventListener('click',()=>{
    multiplier=Number(button.dataset.mult);
    for(const el of document.querySelectorAll('[data-scale]'))el.textContent=String(scaleQuantity(Number(el.dataset.scale),multiplier));
    document.querySelectorAll('[data-mult]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    closePreview();document.querySelector('#quantity-status').textContent=`Quantités ×${multiplier}. Durées à adapter; nutrition inchangée par portion.`;
  });
  const checks=[...document.querySelectorAll('[data-ingredient-check]')];
  const updateReady=()=>document.querySelector('#ready').textContent=`${checks.filter(c=>c.checked).length} / ${checks.length} ingrédients prêts`;
  checks.forEach(c=>c.addEventListener('change',updateReady));
  document.querySelector('#reset-ready').addEventListener('click',()=>{checks.forEach(c=>c.checked=false);updateReady()});updateReady();
  const note=document.querySelector('#note'),status=document.querySelector('#saved'),id=cooking.dataset.cooking;
  let storage;
  try{storage=localStorage}catch{}
  const loaded=loadNote(storage,id);note.value=loaded.value;
  if(!loaded.ok)status.textContent='Stockage indisponible : cette note restera temporaire.';
  note.addEventListener('input',()=>{status.textContent=saveNote(storage,id,note.value)?'Note enregistrée dans ce navigateur.':'Sauvegarde impossible : cette note restera temporaire.'});
}

const filterForm=document.querySelector('#filters');
if(filterForm){
  function applyFilters(){
    const params=new URLSearchParams(location.search),category=params.get('categorie')??'',tag=params.get('tag')??'';
    filterForm.elements.categorie.value=category;filterForm.elements.tag.value=tag;
    let count=0;
    for(const card of document.querySelectorAll('[data-recipe-card]')){
      card.hidden=!matchesFilters({category:card.dataset.category,tags:JSON.parse(card.dataset.tags)},category,tag);
      if(!card.hidden)count++;
    }
    document.querySelector('#filter-status').textContent=count?`${count} recette(s)`:'Aucune recette avec ces filtres.';
  }
  filterForm.addEventListener('submit',event=>{
    event.preventDefault();const params=new URLSearchParams(new FormData(filterForm));
    for(const [key,value] of [...params])if(!value)params.delete(key);
    history.pushState(null,'',location.pathname+(params.size?'?'+params:''));applyFilters();
  });
  document.querySelector('#clear-filters').addEventListener('click',()=>{history.pushState(null,'',location.pathname);applyFilters()});
  addEventListener('popstate',applyFilters);applyFilters();
}
