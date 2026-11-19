const DB_NAME = 'dziennik-zywieniowy-catalog';
const DB_VERSION = 2;
let dbPromise;

export function normalizeText(value='') {
  return String(value).toLocaleLowerCase('pl-PL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/[^a-z0-9]+/g,' ').trim();
}

function searchPrefixes(value='') {
  const words = normalizeText(value).split(/\s+/).filter(Boolean);
  const tokens = new Set();
  for (const word of words) {
    for (let length = 1; length <= Math.min(4, word.length); length++) tokens.add(word.slice(0, length));
    tokens.add(word);
  }
  return [...tokens];
}

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve,reject)=>{
    if (!('indexedDB' in globalThis)) return reject(new Error('Ta przeglądarka nie obsługuje IndexedDB.'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of ['catalogA','catalogB']) {
        const store = db.objectStoreNames.contains(name) ? req.transaction.objectStore(name) : db.createObjectStore(name,{keyPath:'id'});
        if (!store.indexNames.contains('searchTokens')) store.createIndex('searchTokens','searchTokens',{multiEntry:true});
        // One-time upgrade: index records imported by the previous app version.
        const cursorReq = store.openCursor();
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (!cursor) return;
          const row = cursor.value;
          if (!Array.isArray(row.searchTokens)) {
            row.searchTokens = searchPrefixes(row.search || [row.name,row.brand,row.stores,row.category].join(' '));
            cursor.update(row);
          }
          cursor.continue();
        };
      }
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'});
    };
    req.onsuccess = ()=>resolve(req.result);
    req.onerror = ()=>reject(req.error || new Error('Nie udało się otworzyć katalogu.'));
  });
  return dbPromise;
}
function requestResult(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function activeStoreName(db){
  const tx=db.transaction('meta','readonly');
  const row=await requestResult(tx.objectStore('meta').get('activeStore'));
  return row?.value === 'catalogB' ? 'catalogB' : 'catalogA';
}

export async function getCatalogStats(){
  const db=await openDb(); const storeName=await activeStoreName(db);
  const count=await requestResult(db.transaction(storeName,'readonly').objectStore(storeName).count());
  const meta=await requestResult(db.transaction('meta','readonly').objectStore('meta').get('catalogStats'));
  return {count,updatedAt:meta?.updatedAt||null,source:meta?.source||'Open Food Facts',storeName};
}

export function normalizeImportedProduct(raw){
  const n=raw?.nutriments||{};
  const parse=(v)=>{if(v===null||v===undefined||v==='')return null;const x=Number(String(v).replace(',','.'));return Number.isFinite(x)&&x>=0?x:null;};
  const kcal=parse(raw.kcal100 ?? raw['energy-kcal_100g'] ?? n['energy-kcal_100g'] ?? n['energy-kcal_value']);
  const kj=parse(n['energy-kj_100g'] ?? raw['energy-kj_100g']);
  const energy=kcal ?? (kj!==null?kj/4.184:null);
  const name=String(raw.name||raw.product_name||raw.product_name_pl||raw.product_name_en||'').trim();
  const code=String(raw.code||raw.id||'').trim();
  if(!code||!name||energy===null||energy>950) return null;
  const stores=Array.isArray(raw.stores)?raw.stores.join(', '):String(raw.stores||'');
  const brand=String(raw.brand||raw.brands||'').trim();
  const search=normalizeText([name,brand,stores,raw.category||''].join(' '));
  return {
    id:`off:${code}`,code,name,brand,stores,quantity:String(raw.quantity||''),
    weight_grams:parse(raw.weight_grams ?? raw.unitWeight),kcal100:energy,
    protein100:parse(raw.protein100 ?? n.proteins_100g),fat100:parse(raw.fat100 ?? n.fat_100g),
    carbs100:parse(raw.carbs100 ?? n.carbohydrates_100g),fiber100:parse(raw.fiber100 ?? n.fiber_100g),
    image_url:raw.image_url||raw.image_front_small_url||'',category:String(raw.category||''),source:'Open Food Facts',search,searchTokens:searchPrefixes(search)
  };
}

async function putBatch(db,storeName,rows){
  if(!rows.length)return;
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(storeName,'readwrite'); const store=tx.objectStore(storeName);
    for(const row of rows) store.put(row);
    tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error||new Error('Błąd zapisu partii katalogu.')); tx.onabort=()=>reject(tx.error||new Error('Import przerwany.'));
  });
}

