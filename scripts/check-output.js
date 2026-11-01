import {readdirSync,readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {prefix} from './content.js';
const files=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(join(dir,d.name)):[join(dir,d.name)]);
let count=0;
for(const file of files('_site').filter(f=>f.endsWith('.html'))){
  const html=readFileSync(file,'utf8');
  for(const [,target] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(!target.startsWith('/'))continue;
    if(!target.startsWith(prefix))throw Error(`${file}: préfixe incorrect: ${target}`);
    const relative=target.slice(prefix.length).split(/[?#]/)[0];
    const path=join('_site',relative)+(relative.endsWith('/')||!relative?'index.html':'');
    if(!existsSync(path))throw Error(`${file}: lien cassé: ${target}`);
    count++;
  }
  for(const [,data] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    const ld=JSON.parse(data);if(ld.wiki||ld.netCarbs||ld['@type']!=='Recipe')throw Error(`${file}: JSON-LD invalide`);
  }
}
console.log(`${count} liens et assets internes vérifiés.`);
