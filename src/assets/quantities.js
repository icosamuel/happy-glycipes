export function scaleQuantity(quantity,multiplier=1) {
  if(![1,2,3].includes(multiplier))throw Error('Multiplicateur invalide');
  return quantity===null?null:quantity*multiplier;
}
export function loadNote(storage,id) {
  try{return {value:storage.getItem(`happy-glycipes:note:${id}`)??'',ok:true}}
  catch{return {value:'',ok:false}}
}
export function saveNote(storage,id,value) {
  try{storage.setItem(`happy-glycipes:note:${id}`,value);return true}catch{return false}
}