export async function importCatalogFile(file,onProgress=()=>{}){
  if(!file) throw new Error('Nie wybrano pliku.');
  if(!file.name.match(/\.(jsonl|ndjson|gz)$/i)) throw new Error('Wybierz plik .jsonl, .ndjson lub .jsonl.gz.');
  if(!file.stream) throw new Error('Przeglądarka nie obsługuje strumieniowego odczytu pliku.');
  const db=await openDb(); const active=await activeStoreName(db); const target=active==='catalogA'?'catalogB':'catalogA';
  await new Promise((resolve,reject)=>{const tx=db.transaction(target,'readwrite');tx.objectStore(target).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  let compressedRead=0;
  let stream=file.stream().pipeThrough(new TransformStream({transform(chunk,controller){compressedRead+=chunk.byteLength;controller.enqueue(chunk);}}));
  if(file.name.toLowerCase().endsWith('.gz')){
    if(typeof DecompressionStream==='undefined') throw new Error('Ta przeglądarka nie obsługuje dekompresji gzip. Użyj aktualnej wersji Chrome, Edge, Firefox lub Safari.');
    stream=stream.pipeThrough(new DecompressionStream('gzip'));
  }
  const reader=stream.getReader(); const decoder=new TextDecoder();
  let leftover='',batch=[],imported=0,scanned=0,lastProgress=0;
  try{
    while(true){
      const {value,done}=await reader.read();
      if(done) break;
      leftover+=decoder.decode(value,{stream:true});
      const lines=leftover.split('\n'); leftover=lines.pop()||'';
      for(const line of lines){
        scanned++; if(!line.trim()) continue;
        let raw; try{raw=JSON.parse(line);}catch{continue;}
        const product=normalizeImportedProduct(raw); if(product){batch.push(product);}
        if(batch.length>=500){imported+=batch.length;await putBatch(db,target,batch);batch=[];}
      }
      const pct=file.size?Math.min(99,Math.floor(compressedRead/file.size*100)):0;if(pct>lastProgress){lastProgress=pct;onProgress(pct,{imported,scanned});}
    }
    leftover+=decoder.decode();
    if(leftover.trim()){
      try{const p=normalizeImportedProduct(JSON.parse(leftover));if(p)batch.push(p);}catch{}
    }
    if(batch.length){imported+=batch.length;await putBatch(db,target,batch);}
    if(imported===0) throw new Error('W pliku nie znaleziono produktów z nazwą i prawidłowymi kaloriami / 100 g. Poprzednia baza pozostała aktywna.');
    const tx=db.transaction('meta','readwrite');
    tx.objectStore('meta').put({key:'activeStore',value:target});
    tx.objectStore('meta').put({key:'catalogStats',count:imported,updatedAt:new Date().toISOString(),source:'Open Food Facts'});
    await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
    onProgress(100,{imported,scanned});
    return {imported,scanned};
  }catch(error){try{reader.cancel();}catch{};throw error;}
}
export async function searchImportedCatalog(query,limit=30){
  const q=normalizeText(query); if(q.length<2)return [];
  const terms=q.split(/\s+/).filter(Boolean); const db=await openDb(); const storeName=await activeStoreName(db);
  const store=db.transaction(storeName,'readonly').objectStore(storeName);
  if(!store.indexNames.contains('searchTokens')) return [];
  const perTerm=await Promise.all(terms.map(term=>new Promise((resolve,reject)=>{
    const req=store.index('searchTokens').getAll(term.slice(0,4));
    req.onsuccess=()=>resolve(req.result||[]); req.onerror=()=>reject(req.error||new Error('Nie udało się przeszukać indeksu katalogu.'));
  })));
  if(perTerm.some(rows=>rows.length===0))return [];
  perTerm.sort((a,b)=>a.length-b.length);
  const otherIds=perTerm.slice(1).map(rows=>new Set(rows.map(row=>row.id)));
  const hits=[];
  for(const p of perTerm[0]){
    if(otherIds.some(ids=>!ids.has(p.id)))continue;
    const hay=p.search||normalizeText([p.name,p.brand,p.stores].join(' '));
    if(!terms.every(term=>hay.includes(term)))continue;
    let score=0; const name=normalizeText(p.name);
    if(name.startsWith(q))score+=8; if(name===q)score+=12; if(name.includes(q))score+=4; if(p.brand)score+=1;
    hits.push({...p,score});
  }
  hits.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'pl'));
  return hits.slice(0,limit).map(({score,...p})=>p);
}

export async function clearImportedCatalog(){
  const db=await openDb();
  await new Promise((resolve,reject)=>{const tx=db.transaction(['catalogA','catalogB','meta'],'readwrite');tx.objectStore('catalogA').clear();tx.objectStore('catalogB').clear();tx.objectStore('meta').delete('catalogStats');tx.objectStore('meta').put({key:'activeStore',value:'catalogA'});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
