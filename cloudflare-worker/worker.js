const API_VERSION = 'dziennik-zywieniowy-api-v6';
const FS_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const FS_SEARCH_URL = 'https://platform.fatsecret.com/rest/foods/search/v6';
const OFF_SEARCH_URL = 'https://search.openfoodfacts.org/search';
let tokenMemo = { value: null, expiresAt: 0 };
let tokenPromise = null;
const providerCache = new Map();
const providerFlights = new Map();
const PROVIDER_CACHE_MS = 10 * 60 * 1000;

function json(data,status=200,headers={}) {
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
}
function corsHeaders(request,env){
  const origin=request.headers.get('Origin')||'';
  const allowed=env.ALLOWED_ORIGIN;
  const allowOrigin=allowed ? (origin===allowed ? origin : 'null') : '*';
  return {'access-control-allow-origin':allowOrigin,'access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':'Content-Type, Accept','vary':'Origin'};
}
function num(v){if(v===null||v===undefined||v==='')return null;const x=Number(v);return Number.isFinite(x)&&x>=0?x:null;}
function asArray(value){if(!value)return [];return Array.isArray(value)?value:[value];}
function mapFatSecretFood(food){
  const servings=asArray(food?.servings?.serving);
  let serving=servings.find(s=>String(s.metric_serving_unit||'').toLowerCase()==='g'&&Math.abs(Number(s.metric_serving_amount)-100)<0.01);
  if(!serving) serving=servings.find(s=>String(s.metric_serving_unit||'').toLowerCase()==='g'&&num(s.metric_serving_amount)>0);
  if(!serving){
    serving=servings.find(s=>/100\s*g/i.test(String(s.serving_description||'')));
  }
  if(!serving) return null;
  const amount=(String(serving.metric_serving_unit||'').toLowerCase()==='g' ? num(serving.metric_serving_amount) : /100\s*g/i.test(String(serving.serving_description||'')) ? 100 : null);
  if(!amount) return null;
  const factor=100/amount;
  const multiply=(v)=>{const n=num(v);return n===null?null:Math.round(n*factor*10)/10;};
  const kcal=multiply(serving.calories);
  if(kcal===null)return null;
  return {id:String(food.food_id||''),name:String(food.food_name||'Produkt FatSecret'),brand:String(food.brand_name||''),kcal100:kcal,
    protein100:multiply(serving.protein),fat100:multiply(serving.fat),carbs100:multiply(serving.carbohydrate),fiber100:multiply(serving.fiber),
    source:'FatSecret',sourceId:String(food.food_id||''),servingId:String(serving.serving_id||''),unitWeight:null};
}
async function getFatSecretToken(env){
  if(!env.FATSECRET_CLIENT_ID||!env.FATSECRET_CLIENT_SECRET)throw new Error('Brak sekretów FATSECRET_CLIENT_ID / FATSECRET_CLIENT_SECRET w Cloudflare Worker.');
  if(tokenMemo.value&&tokenMemo.expiresAt>Date.now()+60000)return tokenMemo.value;
  if(tokenPromise)return tokenPromise;
  tokenPromise=(async()=>{
    const basic=btoa(`${env.FATSECRET_CLIENT_ID}:${env.FATSECRET_CLIENT_SECRET}`);
    const response=await fetch(FS_TOKEN_URL,{method:'POST',headers:{Authorization:`Basic ${basic}`,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'client_credentials',scope:'premier'})});
    const body=await response.json().catch(()=>({}));
    if(!response.ok||!body.access_token)throw new Error(`OAuth FatSecret: HTTP ${response.status}. ${body.error_description||body.error||'Sprawdź klucze i uprawnienie premier.'}`);
    tokenMemo={value:body.access_token,expiresAt:Date.now()+Math.max(60,Number(body.expires_in||3600)-60)*1000};
    return tokenMemo.value;
  })().finally(()=>{tokenPromise=null;});
  return tokenPromise;
}
async function searchFatSecret(query,env,limit=30){
  const token=await getFatSecretToken(env);
  const url=new URL(FS_SEARCH_URL);
  url.searchParams.set('search_expression',query);
  url.searchParams.set('page_number','0');
  url.searchParams.set('max_results',String(Math.min(50,Math.max(1,limit))));
  url.searchParams.set('region','PL');
  url.searchParams.set('language','pl');
  url.searchParams.set('format','json');
  const response=await fetch(url.toString(),{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(`Food Search FatSecret: HTTP ${response.status}. ${body.error?.message||body.error_description||'Sprawdź dostęp do regionu PL oraz scope premier.'}`);
  const foods=asArray(body?.foods?.food);
  return foods.map(mapFatSecretFood).filter(Boolean);
}
function extractOffHits(body){
  if(Array.isArray(body))return body;
  if(Array.isArray(body?.hits))return body.hits.map(x=>x._source||x);
  if(Array.isArray(body?.hits?.hits))return body.hits.hits.map(x=>x._source||x);
  if(Array.isArray(body?.products))return body.products;
  if(Array.isArray(body?.results))return body.results;
  if(Array.isArray(body?.data))return body.data;
  return [];
}
function mapOffProduct(p){
  const n=p.nutriments||{};
  const kcal=num(n['energy-kcal_100g']??p.kcal100);
  const kj=num(n['energy-kj_100g']);
  const energy=kcal??(kj!==null?kj/4.184:null);
  const name=String(p.product_name_pl||p.product_name||p.product_name_en||p.generic_name||'').trim();
  if(!name||energy===null)return null;
  return {id:String(p.code||p._id||name),name,brand:String(p.brands||''),store:String(p.stores||''),kcal100:Math.round(energy*10)/10,
    protein100:num(n.proteins_100g),fat100:num(n.fat_100g),carbs100:num(n.carbohydrates_100g),fiber100:num(n.fiber_100g),
    image:p.image_front_small_url||p.image_url||'',source:'Open Food Facts',sourceId:String(p.code||p._id||'')};
}
async function searchOff(query,env,limit=30){
  const fields=['code','product_name','product_name_pl','generic_name','brands','stores','quantity','nutriments','categories','image_front_small_url'];
  const response=await fetch(OFF_SEARCH_URL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','User-Agent':`DziennikZywieniowy/1.0 (${env.CONTACT_EMAIL||'contact@example.invalid'})`},body:JSON.stringify({q:query,langs:['pl','en'],page_size:Math.min(50,Math.max(1,limit)),page:1,fields})});
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(`Open Food Facts: HTTP ${response.status}. ${body.detail||body.error||'Usługa wyszukiwania chwilowo niedostępna.'}`);
  return extractOffHits(body).map(mapOffProduct).filter(Boolean);
}
async function runSource(source,query,env,limit){
  if(!['fatsecret','off'].includes(source))throw new Error(`Nieznane źródło: ${source}`);
  const key=`${source}|${query.toLocaleLowerCase('pl-PL')}|${limit}`;
  const cached=providerCache.get(key);
  if(cached&&cached.expiresAt>Date.now())return cached.products;
  if(providerFlights.has(key))return providerFlights.get(key);
  const job=(source==='fatsecret'?searchFatSecret(query,env,limit):searchOff(query,env,limit))
    .then(products=>{providerCache.set(key,{products,expiresAt:Date.now()+PROVIDER_CACHE_MS});if(providerCache.size>250){for(const [k,v] of providerCache){if(v.expiresAt<=Date.now())providerCache.delete(k);}while(providerCache.size>250)providerCache.delete(providerCache.keys().next().value);}return products;})
    .finally(()=>providerFlights.delete(key));
  providerFlights.set(key,job);return job;
}
async function handleSearch(url,env){
  const query=(url.searchParams.get('q')||'').trim();
  const source=url.searchParams.get('source')||'fatsecret';
  const limit=Math.min(50,Math.max(1,Number(url.searchParams.get('limit')||30)));
  if(query.length<2||query.length>100)return json({error:'Zapytanie musi mieć od 2 do 100 znaków.'},400);
  if(!['fatsecret','off','all'].includes(source))return json({error:'Źródło musi mieć wartość fatsecret, off lub all.'},400);
  const wanted=source==='all'?['fatsecret','off']:[source];
  const pairs=await Promise.all(wanted.map(async provider=>{
    try{return [provider,{status:'ok',products:await runSource(provider,query,env,limit)}];}
    catch(error){return [provider,{status:'error',error:String(error?.message||error)}];}
  }));
  const sources=Object.fromEntries(pairs);
  if(sources.fatsecret) sources.fatsecret.storageAllowed=String(env.FATSECRET_STORAGE_ALLOWED||'').toLowerCase()==='true';
  const products=pairs.flatMap(([provider,result])=>(result.products||[]).map(p=>({...p,source:provider==='fatsecret'?'FatSecret':'Open Food Facts',storageAllowed:provider==='fatsecret'?sources.fatsecret.storageAllowed:true})));
  return json({apiVersion:API_VERSION,requested:source,sources,products,servedBy:'Cloudflare Worker'});
}

export default {
  async fetch(request,env={}){
    const url=new URL(request.url); const cors=corsHeaders(request,env);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'access-control-max-age':'86400'}});
    const origin=request.headers.get('Origin')||'';
    if(env.ALLOWED_ORIGIN&&origin&&origin!==env.ALLOWED_ORIGIN)return json({error:'Origin nie jest dozwolony.'},403,cors);
    if(url.pathname==='/health')return json({ok:true,apiVersion:API_VERSION,sources:{fatsecret:Boolean(env.FATSECRET_CLIENT_ID&&env.FATSECRET_CLIENT_SECRET),fatsecretStorageAllowed:String(env.FATSECRET_STORAGE_ALLOWED||'').toLowerCase()==='true',off:true},region:'PL'},200,cors);
    if(url.pathname==='/api/search'&&request.method==='GET'){
      const response=await handleSearch(url,env);
      const headers=new Headers(response.headers);for(const [k,v] of Object.entries(cors))headers.set(k,v);
      return new Response(response.body,{status:response.status,headers});
    }
    return json({error:'Not found'},404,cors);
  }
};

export const __test = {mapFatSecretFood,mapOffProduct,extractOffHits,handleSearch,API_VERSION};
