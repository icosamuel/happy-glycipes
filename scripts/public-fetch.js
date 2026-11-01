import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {BlockList,isIP} from 'node:net';
export const MAX_BYTES=1_048_576;
const blocked=new BlockList();
for(const [base,bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',3]])blocked.addSubnet(base,bits,'ipv4');
blocked.addSubnet('2001::',23,'ipv6');blocked.addSubnet('2001:db8::',32,'ipv6');
const globalV6=new BlockList();globalV6.addSubnet('2000::',3,'ipv6');
export function isPublicAddress(address){
  const version=isIP(address);
  return version===4?!blocked.check(address,'ipv4'):version===6 && globalV6.check(address,'ipv6') && !blocked.check(address,'ipv6');
}
export function publicUrl(input){
  let url;try{url=new URL(input)}catch{throw Error('URL invalide : fournir une URL HTTPS publique.')}
  if(url.protocol!=='https:' || url.username || url.password || (url.port && url.port!=='443'))throw Error('HTTPS public uniquement, sans identifiants ni port personnalisé.');
  const host=url.hostname.replace(/^\[|\]$/g,'');
  if(host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||(isIP(host)&&!isPublicAddress(host)))throw Error('Destination privée ou réservée refusée.');
  url.hash='';return url;
}
function requestText(url,address,timeout){
  return new Promise((resolve,reject)=>{
    const req=https.get(url,{agent:false,headers:{'User-Agent':'Happy-Glycipes-import/1.0','Accept':'text/html, application/xhtml+xml','Accept-Encoding':'identity'},lookup:(_host,options,callback)=>callback(null,options.all?[address]:address.address,address.family)},response=>{
      if(Number(response.headers['content-length'])>MAX_BYTES){response.destroy();req.destroy(Error('Page trop volumineuse (1 Mio maximum).'));return}
      let size=0;const chunks=[];
      response.on('data',chunk=>{size+=chunk.length;if(size>MAX_BYTES){req.destroy(Error('Page trop volumineuse (1 Mio maximum).'));return}chunks.push(chunk)});
      response.on('error',reject);
      response.on('end',()=>resolve({status:response.statusCode,headers:response.headers,body:Buffer.concat(chunks).toString('utf8')}));
    });
    const timer=setTimeout(()=>req.destroy(Error('Délai réseau dépassé.')),timeout);
    req.on('close',()=>clearTimeout(timer));req.on('error',reject);
  });
}
export async function publicFetch(input,{resolve=host=>lookup(host,{all:true}),request=requestText,timeout=15000}={}){
  const deadline=Date.now()+timeout;
  let url=publicUrl(input);
  for(let redirects=0;redirects<=3;redirects++){
    const remaining=deadline-Date.now();if(remaining<=0)throw Error('Délai réseau dépassé.');
    const addresses=await Promise.race([resolve(url.hostname.replace(/^\[|\]$/g,'')),new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('Délai DNS dépassé.')),remaining);t.unref()})]);
    if(!addresses.length||addresses.some(a=>!isPublicAddress(a.address)))throw Error('Destination DNS privée ou réservée refusée.');
    const result=await request(url,addresses[0],Math.max(1,deadline-Date.now()));
    if(Buffer.byteLength(result.body)>MAX_BYTES)throw Error('Page trop volumineuse (1 Mio maximum).');
    if([301,302,303,307,308].includes(result.status)){
      if(!result.headers.location)throw Error('Redirection sans destination.');
      url=publicUrl(new URL(result.headers.location,url));continue;
    }
    if(result.status<200||result.status>=300)throw Error(`Erreur réseau HTTP ${result.status}. Réessayez ou préparez un brouillon manuel.`);
    if(result.headers['content-encoding'] && result.headers['content-encoding']!=='identity')throw Error('Encodage compressé inattendu.');
    return {html:result.body,finalUrl:url.href};
  }
  throw Error('Trop de redirections (3 maximum).');
}
