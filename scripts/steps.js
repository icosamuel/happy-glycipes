import {escape as e} from './content.js';
export function quantityToken(w,kind,id) {
  if(kind==='allocation')return w.allocations?.find(a=>a.target===id)?.quantity;
  if(kind==='count')return w.counts?.[id];
  if(kind==='ingredient')return w.ingredients.find(i=>i.id===id)?.quantity;
}
export function expandStep(text,w,{html=false,link=id=>id}={}) {
  const pattern=/\{\{(allocation|count|ingredient|article):([a-z0-9-]+)\}\}/g;
  let output='',last=0;
  for(const match of text.matchAll(pattern)){
    output+=html?e(text.slice(last,match.index)):text.slice(last,match.index);
    const [,kind,id]=match;
    if(kind==='article')output+=link(id);
    else {
      const quantity=quantityToken(w,kind,id);
      if(!Number.isFinite(quantity))throw Error(`${w.id}: quantité structurée inconnue ${kind}:${id}`);
      output+=html?`<span data-scale="${quantity}">${quantity}</span>`:quantity;
    }
    last=match.index+match[0].length;
  }
  return output+(html?e(text.slice(last)):text.slice(last));
}
