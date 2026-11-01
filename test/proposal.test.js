import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authorize,parseProposal,retryMode} from '../scripts/proposal.js';
test('seuls les mainteneurs autorisent une exécution privilégiée',()=>{
  for(const role of ['read','triage','none',undefined])assert.throws(()=>authorize(role),/mainteneur/);
  for(const role of ['write','maintain','admin'])assert.doesNotThrow(()=>authorize(role));
});
test('les champs publics sont des données; URL privée et chaîne commande refusées',()=>{
  assert.equal(parseProposal('### URL\n\nhttps://example.com/recette\n\n### Notes\n$(evil)'),'https://example.com/recette');
  for(const value of ['$(whoami)','https://127.0.0.1/','file:///etc/passwd'])assert.throws(()=>parseProposal(`### URL\n\n${value}`));
});
test('relance compare sans écraser; PR fermée ne crée pas de doublon',()=>{
  assert.equal(retryMode(undefined,false),'initial');
  assert.equal(retryMode({state:'open'},true),'comparison');
  assert.equal(retryMode({state:'closed'},true),'closed');
});
