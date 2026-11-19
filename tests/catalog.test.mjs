import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeImportedProduct,normalizeText} from '../js/catalog.js';
test('normalizes Polish imported product and nutrient fields',()=>{
  const p=normalizeImportedProduct({id:'off:590',code:'590',name:'Bułka grahamka',brand:'Piekarnia',stores:['Lidl'],kcal100:265,protein100:9,fat100:3,carbs100:49});
  assert.equal(p.name,'Bułka grahamka');assert.equal(p.kcal100,265);assert.equal(p.id,'off:590');assert.ok(p.search.includes('bulka'));assert.ok(p.searchTokens.includes('bu'));assert.ok(p.searchTokens.includes('bulk'));assert.ok(p.searchTokens.includes('bulka'));
});
test('rejects product without reliable calories/name/code',()=>{
  assert.equal(normalizeImportedProduct({code:'x',name:'No kcal'}),null);
  assert.equal(normalizeImportedProduct({code:'x',name:'Bad kcal',kcal100:999}),null);
});
test('normalizes diacritics for search',()=>assert.equal(normalizeText('Bułka grahamka'),'bulka grahamka'));
