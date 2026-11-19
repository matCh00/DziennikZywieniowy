import test from 'node:test';
import assert from 'node:assert/strict';
import {searchOnline,API_VERSION} from '../js/api.js';
const oldFetch=globalThis.fetch;
test('client FatSecret selection calls only the configured Worker with source=fatsecret',async(t)=>{
  const urls=[];
  globalThis.fetch=async url=>{urls.push(String(url));return new Response(JSON.stringify({apiVersion:API_VERSION,requested:'fatsecret',sources:{fatsecret:{status:'ok',storageAllowed:false,products:[{id:'1',name:'Graham roll',kcal100:265,protein100:9,fat100:3,carbs100:49,storageAllowed:false}]}}}),{status:200});};
  t.after(()=>{globalThis.fetch=oldFetch;});
  const result=await searchOnline({query:'grahamka',source:'fatsecret',workerUrl:'https://worker.test',force:true});
  assert.equal(result.products.length,1);
  assert.equal(result.products[0].storageAllowed,false);
  assert.ok(urls[0].includes('/api/search?'));
  assert.ok(urls[0].includes('source=fatsecret'));
  assert.ok(!urls[0].includes('openfoodfacts'));
});
