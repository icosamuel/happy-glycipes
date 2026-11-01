import {parseArgs} from 'node:util';
import {publicFetch} from './public-fetch.js';
import {normalizeImport,writeImport} from './importer.js';
import {loadArticles} from './articles.js';
try {
  const {values}=parseArgs({options:{url:{type:'string'},recipe:{type:'string'}}});
  if(!values.url)throw Error('Usage : npm run import -- --url HTTPS_URL [--recipe INDEX]');
  const {html,finalUrl}=await publicFetch(values.url);
  const result=normalizeImport({html,url:values.url,finalUrl,choice:values.recipe===undefined?undefined:Number(values.recipe),articles:loadArticles()});
  const output=writeImport(result);
  console.log(`${output.dir} : ${output.comparison?'comparaison créée; brouillon existant préservé':'brouillon à relire, non publié'}.`);
  for(const warning of result.report.warnings)console.log(`- ${warning}`);
}catch(error){console.error(`Import impossible : ${error.message}`);process.exitCode=1}
