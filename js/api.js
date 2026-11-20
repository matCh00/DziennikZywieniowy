const API_CACHE_TTL_MS = 10 * 60 * 1000;
const memoryCache = new Map();
const inFlight = new Map();
export const API_VERSION = 'dziennik-zywieniowy-api-v6';

function normalizeText(v=''){return String(v).toLocaleLowerCase('pl-PL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');}
function finite(v){if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)&&n>=0?n:null;}
export function normalizeApiProduct(raw, source){
  if(source==='fatsecret'){
    const name=String(raw.name||raw.food_name||'').trim();
    const kcal=finite(raw.kcal100 ?? raw.calories_100g);
    if(!name||kcal===null)return null;
    return {id:`fatsecret:${raw.id||raw.food_id||name}`,name,brand:raw.brand||'',store:raw.store||'FatSecret',kcal100:kcal,
      protein100:finite(raw.protein100),fat100:finite(raw.fat100),carbs100:finite(raw.carbs100),fiber100:finite(raw.fiber100),
      unitWeight:finite(raw.unitWeight),image:raw.image||'',source:'FatSecret',sourceId:String(raw.id||raw.food_id||''),storageAllowed:raw.storageAllowed===true};
  }
  const n=raw.nutriments||{};
  const kcal=finite(raw.kcal100 ?? n['energy-kcal_100g'] ?? (finite(n['energy-kj_100g'])!==null?finite(n['energy-kj_100g'])/4.184:null));
  const name=String(raw.name||raw.product_name||'').trim();
  if(!name||kcal===null)return null;
  return {id:`off:${raw.code||raw.id||name}`,name,brand:raw.brand||raw.brands||'',store:raw.stores||'Open Food Facts',kcal100:kcal,
    protein100:finite(raw.protein100??n.proteins_100g),fat100:finite(raw.fat100??n.fat_100g),carbs100:finite(raw.carbs100??n.carbohydrates_100g),fiber100:finite(raw.fiber100??n.fiber_100g),
    unitWeight:finite(raw.unitWeight),image:raw.image||raw.image_front_small_url||'',source:'Open Food Facts',sourceId:String(raw.code||raw.id||'')};
}

export async function searchOnline({query,source,workerUrl,force=false}){
  const q=String(query||'').trim();
  if(q.length<2)throw new Error('Wpisz co najmniej 2 znaki.');
  if(!['fatsecret','off','all'].includes(source))throw new Error('Nieznane źródło danych.');
  if(!workerUrl)throw new Error('Ustaw adres serwera w Ustawieniach.');
  const base=workerUrl.replace(/\/+$/,'');
  let url; try{url=new URL(base);}catch{throw new Error('Adres serwera nie jest prawidłowy.');}
  if(url.protocol!=='https:' && url.hostname!=='localhost')throw new Error('Adres serwera musi zaczynać się od https://.');
  const key=`${base}|${source}|${normalizeText(q)}`;
  if(!force){const cached=memoryCache.get(key);if(cached&&Date.now()-cached.at<API_CACHE_TTL_MS)return {...cached.value,cached:true};}
  if(inFlight.has(key))return inFlight.get(key);
  const promise=(async()=>{
    const endpoint=new URL('/api/search',base);
    endpoint.searchParams.set('q',q);endpoint.searchParams.set('source',source);endpoint.searchParams.set('limit','30');
    const response=await fetch(endpoint.toString(),{method:'GET',headers:{Accept:'application/json'},signal:AbortSignal.timeout?AbortSignal.timeout(25000):undefined});
    const body=await response.json().catch(()=>({error:'Serwer zwrócił nieprawidłową odpowiedź.'}));
    if(!response.ok)throw new Error(body.error||`Błąd serwera (${response.status}).`);
    if(body.apiVersion && body.apiVersion!==API_VERSION)throw new Error(`Nieaktualna wersja serwera (${body.apiVersion}). Zaktualizuj serwer do wersji ${API_VERSION}.`);
    const requested=source==='all'?['fatsecret','off']:[source];
    const missing=requested.filter(s=>body.sources?.[s]?.status!=='ok');
    const results=[];
    for(const s of requested){
      const sourceResult=body.sources?.[s];
      if(sourceResult?.status==='ok'){
        for(const raw of sourceResult.products||[]){const p=normalizeApiProduct(raw,s);if(p){if(s==='fatsecret')p.storageAllowed=sourceResult.storageAllowed===true;results.push(p);}}
      }
    }
    if(!results.length){const details=missing.map(s=>`${s==='fatsecret'?'FatSecret':'Open Food Facts'}: ${body.sources?.[s]?.error||'brak wyników'}`).join(' · ');throw new Error(details||body.error||'Nie znaleziono produktów.');}
    const unique=new Map();for(const p of results){if(!unique.has(p.id))unique.set(p.id,p);}
    const value={products:[...unique.values()],source,requested,sourceStatus:body.sources||{},servedBy:body.servedBy||'Cloudflare Worker'};
    memoryCache.set(key,{at:Date.now(),value});
    return value;
  })().finally(()=>inFlight.delete(key));
  inFlight.set(key,promise);return promise;
}

export async function checkWorker(workerUrl){
  if(!workerUrl)throw new Error('Najpierw wpisz adres serwera.');
  const response=await fetch(workerUrl.replace(/\/+$/,'')+'/health',{headers:{Accept:'application/json'}});
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(body.error||`Serwer zwrócił błąd (kod ${response.status}).`);
  if(body.apiVersion!==API_VERSION)throw new Error(`Wersja serwera jest nieaktualna: ${body.apiVersion||'brak'}. Oczekiwana: ${API_VERSION}.`);
  return body;
}
