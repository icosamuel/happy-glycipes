let anchor;
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
    pop.querySelector('p').textContent=link.dataset.summary;
    pop.querySelector('a').href=link.href;
    pop.hidden=false;anchor.setAttribute('aria-expanded','true');positionPreview();
    pop.querySelector('button').focus();
  }else if(event.target.closest('[data-close-preview]'))closePreview(true);
  else if(pop && !pop.contains(event.target))closePreview();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closePreview(true)});
addEventListener('resize',positionPreview);addEventListener('scroll',positionPreview,true);
