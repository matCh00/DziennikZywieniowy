import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare-worker/worker.js';

const originalFetch = globalThis.fetch;
const env = {FATSECRET_CLIENT_ID:'client-id',FATSECRET_CLIENT_SECRET:'client-secret'};

test('source=fatsecret calls only FatSecret OAuth + Food Search v6', async (t) => {
  const calls=[];
  globalThis.fetch=async (input,init={})=>{
    const url=String(input);calls.push({url,init});
    if(url.includes('oauth.fatsecret.com'))return new Response(JSON.stringify({access_token:'test-token',expires_in:3600}),{status:200});
    if(url.includes('/rest/foods/search/v6')){
      const u=new URL(url);assert.equal(u.searchParams.get('region'),'PL');assert.equal(u.searchParams.get('language'),'pl');
      assert.equal(init.headers.Authorization,'Bearer test-token');
      return new Response(JSON.stringify({foods:{food:[{food_id:'123',food_name:'Bułka grahamka',brand_name:'Example',servings:{serving:[{serving_id:'s1',serving_description:'100 g',metric_serving_amount:'100',metric_serving_unit:'g',calories:'265',protein:'9',fat:'3',carbohydrate:'49',fiber:'6'}]}}]}}),{status:200});
    }
    throw new Error(`Unexpected provider call: ${url}`);
  };
  t.after(()=>{globalThis.fetch=originalFetch;});
  const response=await worker.fetch(new Request('https://worker.test/api/search?source=fatsecret&q=grahamka'),env);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.requested,'fatsecret');
  assert.equal(body.sources.fatsecret.status,'ok');
  assert.equal(body.sources.fatsecret.products[0].kcal100,265);
  assert.equal(body.sources.fatsecret.storageAllowed,false);
  assert.equal(body.products[0].storageAllowed,false);
  assert.equal(calls.length,2);
  assert.ok(calls.every(x=>x.url.includes('fatsecret.com')));
  assert.ok(!calls.some(x=>x.url.includes('openfoodfacts.org')||x.url.includes('search.openfoodfacts.org')));
});

test('source=off calls only Search-a-licious and does not call FatSecret', async (t) => {
  const calls=[];
  globalThis.fetch=async (input,init={})=>{
    const url=String(input);calls.push({url,init});
    assert.ok(url.includes('search.openfoodfacts.org/search'));
    assert.equal(init.method,'POST');
    return new Response(JSON.stringify({hits:[{_source:{code:'5901',product_name:'Chleb testowy',brands:'Piekarnia',nutriments:{'energy-kcal_100g':250,proteins_100g:8}}}]}),{status:200});
  };
  t.after(()=>{globalThis.fetch=originalFetch;});
  const response=await worker.fetch(new Request('https://worker.test/api/search?source=off&q=chleb'),{});
  const body=await response.json();
  assert.equal(body.sources.off.status,'ok');
  assert.equal(body.sources.off.products[0].kcal100,250);
  assert.equal(calls.length,1);
  assert.ok(calls[0].url.includes('search.openfoodfacts.org'));
});

test('source=all isolates provider failures and retains the successful source', async (t) => {
  const calls=[];
  globalThis.fetch=async (input,init={})=>{
    const url=String(input);calls.push(url);
    if(url.includes('/rest/foods/search/v6'))return new Response(JSON.stringify({error:'access_denied'}),{status:401});
    if(url.includes('oauth.fatsecret.com'))return new Response(JSON.stringify({error:'invalid_client'}),{status:401});
    if(url.includes('search.openfoodfacts.org/search'))return new Response(JSON.stringify({hits:[{_source:{code:'2',product_name:'Jabłko',nutriments:{'energy-kcal_100g':52}}}]}),{status:200});
    throw new Error(`Unexpected call ${url}`);
  };
  t.after(()=>{globalThis.fetch=originalFetch;});
  const response=await worker.fetch(new Request('https://worker.test/api/search?source=all&q=jablko'),env);
  const body=await response.json();
  assert.equal(body.sources.fatsecret.status,'error');
  assert.equal(body.sources.off.status,'ok');
  assert.equal(body.products.length,1);
  assert.ok(calls.some(x=>x.includes('fatsecret.com')));
  assert.ok(calls.some(x=>x.includes('search.openfoodfacts.org')));
});


test('FatSecret persistent storage flag is opt-in and returned to the client', async (t) => {
  globalThis.fetch=async (input)=>{
    const url=String(input);
    if(url.includes('/rest/foods/search/v6'))return new Response(JSON.stringify({foods:{food:[{food_id:'987',food_name:'Milk',servings:{serving:[{serving_description:'100 g',metric_serving_amount:'100',metric_serving_unit:'g',calories:'50'}]}}]}}),{status:200});
    throw new Error(`Unexpected call ${url}`);
  };
  t.after(()=>{globalThis.fetch=originalFetch;});
  const response=await worker.fetch(new Request('https://worker.test/api/search?source=fatsecret&q=milk'),{...env,FATSECRET_STORAGE_ALLOWED:'true'});
  const body=await response.json();
  assert.equal(body.sources.fatsecret.storageAllowed,true);
  assert.equal(body.products[0].storageAllowed,true);
});
