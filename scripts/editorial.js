import {existsSync} from 'node:fs';
export const reviewItems=['quantities','steps','relations','pantry','taxonomy','attribution','nutrition','rights','ambiguities'];
export function validateMedia(media,{exists=existsSync}={}){
  if(!/^assets\/media\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp|avif)$/.test(media.path))throw Error('Média : chemin local invalide.');
  if(!media.credit || !/^https:\/\//.test(media.source) || !media.permission?.license || !/^https:\/\//.test(media.permission?.evidenceUrl))throw Error('Média : crédit/source/permission documentée requis.');
  if(!exists(`src/${media.path}`))throw Error(`Média absent : ${media.path}`);
}
export function validateEditorial(w){
  if(!['reference-notes','licensed','original'].includes(w.rights?.mode) || !w.rights.text || !w.rights.photos)throw Error(`${w.id}: droits éditoriaux incomplets`);
  for(const media of w.media??[])validateMedia(media);
  if(w.status==='published'){
    if(!w.review?.reviewedBy || !/^\d{4}-\d{2}-\d{2}$/.test(w.review.date) || reviewItems.some(key=>w.review.checklist?.[key]!==true))throw Error(`${w.id}: relecture éditoriale incomplète`);
    if(w.rights.mode!=='reference-notes' && !w.rights.evidence)throw Error(`${w.id}: preuve de droits textuels absente`);
  }
}
