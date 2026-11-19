import {searchImportedCatalog,importCatalogFile,getCatalogStats,clearImportedCatalog,normalizeText} from './catalog.js';
import {searchOnline,checkWorker} from './api.js';
import {firebaseConfig} from './firebase-config.js';
import {firebaseConfigured,initFirebaseClient} from './firebase-sync.js';
import {seedProducts} from './seed-products.js';
import {validateProfileData,profilesNeedInitialSetup,readProfileForm} from './profile-utils.js';

const $=(id)=>document.getElementById(id);
const ico=(name)=>`<svg class="i" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const round1=(v)=>Math.round(Number(v)*10+1e-9)/10;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const dayShift=(iso,offset)=>{const d=new Date(`${iso}T12:00:00`);d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const fmt=(n,d=0)=>Number.isFinite(Number(n))?new Intl.NumberFormat('pl-PL',{maximumFractionDigits:d,minimumFractionDigits:0}).format(Number(n)):'—';
const nval=(v)=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(',','.'));return Number.isFinite(n)?n:null;};
const STORE_KEY='dziennik-zywieniowy-v3';
let userStoreKey=null;let firebaseClient=null;let authUnsubscribe=null;let authMode='login';
const PAL_LABELS={'1.4':'Niska','1.6':'Umiarkowana','1.8':'Aktywna','2':'Bardzo aktywna'};

const mealNames=['Śniadanie','II śniadanie','Obiad','Podwieczorek','Kolacja','Przekąski'];
const defaultState=()=>({activeProfile:'female',profiles:{female:null,male:null},logs:{female:{},male:{}},weights:{female:[],male:[]},customProducts:[],recipes:[],plans:[],workerUrl:'',catalogMode:'saved',onlineSource:'fatsecret'});
let state=defaultState();let firebaseSync=null;let firebaseSaveTimer=null;let selectedProduct=null;let portalResults=[];let portalInput=null;let searchGeneration=0;let toastTimer;let productsFilterTimer;let editingRecipeId=null;let editingPlanId=null;let editingProductId=null;let productsLimit=48;let productsQuery="";
function loadState(key=userStoreKey||STORE_KEY){try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&typeof x==='object'?{...defaultState(),...x,profiles:{...defaultState().profiles,...(x.profiles||{})},logs:{...defaultState().logs,...(x.logs||{})},weights:{...defaultState().weights,...(x.weights||{})}}:defaultState();}catch{return defaultState();}}
function save(){try{if(!userStoreKey)return;localStorage.setItem(userStoreKey,JSON.stringify(state));$('saveState').innerHTML=firebaseSync?'<i></i> Zapisano · sync':'<i></i> Zapisano';}catch{$('saveState').innerHTML='<i style="background:#c47d52"></i> Brak miejsca';}if(firebaseSync){clearTimeout(firebaseSaveTimer);const sync=firebaseSync;const snapshot=JSON.parse(JSON.stringify(state));firebaseSaveTimer=setTimeout(()=>{if(firebaseSync!==sync)return;sync.save(snapshot).then(()=>{if(firebaseSync===sync)$('saveState').innerHTML='<i></i> Zsynchronizowano';}).catch(()=>{if(firebaseSync===sync)$('saveState').innerHTML='<i style="background:#c47d52"></i> Błąd sync';});},700);}}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700);}
function activeProfile(){return state.activeProfile;}
function profile(){return state.profiles[activeProfile()];}
function ensureDay(date){const p=activeProfile();if(!state.logs[p][date])state.logs[p][date]={entries:[],water:0};return state.logs[p][date];}
function profileMetrics(p,sex){if(!p)return null;const W=Number(p.weight),H=Number(p.height)/100,A=Number(p.age);let ree;
  if(sex==='female'){
    if(A<30)ree=10.4*W+615*H-282;else if(A<60)ree=8.18*W+502*H-11.6;else ree=8.52*W+421*H+10.7;
  }else{
    if(A<30)ree=14.4*W+313*H+113;else if(A<60)ree=11.4*W+541*H-137;else ree=11.4*W+541*H-256;
  }
  const tdee=ree*Number(p.pal);const target=Math.max(ree,tdee*(1-Number(p.goal||0)/100));return {ree,tdee,target,bmi:W/(H*H),weight:W,deficit:Math.max(0,tdee-target)};
}
function bmiText(bmi){if(bmi<18.5)return 'niedowaga';if(bmi<25)return 'zakres prawidłowy';if(bmi<30)return 'nadwaga';if(bmi<35)return 'otyłość I stopnia';if(bmi<40)return 'otyłość II stopnia';return 'otyłość III stopnia';}
function render(){
  const date=$('entryDate').value||today();const p=profile();const metrics=profileMetrics(p,activeProfile());const day=ensureDay(date);const consumed=day.entries.reduce((s,e)=>s+Number(e.kcal||0),0);const target=metrics?Math.round(metrics.target):null;const remain=target===null?null:target-consumed;
  $('consumed').innerHTML=`${fmt(consumed)} <small>kcal</small>`;$('dailyTarget').innerHTML=target===null?'—':`${fmt(target)} <small>kcal</small>`;
  $('remaining').textContent=remain===null?'—':fmt(Math.abs(remain));$('balance').textContent=remain===null?'—':remain>=0?`${fmt(remain)} kcal`:`+${fmt(-remain)} kcal`; $('balance').style.color=remain!==null&&remain<0?'var(--red)':'var(--green)';
  $('targetHint').textContent=metrics?remain>=0?`Do celu pozostało ${fmt(remain)} kcal.`:`Przekroczono cel o ${fmt(-remain)} kcal.`:'Uzupełnij parametry profilu, aby obliczyć dzienny cel.';
  const pct=target?Math.min(100,consumed/target*100):0;$('progressBar').style.width=`${pct}%`;$('progressText').textContent=`${Math.round(pct)}% celu`;$('progressTarget').textContent=target?`${fmt(target)} kcal`: 'cel';$('calorieRing').style.background=`conic-gradient(${remain!==null&&remain<0?'#bd6758':'var(--profile-accent, var(--green))'} ${pct*3.6}deg,#e8efe8 ${pct*3.6}deg)`;
  $('ree').textContent=metrics?fmt(Math.round(metrics.ree)):'—';$('tdee').textContent=metrics?fmt(Math.round(metrics.tdee)):'—';$('bmi').textContent=metrics?fmt(metrics.bmi,1):'—';$('bmiLabel').textContent=metrics?bmiText(metrics.bmi):'uzupełnij profil';
  const weightList=state.weights[activeProfile()]||[];const latest=weightList.at(-1);$('weightNow').textContent=latest?fmt(latest.weight,1):metrics?fmt(metrics.weight,1):'—';
  $('profileSummary').innerHTML=metrics?`<div><strong>${p.age} lat · ${p.height} cm · ${p.weight} kg</strong><p class="muted">Aktywność: PAL ${p.pal} (${PAL_LABELS[String(p.pal)]||'własna'}) · Cel: ${p.goal===0?'utrzymanie':`deficyt ${p.goal}%`} · ${fmt(metrics.target)} kcal / dobę</p></div><button class="primary" id="setupProfile">${ico('pencil')} Edytuj parametry</button>`:`<div><strong>Skonfiguruj profil</strong><p class="muted">Wiek, wzrost, masa ciała i aktywność pozwolą oszacować zapotrzebowanie energetyczne.</p></div><button class="primary" id="setupProfile">${ico('plus')} Uzupełnij profil</button>`;
  $('setupProfile').onclick=openProfileDialog;
  renderMeals(day);renderHydration(day);renderWeekStats();renderWeights();renderPlanDaySummary();
}
function renderMeals(day){
  const groups=mealNames.map(name=>({name,entries:day.entries.filter(e=>e.meal===name)})).filter(g=>g.entries.length);
  $('entryCount').textContent=`${day.entries.length} ${day.entries.length===1?'pozycja':'pozycji'}`;
  if(!groups.length){$('mealsList').innerHTML='<div class="empty">Nie dodano jeszcze produktów do tego dnia.</div>';}else{
    $('mealsList').innerHTML=groups.map(g=>`<div class="meal-group"><div class="meal-heading"><span>${escapeHTML(g.name)}</span><small>${fmt(g.entries.reduce((s,e)=>s+e.kcal,0))} kcal · ${groupMacroText(g.entries)}</small></div>${g.entries.map(e=>`<div class="meal-row"><div><strong>${escapeHTML(e.name)}</strong><small>${fmt(e.grams,1)} g · ${fmt(e.kcal100,0)} kcal / 100 g</small><small class="meal-macros">${entryMacroText(e)}</small></div><span class="meal-kcal">${fmt(e.kcal)} kcal</span><button type="button" class="icon-delete" data-remove="${escapeHTML(e.id)}" aria-label="Usuń ${escapeHTML(e.name)}" title="Usuń wpis">${ico('x')}</button></div>`).join('')}</div>`).join('');
  }
  const sums=macroTotals(day.entries);
  $('proteinTotal').textContent=`${fmt(sums.p,1)} g`;$('fatTotal').textContent=`${fmt(sums.f,1)} g`;$('carbsTotal').textContent=`${fmt(sums.c,1)} g`;
  $('proteinShare').textContent=sums.energy?`${fmt(sums.pct.p,0)}% energii`:'—';
  $('fatShare').textContent=sums.energy?`${fmt(sums.pct.f,0)}% energii`:'—';
  $('carbsShare').textContent=sums.energy?`${fmt(sums.pct.c,0)}% energii`:'—';
  $('proteinBar').style.width=`${sums.energy?sums.pct.p:0}%`;$('fatBar').style.width=`${sums.energy?sums.pct.f:0}%`;$('carbsBar').style.width=`${sums.energy?sums.pct.c:0}%`;
  $('macroNote').textContent=!day.entries.length?'':sums.missing?`${sums.missing} z ${day.entries.length} pozycji nie ma pełnych makroskładników — ich wartości nie wchodzą do sumy.`:'Udziały energii policzone z 4/9/4 kcal na gram; błonnik i zaokrąglenia etykiet mogą zmieniać sumę kcal.';
}
function macroTotals(entries){
  const t={p:0,f:0,c:0,energy:0,missing:0,pct:{p:0,f:0,c:0}};
  for(const e of entries){
    const has=['protein','fat','carbs'].some(k=>e[k]!==null&&e[k]!==undefined&&Number.isFinite(Number(e[k])));
    if(!has){t.missing++;continue;}
    t.p+=Number.isFinite(Number(e.protein))?Number(e.protein):0;
    t.f+=Number.isFinite(Number(e.fat))?Number(e.fat):0;
    t.c+=Number.isFinite(Number(e.carbs))?Number(e.carbs):0;
  }
  t.energy=t.p*4+t.f*9+t.c*4;
  if(t.energy>0){t.pct={p:t.p*4/t.energy*100,f:t.f*9/t.energy*100,c:t.c*4/t.energy*100};}
  return t;
}
function entryMacroText(e){
  const has=['protein','fat','carbs'].some(k=>e[k]!==null&&e[k]!==undefined&&Number.isFinite(Number(e[k])));
  if(!has)return 'brak danych o makroskładnikach';
  return `B ${fmt(e.protein,1)} g · T ${fmt(e.fat,1)} g · W ${fmt(e.carbs,1)} g`;
}
function groupMacroText(entries){
  const t=macroTotals(entries);
  if(!t.energy)return 'brak makroskładników';
  return `B ${fmt(t.p,0)} · T ${fmt(t.f,0)} · W ${fmt(t.c,0)} g`;
}
function renderHydration(day){$('waterValue').textContent=fmt(day.water||0);$('waterBar').style.width=`${Math.min(100,(day.water||0)/2000*100)}%`;}
function renderWeekStats(){const date=$('entryDate').value||today();let vals=[];for(let i=6;i>=0;i--){const d=dayShift(date,-i);const entries=state.logs[activeProfile()][d]?.entries||[];vals.push({d,kcal:entries.reduce((s,e)=>s+(e.kcal||0),0)});}
  const max=Math.max(2000,...vals.map(x=>x.kcal));$('weekBars').innerHTML=vals.map(v=>`<div class="bar-day"><div class="bar-track"><span style="height:${v.kcal?Math.max(4,v.kcal/max*100):0}%"></span></div><small>${new Intl.DateTimeFormat('pl-PL',{weekday:'short'}).format(new Date(`${v.d}T12:00:00`)).replace('.','')}</small></div>`).join('');const withEntries=vals.filter(v=>v.kcal>0);$('weekAverage').textContent=withEntries.length?`${fmt(withEntries.reduce((s,v)=>s+v.kcal,0)/withEntries.length)} kcal`:'— kcal';}
function renderWeights(){const items=state.weights[activeProfile()]||[];$('weightHistory').innerHTML=items.length?items.slice(-4).reverse().map(x=>`<div><span>${escapeHTML(x.date)}</span><b>${fmt(x.weight,1)} kg</b></div>`).join(''):'Brak zapisanych pomiarów.';}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function openProfileDialog(){const form=$('profileForm');form.reset();const p=profile();if(p){for(const k of ['age','height','weight','pal','goal'])form.elements[k].value=p[k];}else{form.elements.pal.value='1.6';form.elements.goal.value='10';} $('profileError').textContent='';$('profileDialog').showModal();}
function openBothProfilesDialog(){
  const form=$('setupBothForm');form.reset();
  for(const sex of ['female','male']){
    const p=state.profiles[sex];
    for(const key of ['age','height','weight','pal','goal']){
      const field=form.elements[`${sex}${key[0].toUpperCase()}${key.slice(1)}`];
      if(p&&p[key]!==undefined)field.value=p[key];
      else if(key==='pal')field.value='1.6';
      else if(key==='goal')field.value='10';
    }
    $(`${sex}SetupError`).textContent='';
  }
  $('setupBothDialog').showModal();
}

function setProfile(id){state.activeProfile=id;document.body.dataset.profile=id;document.querySelectorAll('.profile-tab').forEach(b=>b.classList.toggle('active',b.dataset.profile===id));render();closePortal();save();}
function allKnownProducts(){return [...seedProducts,...state.customProducts];}
function getProductById(id){return allKnownProducts().find(p=>p.id===id)||null;}
function safeImage(url){try{const u=new URL(url);return u.protocol==='https:'?u.href:'';}catch{return '';}}
function categoryIcon(p){const c=String(p.category||'').toLowerCase(),n=String(p.name||'').toLowerCase(),v=c+' '+n;
  if(/ryb|łosoś|tunczyk|śledź|dorsz|mintaj|pstrąg|krewetk|owoc morza/.test(v))return ico('fish');
  if(/mięso|kurcz|indyk|wołow|wieprz|kaczka|drób|wędlin|kiełbas|szynk|boczek|salami/.test(v))return ico('drumstick');
  if(/nabiał|jaja|skyr|jogurt|ser|mleko|kefir|twaróg|śmietan|masło/.test(v))return ico('milk');
  if(/strącz|soczew|fasol|ciecierzyc|groch|tofu|tempeh|seitan/.test(v))return ico('bean');
  if(/owoc|banan|jabł|jabl|grusz|mango|ananas|melon/.test(v))return ico('apple');
  if(/warzyw|pomidor|ogórek|brokuł|kapusta|papryk|grzyb/.test(v))return ico('leaf');
  if(/pieczyw|buł|chleb|tortilla|bagiet|bajgiel|ciabatta/.test(v))return ico('wheat');
  if(/zboż|ryż|makaron|płatk|kasz|mąka|owsian|kuskus/.test(v))return ico('wheat');
  if(/konserw|puszk|passata|kapary|marynow/.test(v))return ico('products');
  if(/orzech|przekąsk|nasion|pestk|migdał|sezam/.test(v))return ico('nut');
  if(/tłuszcz|oliwa|olej|sos|majonez|pesto/.test(v))return ico('droplet');
  if(/słodycz|czekolad|deser|ciasto|pącz|drożdż/.test(v))return ico('cookie');
  if(/dania gotowe|zupa|pierogi|pizza|gulasz|leczo|bigos|curry|sałatka/.test(v))return ico('utensils');
  if(/napoj|woda|sok|kawa|herbata|cola|lemoniada/.test(v))return ico('cup');
  return ico('utensils');}
function scoreMatch(p,q){const h=normalizeText([p.name,p.brand,p.store,p.stores,(p.aliases||[]).join(' ')].join(' '));const terms=normalizeText(q).split(/\s+/).filter(Boolean);if(!terms.every(t=>h.includes(t)))return -1;let s=0;const name=normalizeText(p.name);if(name.startsWith(normalizeText(q)))s+=10;if(name===normalizeText(q))s+=20;if(name.includes(normalizeText(q)))s+=5;return s;}
async function savedSearch(q){const local=allKnownProducts().map(p=>({...p,searchScore:scoreMatch(p,q)})).filter(p=>p.searchScore>=0);let imported=[];try{imported=await searchImportedCatalog(q,30);}catch{}
  const map=new Map();for(const p of [...local,...imported.map(x=>({...x,category:x.category||'Produkty spożywcze',store:x.stores||x.store||'Open Food Facts',source:'Open Food Facts'}))]){if(!map.has(p.id))map.set(p.id,p);}return [...map.values()].sort((a,b)=>(scoreMatch(b,q))-(scoreMatch(a,q))).slice(0,40);
}
function positionPortal(){if(!portalInput||$('resultsPortal').classList.contains('hidden'))return;const rect=portalInput.getBoundingClientRect();const el=$('resultsPortal');const margin=10;const maxH=Math.min(420,window.innerHeight-margin*2);const below=window.innerHeight-rect.bottom-margin;const above=rect.top-margin;const placeAbove=below<Math.min(180,maxH)&&above>below;const h=Math.max(90,Math.min(maxH,placeAbove?above:below));el.style.left=`${Math.max(margin,Math.min(rect.left,window.innerWidth-rect.width-margin))}px`;el.style.width=`${Math.min(rect.width,window.innerWidth-margin*2)}px`;el.style.maxHeight=`${h}px`;el.style.top=placeAbove?`${Math.max(margin,rect.top-h-6)}px`:`${Math.min(rect.bottom+6,window.innerHeight-h-margin)}px`;}
function openPortal(input,items,message=''){portalInput=input;const el=$('resultsPortal');el.innerHTML=message?`<div class="portal-message">${escapeHTML(message)}</div>`:items.length?items.map((p,i)=>`<button class="result-item" type="button" role="option" data-result="${i}">${safeImage(p.image)?`<img src="${escapeHTML(safeImage(p.image))}" alt="" loading="lazy" referrerpolicy="no-referrer">`:`<span class="result-placeholder">${categoryIcon(p)}</span>`}<span class="result-copy"><b>${escapeHTML(p.name)}</b><small>${escapeHTML([p.brand,p.store||p.source,p.source].filter(Boolean).join(' · '))}</small></span><span class="result-kcal">${fmt(p.kcal100)} kcal</span></button>`).join(''):'<div class="portal-message">Brak wyników. Spróbuj innej nazwy albo zmień źródło.</div>';
  portalResults=items;el.classList.remove('hidden');positionPortal();}
function closePortal(){const el=$('resultsPortal');el.classList.add('hidden');el.innerHTML='';portalInput=null;portalResults=[];}
function chooseProduct(p){selectedProduct=p;$('selectedName').textContent=p.name;$('selectedMeta').textContent=`${fmt(p.kcal100)} kcal / 100 g${p.source?` · ${p.source}`:''}`;const storageNote=$('productStorageNote');if(p.source==='FatSecret'&&p.storageAllowed!==true){storageNote.textContent='Podgląd z FatSecret. Zapis do dziennika jest zablokowany, ponieważ standardowe uprawnienia API nie pozwalają na trwałe przechowywanie wartości odżywczych. Użyj zapisanej bazy / Open Food Facts albo uzyskaj od FatSecret dodatkowe prawa do przechowywania danych.';storageNote.classList.remove('hidden');}else if(p.source==='FatSecret'){storageNote.textContent='FatSecret storage permission: potwierdzone w konfiguracji Worker. Dane zostaną zapisane zgodnie z zakresem Twojej umowy.';storageNote.classList.remove('hidden');}else if(p.sourceKind==='generic-reference'||p.sourceKind==='published-reference'){storageNote.textContent=p.dataNote||'Wartość referencyjna dla produktu ogólnego — zweryfikuj etykietę konkretnego opakowania.';storageNote.classList.remove('hidden');}else{storageNote.textContent='';storageNote.classList.add('hidden');}$('addToDiary').disabled=p.source==='FatSecret'&&p.storageAllowed!==true;$('addToDiary').innerHTML=$('addToDiary').disabled?`${ico('x')} Zapis wymaga zgody FatSecret`:`${ico('plus')} Dodaj do dziennika`;$('selectedPanel').classList.remove('hidden');$('grams').value='100';renderPortion();const shortcuts=[];if(p.unitWeight){shortcuts.push({label:`1 szt. ≈ ${fmt(p.unitWeight,0)} g`,g:p.unitWeight},{label:`½ szt. ≈ ${fmt(p.unitWeight/2,0)} g`,g:p.unitWeight/2});}if(p.id==='banana'||normalizeText(p.name).includes('banan'))shortcuts.unshift({label:'1 banan ≈ 120 g',g:120});$('unitShortcuts').innerHTML=shortcuts.map(x=>`<button type="button" data-grams="${x.g}">${x.label}</button>`).join('');closePortal();$('grams').focus();}
function renderPortion(){if(!selectedProduct)return;const grams=Math.max(0,Number($('grams').value)||0);$('portionKcal').textContent=`${fmt(selectedProduct.kcal100*grams/100)} kcal`;}
async function performSearch(forceOnline=true){const q=$('productSearch').value.trim();if(q.length<2){$('searchStatus').textContent='Wpisz co najmniej 2 znaki.';closePortal();return;}const mode=$('catalogMode').value;const generation=++searchGeneration;
  if(mode==='saved'){
    $('searchStatus').textContent='Przeszukuję zapisaną bazę na tym urządzeniu…';openPortal($('productSearch'),[],'Przeszukuję zapisaną bazę…');
    try{const items=await savedSearch(q);if(generation!==searchGeneration)return;openPortal($('productSearch'),items);$('searchStatus').textContent=`Zapisana baza: ${items.length} wyników. Katalog startowy: ${seedProducts.length} produktów ogólnych + opcjonalny import OFF w IndexedDB.`;}catch(error){openPortal($('productSearch'),[],error.message);$('searchStatus').textContent=error.message;}return;
  }
  const source=$('onlineSource').value;const sourceName=source==='fatsecret'?'FatSecret':source==='off'?'Open Food Facts':'FatSecret + Open Food Facts';
  $('searchStatus').textContent=`Wysyłam zapytanie wyłącznie do: ${sourceName}…`;openPortal($('productSearch'),[],`Łączenie z ${sourceName}…`);
  try{const result=await searchOnline({query:q,source,workerUrl:state.workerUrl});if(generation!==searchGeneration)return;openPortal($('productSearch'),result.products);const statuses=Object.entries(result.sourceStatus||{}).map(([k,v])=>`${k==='fatsecret'?'FatSecret':'OFF'}: ${v.status==='ok'?`${(v.products||[]).length} wyników`:v.error}`).join(' · ');$('searchStatus').textContent=`Odpowiedź: ${sourceName}. ${result.cached?'(cache przeglądarki) ':''}${statuses}`;}
  catch(error){if(generation!==searchGeneration)return;openPortal($('productSearch'),[],error.message);$('searchStatus').textContent=`${sourceName}: ${error.message}`;}
}
function addEntry(product,grams,meal,date,{silent=false}={}){const g=Number(grams);if(!Number.isFinite(g)||g<=0||g>10000){if(!silent)toast('Podaj prawidłową gramaturę od 0,1 do 10 000 g.');return false;}const day=ensureDay(date);const factor=g/100;day.entries.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,name:product.name,brand:product.brand||'',store:product.store||product.source||'',source:product.source||'Lokalna baza',sourceKind:product.sourceKind||'',sourceId:product.sourceId||'',grams:g,kcal100:Number(product.kcal100),kcal:round1(product.kcal100*factor),protein:product.protein100!==null&&product.protein100!==undefined&&Number.isFinite(Number(product.protein100))?round1(product.protein100*factor):null,fat:product.fat100!==null&&product.fat100!==undefined&&Number.isFinite(Number(product.fat100))?round1(product.fat100*factor):null,carbs:product.carbs100!==null&&product.carbs100!==undefined&&Number.isFinite(Number(product.carbs100))?round1(product.carbs100*factor):null,meal,createdAt:new Date().toISOString()});if(!silent){save();render();toast(`Dodano: ${product.name} · ${fmt(product.kcal100*factor)} kcal`);}return true;}
function openProductDialog(product=null){
  editingProductId=product?.id||null;
  const form=$('productForm');form.reset();$('productError').textContent='';
  $('productDialogTitle').textContent=product?'Edytuj własny produkt':'Własny produkt';
  $('productSubmit').innerHTML=product?`${ico('check')} Zapisz zmiany`:`${ico('check')} Zapisz produkt`;
  if(product){
    form.elements.name.value=product.name||'';
    form.elements.brand.value=product.brand||'';
    form.elements.store.value=product.store||'Ogólne';
    form.elements.kcal.value=product.kcal100??'';
    form.elements.protein.value=product.protein100??'';
    form.elements.fat.value=product.fat100??'';
    form.elements.carbs.value=product.carbs100??'';
    form.elements.unitWeight.value=product.unitWeight??'';
  }
  $('productDialog').showModal();
}
function currentPlanData(){
  return [
    [['Owsianka z bananem',[['Płatki owsiane',60,366],['Mleko 2%',200,50],['Banan',100,89]]],['Jogurt ze skyrem',[['Skyr naturalny',150,63],['Jabłko',120,52]]],['Kurczak z ryżem',[['Pierś z kurczaka, gotowana',150,165],['Ryż biały, gotowany',180,130],['Brokuł, gotowany',120,35],['Oliwa z oliwek',5,884]]],['Kanapki z twarogiem',[['Chleb żytni',70,259],['Twaróg półtłusty',80,133],['Pomidor',80,18]]]],
    [['Jajecznica z pieczywem',[['Jajo kurze, całe',110,143],['Chleb żytni',60,259],['Pomidor',100,18]]],['Banan i skyr',[['Banan',120,89],['Skyr naturalny',150,63]]],['Łosoś z ziemniakami',[['Łosoś, surowy',140,208],['Ziemniaki, gotowane',200,87],['Ogórek',100,15]]],['Jogurt z płatkami',[['Jogurt naturalny 2%',150,60],['Płatki owsiane',25,366]]]],
    [['Owsianka jabłkowa',[['Płatki owsiane',55,366],['Mleko 2%',180,50],['Jabłko',100,52]]],['Twaróg z owocem',[['Twaróg półtłusty',100,133],['Gruszka',120,57]]],['Makaron z tuńczykiem',[['Makaron pszenny, gotowany',180,158],['Tuńczyk odsączony',100,116],['Pomidor',120,18],['Oliwa z oliwek',5,884]]],['Skyr',[['Skyr naturalny',150,63]]]],
    [['Kanapki z jajkiem',[['Chleb żytni',80,259],['Jajo kurze, całe',55,143],['Ogórek',60,15]]],['Jabłko i masło orzechowe',[['Jabłko',150,52],['Masło orzechowe',15,588]]],['Kurczak z warzywami',[['Pierś z kurczaka, gotowana',160,165],['Ryż biały, gotowany',150,130],['Brokuł, gotowany',150,35]]],['Jogurt naturalny',[['Jogurt naturalny 2%',180,60]]]],
    [['Skyr z płatkami',[['Skyr naturalny',170,63],['Płatki owsiane',40,366],['Banan',70,89]]],['Pomarańcza i twaróg',[['Pomarańcza',150,47],['Twaróg półtłusty',80,133]]],['Soczewica z ryżem',[['Soczewica, gotowana',180,116],['Ryż biały, gotowany',130,130],['Pomidor',100,18],['Oliwa z oliwek',5,884]]],['Czekolada gorzka',[['Czekolada gorzka 70%',15,598]]]],
    [['Omlet z pomidorem',[['Jajo kurze, całe',110,143],['Pomidor',100,18],['Ser gouda',20,356]]],['Banan',[['Banan',120,89]]],['Łosoś i ziemniaki',[['Łosoś, surowy',130,208],['Ziemniaki, gotowane',220,87],['Ogórek',100,15]]],['Skyr z owocem',[['Skyr naturalny',150,63],['Gruszka',100,57]]]],
    [['Owsianka z gruszką',[['Płatki owsiane',60,366],['Mleko 2%',200,50],['Gruszka',100,57]]],['Jajko i warzywa',[['Jajo kurze, całe',55,143],['Pomidor',100,18]]],['Makaron z kurczakiem',[['Makaron pszenny, gotowany',180,158],['Pierś z kurczaka, gotowana',130,165],['Brokuł, gotowany',100,35],['Oliwa z oliwek',5,884]]],['Jogurt naturalny',[['Jogurt naturalny 2%',150,60]]]]
  ];
}
const WEEKDAY_NAMES=['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
function weekdayName(date){return WEEKDAY_NAMES[new Date(`${date}T12:00:00`).getDay()];}
function planRecipeById(id){return (state.recipes||[]).find(r=>r.id===id)||null;}
function renderWeekly(){
  const start=$('weekStart').value||today();
  const sample=currentPlanData();
  $('weeklyPlan').innerHTML=sample.map((meals,i)=>{
    let dayTotal=0;
    const mealHtml=meals.map(([name,ingredients])=>{
      const total=ingredients.reduce((sum,x)=>sum+x[1]*x[2]/100,0);dayTotal+=total;
      return `<div class="plan-meal"><h4>${escapeHTML(name)} <span>· ${fmt(total)} kcal</span></h4><ul>${ingredients.map(x=>`<li>${escapeHTML(x[0])} — ${fmt(x[1])} g · ${fmt(x[1]*x[2]/100)} kcal</li>`).join('')}</ul></div>`;
    }).join('');
    const date=dayShift(start,i);
    return `<article class="day-plan sample-day"><div class="plan-day-top"><div><span class="sample-tag">PRZYKŁAD</span><h3>${weekdayName(date)}</h3><p>${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'long'}).format(new Date(`${date}T12:00:00`))}</p></div><span class="plan-day-kcal">${fmt(dayTotal)} <small>kcal</small></span></div>${mealHtml}<div class="day-total"><span>Suma przykładowych posiłków</span><strong>${fmt(dayTotal)} kcal</strong></div><p class="sample-note">Podgląd przykładowego dnia. Posiłki dodajesz w zakładce „Dziennik”.</p></article>`;
  }).join('');
  renderCustomPlans();
}
function renderCustomPlans(){
  const plans=Array.isArray(state.plans)?state.plans:[];
  $('ownPlanCount').textContent=`${plans.length} ${plans.length===1?'plan':plans.length>1&&plans.length<5?'plany':'planów'}`;
  if(!plans.length){$('customPlansList').innerHTML=`<div class="custom-plan-empty"><div class="empty-symbol">${ico('week')}</div><b>Jeszcze nie masz własnego planu</b><p>Utwórz tygodniowy jadłospis z przepisów zapisanych w „Moich przepisach”.</p><button class="primary" type="button" data-empty-create-plan>${ico('plus')} Stwórz pierwszy plan</button></div>`;return;}
  $('customPlansList').innerHTML=[...plans].sort((a,b)=>String(b.updatedAt||b.startDate).localeCompare(String(a.updatedAt||a.startDate))).map(plan=>{
    const end=dayShift(plan.startDate,6);
    const days=Array.from({length:7},(_,dayIndex)=>{
      const date=dayShift(plan.startDate,dayIndex);
      const assignments=(plan.assignments||[]).filter(a=>Number(a.dayIndex)===dayIndex);
      if(!assignments.length)return '';
      let total=0;
      const entries=assignments.map(a=>{
        const r=planRecipeById(a.recipeId);if(!r)return '';
        const servings=Math.max(.25,Number(a.servings)||1);
        const kcal=(Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1)*servings;total+=kcal;
        return `<div class="custom-plan-meal"><span class="meal-type-pill">${escapeHTML(a.meal||r.meal||'Posiłek')}</span><div><b>${escapeHTML(r.name)}</b><small>${fmt(servings,1)} porcji · ${fmt(kcal)} kcal</small></div></div>`;
      }).join('');
      return entries?`<div class="custom-plan-day"><div class="custom-day-date"><b>${weekdayName(date)}</b><small>${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(new Date(`${date}T12:00:00`))}</small></div><div class="custom-day-meals">${entries}</div><strong class="custom-day-total">${fmt(total)} kcal</strong></div>`:'';
    }).filter(Boolean).join('');
    const kcal=(plan.assignments||[]).reduce((sum,a)=>{const r=planRecipeById(a.recipeId);return sum+(r?(Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1)*(Number(a.servings)||1):0);},0);
    const recipeCount=(plan.assignments||[]).length;
    return `<article class="custom-plan-card"><div class="custom-plan-header"><div><div class="custom-plan-tags"><span class="own-plan-tag">WŁASNY PLAN</span><span class="plan-date-range">${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${plan.startDate}T12:00:00`))} — ${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${end}T12:00:00`))}</span></div><h3>${escapeHTML(plan.title)}</h3><p>${recipeCount} zaplanowanych pozycji · ${fmt(kcal)} kcal łącznie w tygodniu</p></div><div class="custom-plan-actions"><button type="button" class="icon-button subtle-icon" data-edit-plan="${escapeHTML(plan.id)}" aria-label="Edytuj plan" title="Edytuj plan">${ico('pencil')}</button><button type="button" class="icon-delete" data-delete-plan="${escapeHTML(plan.id)}" aria-label="Usuń plan" title="Usuń plan">${ico('x')}</button></div></div><div class="custom-plan-days">${days||'<p class="muted">Ten plan nie ma jeszcze przypisanych przepisów.</p>'}</div><div class="custom-plan-footer"><span><b>${recipeCount}</b> posiłków · <b>${fmt(kcal)}</b> kcal / tydzień</span><span class="footer-hint">Dzień z tego planu dodasz w zakładce „Dziennik”.</span></div></article>`;
  }).join('');
}
function recipeOptions(selected=''){
  const recipes=state.recipes||[];
  return `<option value="">${recipes.length?'Wybierz zapisany przepis':'Najpierw utwórz przepis'}</option>`+recipes.map(r=>`<option value="${escapeHTML(r.id)}" ${r.id===selected?'selected':''}>${escapeHTML(r.name)} · ${fmt((Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1))} kcal / porcję</option>`).join('');
}
function createPlanAssignmentRow(value={}){
  const row=document.createElement('div');row.className='plan-assignment-row';
  const start=$('planForm').elements.startDate.value||$('weekStart').value||today();
  const days=Array.from({length:7},(_,i)=>`<option value="${i}" ${Number(value.dayIndex||0)===i?'selected':''}>${weekdayName(dayShift(start,i))}</option>`).join('');
  row.innerHTML=`<label>Dzień<select class="assignment-day">${days}</select></label><label>Posiłek<select class="assignment-meal">${mealNames.slice(0,5).map(x=>`<option ${x===(value.meal||'Obiad')?'selected':''}>${x}</option>`).join('')}</select></label><label class="assignment-recipe">Przepis<select class="assignment-recipe-select">${recipeOptions(value.recipeId||'')}</select></label><label class="assignment-servings">Porcje<input class="assignment-portions" type="number" min="0.25" max="20" step="0.25" value="${Number(value.servings)||1}"></label><button type="button" class="icon-delete remove-assignment" aria-label="Usuń pozycję">${ico('x')}</button>`;
  row.querySelector('.remove-assignment').addEventListener('click',()=>row.remove());
  $('planAssignments').append(row);
}
function updatePlanAssignmentDayLabels(){document.querySelectorAll('.assignment-day').forEach(select=>{const current=select.value;const start=$('planForm').elements.startDate.value||today();select.innerHTML=Array.from({length:7},(_,i)=>`<option value="${i}" ${String(i)===current?'selected':''}>${weekdayName(dayShift(start,i))}</option>`).join('');});}
function openPlanDialog(plan=null){
  editingPlanId=plan?.id||null;const form=$('planForm');form.reset();$('planAssignments').innerHTML='';$('planError').textContent='';
  $('planDialogTitle').textContent=plan?'Edytuj plan tygodniowy':'Nowy plan tygodniowy';$('planSubmit').innerHTML=plan?`${ico('check')} Zapisz zmiany`:`${ico('check')} Zapisz plan`;
  form.elements.title.value=plan?.title||'';form.elements.startDate.value=plan?.startDate||$('weekStart').value||today();
  if(plan?.assignments?.length)plan.assignments.forEach(a=>createPlanAssignmentRow(a));else createPlanAssignmentRow();
  if(!state.recipes.length){$('planError').textContent='Najpierw dodaj co najmniej jeden przepis w zakładce „Moje przepisy”.';}
  openDialog('planDialog');
}
function addRecipeToDiary(recipe,servings,date,meal,{silent=false}={}){
  if(!recipe)return false;
  const factor=Number(servings)/Math.max(1,Number(recipe.portions)||1);
  let added=false;
  for(const item of recipe.ingredients||[]){
    const kcal100=Number(item.kcal100??(Number(item.kcal||0)*100/Math.max(.1,Number(item.grams)||0)));
    const grams=Number(item.grams)*factor;
    if(Number.isFinite(kcal100)&&Number.isFinite(grams)&&grams>0){
      added=addEntry({name:item.name,kcal100,protein100:item.protein100,fat100:item.fat100,carbs100:item.carbs100,source:'Własny przepis'},grams,meal||recipe.meal,date,{silent:true})||added;
    }
  }
  if(added&&!silent){save();render();toast(`Dodano przepis „${recipe.name}” do dziennika.`);}
  return added;
}
function addPlanDayToDiary(planId,dayIndex){
  const plan=(state.plans||[]).find(p=>p.id===planId);
  if(!plan)return false;
  const date=$('entryDate').value||today();
  const assignments=(plan.assignments||[]).filter(a=>Number(a.dayIndex)===Number(dayIndex));
  let added=0;
  for(const a of assignments){
    const recipe=planRecipeById(a.recipeId);if(!recipe)continue;
    // Każde danie wchodzi do dziennika jako jego składniki — dokładnie tak samo,
    // jak przy dodawaniu pojedynczego dania, więc wartości są identyczne.
    if(addRecipeToDiary(recipe,Number(a.servings)||1,date,a.meal,{silent:true}))added++;
  }
  if(added){save();render();toast(`Dodano ${added} posiłków z planu „${plan.title}”.`);}
  else toast('Ten dzień planu nie zawiera dostępnych dań.');
  return added>0;
}
function createIngredientRow(initial={}){
  const wrap=document.createElement('div');wrap.className='ingredient-row';
  const products=allKnownProducts();
  const match=products.find(p=>p.name===initial.name&&Math.abs(Number(p.kcal100)-Number(initial.kcal100))<.05);
  wrap.innerHTML=`<label class="ingredient-product-label"><span>Produkt z bazy · wyszukaj</span><div class="ingredient-product-picker"><input class="ingredient-product-search" type="search" placeholder="Szukaj produktu…" autocomplete="off" aria-label="Wyszukaj produkt z bazy"><div class="ingredient-product-results hidden" role="listbox"></div></div></label><label><span>Nazwa składnika</span><input class="ingredient-name" placeholder="np. pierś z kurczaka" aria-label="Nazwa składnika"></label><label><span>Gramy</span><input class="ingredient-grams" type="number" min="0.1" max="10000" step="0.1" placeholder="g" inputmode="decimal"></label><label><span>Kcal / 100 g</span><input class="ingredient-kcal" type="number" min="0" max="950" step="0.1" placeholder="kcal" inputmode="decimal"></label><button type="button" class="icon-delete remove-ingredient" aria-label="Usuń składnik" title="Usuń składnik">${ico('x')}</button>`;
  const search=wrap.querySelector('.ingredient-product-search'),results=wrap.querySelector('.ingredient-product-results');let displayedProducts=[];let pickerRequest=0;
  const choose=(product)=>{wrap.querySelector('.ingredient-name').value=product.name;wrap.querySelector('.ingredient-kcal').value=product.kcal100;search.value=product.name;results.classList.add('hidden');updateRecipeTotal();};
  const drawResults=async()=>{const request=++pickerRequest;const q=normalizeText(search.value);let found=q.length<1?products.slice(0,10):products.map(p=>({...p,_score:scoreMatch(p,q)})).filter(p=>p._score>=0).sort((a,b)=>b._score-a._score).slice(0,12);if(q.length>=2){try{const imported=await searchImportedCatalog(q,12);const ids=new Set(found.map(p=>String(p.id)));for(const item of imported){if(!ids.has(String(item.id))){found.push(item);ids.add(String(item.id));}}}catch{}}if(request!==pickerRequest)return;displayedProducts=found.slice(0,16);results.innerHTML=displayedProducts.length?displayedProducts.map((p,i)=>`<button type="button" data-product-index="${i}" role="option">${escapeHTML(p.name)}<small>${fmt(p.kcal100)} kcal / 100 g${p.brand?` · ${escapeHTML(p.brand)}`:''}${p.store?` · ${escapeHTML(p.store)}`:''}</small></button>`).join(''):'<div class="portal-message">Brak wyników. Wpisz składnik ręcznie poniżej.</div>';results.classList.remove('hidden');};
  search.addEventListener('focus',drawResults);search.addEventListener('input',drawResults);
  results.addEventListener('click',e=>{const b=e.target.closest('[data-product-index]');if(!b)return;const product=displayedProducts[Number(b.dataset.productIndex)];if(product)choose(product);});
  search.addEventListener('blur',()=>setTimeout(()=>results.classList.add('hidden'),180));
  if(match)choose(match);else{wrap.querySelector('.ingredient-name').value=initial.name||'';wrap.querySelector('.ingredient-kcal').value=initial.kcal100??'';}
  wrap.querySelector('.ingredient-grams').value=initial.grams??'';
  wrap.querySelectorAll('input').forEach(i=>i.addEventListener('input',updateRecipeTotal));wrap.querySelector('.remove-ingredient').addEventListener('click',()=>{wrap.remove();updateRecipeTotal();});
  $('ingredientRows').append(wrap);updateRecipeTotal();
}
function recipeTotal(){return [...$('ingredientRows').querySelectorAll('.ingredient-row')].reduce((sum,row)=>sum+(Number(row.querySelector('.ingredient-grams').value)||0)*(Number(row.querySelector('.ingredient-kcal').value)||0)/100,0);}
function updateRecipeTotal(){const total=recipeTotal(),portions=Math.max(1,Number($('recipeForm').elements.portions.value)||1);$('recipeTotal').textContent=`${fmt(total)} kcal`;$('recipePortion').textContent=`${fmt(total/portions)} kcal`;}
function openRecipeDialog(recipe=null){
  editingRecipeId=recipe?.id||null;const form=$('recipeForm');form.reset();$('ingredientRows').innerHTML='';$('recipeError').textContent='';
  $('recipeDialogTitle').textContent=recipe?'Edytuj przepis':'Nowy przepis';$('recipeSubmit').innerHTML=recipe?`${ico('check')} Zapisz zmiany`:`${ico('check')} Zapisz przepis`;
  if(recipe){form.elements.name.value=recipe.name||'';form.elements.portions.value=recipe.portions||1;form.elements.meal.value=recipe.meal||'Obiad';form.elements.description.value=recipe.description||'';form.elements.instructions.value=recipe.instructions||'';(recipe.ingredients||[]).forEach(x=>createIngredientRow(x));}
  else createIngredientRow();
  updateRecipeTotal();openDialog('recipeDialog');
}
function renderRecipes(){
  const all=state.recipes||[];const q=normalizeText($('recipeSearch')?.value||'');const filter=$('recipeMealFilter')?.value||'all';
  const visible=all.filter(r=>(filter==='all'||r.meal===filter)&&(!q||normalizeText([r.name,r.description,r.meal,...(r.ingredients||[]).map(x=>x.name)].join(' ')).includes(q)));
  $('recipeCount').textContent=fmt(all.length);$('recipeIngredientsCount').textContent=fmt(all.reduce((n,r)=>n+(r.ingredients||[]).length,0));
  const avg=all.length?all.reduce((s,r)=>s+(Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1),0)/all.length:null;$('recipeAverage').textContent=avg===null?'—':`${fmt(avg)} kcal`;
  $('recipesList').innerHTML=visible.length?visible.map(r=>`<article class="recipe-card"><div class="recipe-card-top"><span class="recipe-emoji">${r.meal==='Śniadanie'?ico('sun'):r.meal==='Obiad'?ico('utensils'):r.meal==='Kolacja'?ico('moon'):ico('chef')}</span><span class="recipe-meal-label">${escapeHTML(r.meal||'Posiłek')}</span></div><h3>${escapeHTML(r.name)}</h3>${r.description?`<p class="recipe-description">${escapeHTML(r.description)}</p>`:''}<div class="recipe-nutrition"><div><strong>${fmt((Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1))}</strong><small>kcal / porcję</small></div><div><strong>${fmt(r.portions)}</strong><small>porcji z przepisu</small></div><div><strong>${(r.ingredients||[]).length}</strong><small>składników</small></div></div><details class="recipe-details"><summary>Składniki i przygotowanie</summary><ul>${(r.ingredients||[]).map(x=>`<li><span>${escapeHTML(x.name)} · ${fmt(x.grams)} g</span><b>${fmt(x.kcal??Number(x.grams)*Number(x.kcal100)/100)} kcal</b></li>`).join('')}</ul>${r.instructions?`<p>${escapeHTML(r.instructions).replace(/\n/g,'<br>')}</p>`:''}</details><div class="recipe-card-actions"><button type="button" class="icon-button subtle-icon" data-edit-recipe="${escapeHTML(r.id)}" aria-label="Edytuj przepis" title="Edytuj przepis">${ico('pencil')}</button><button type="button" class="icon-delete" data-delete-recipe="${escapeHTML(r.id)}" aria-label="Usuń przepis" title="Usuń przepis">${ico('x')}</button></div></article>`).join(''):`<div class="recipe-empty"><div class="empty-symbol">${ico('chef')}</div><b>${all.length?'Nie znaleziono przepisów':'Twoja kolekcja dopiero się zaczyna'}</b><p>${all.length?'Zmień frazę lub filtr posiłku.':'Zapisz swoje pierwsze danie. Później dodasz je do dowolnego planu tygodniowego.'}</p>${all.length?'':`<button type="button" class="primary" data-empty-create-recipe>${ico('plus')} Dodaj pierwszy przepis</button>`}</div>`;
}

// ---------------------------------------------------------------------------
// Produkty: katalog startowy (tylko odczyt) i własne produkty (CRUD).
// Dodawanie do dnia pozostaje wyłącznie w zakładce „Dziennik”.
// ---------------------------------------------------------------------------
const SUGGESTED_PRODUCT_IDS=[
  'banana','apple','pear','mandarin','orange',
  'tomato','cucumber','pepper-red','carrot','broccoli',
  'roll','roll-graham','roll-milk','roll-multigrain','roll-butter',
  'skyr','yogurt','cottage','cottage-cheese','milk'
];
function renderQuickPicks(){
  const chips=SUGGESTED_PRODUCT_IDS.map(id=>{
    const p=getProductById(id);
    if(!p)return '';
    return `<button type="button" data-quick="${escapeHTML(p.id)}" title="${fmt(p.kcal100)} kcal / 100 g">${escapeHTML(p.name)}</button>`;
  }).join('');
  const diary=$('quickPicks');
  if(diary)diary.innerHTML=`<span>Szybki wybór</span>${chips}`;
  const catalog=$('productsQuickPicks');
  if(catalog)catalog.innerHTML=`<span>Szybki wybór</span>${chips}`;
}
function productCard(product,{custom=false}={}){
  const meta=[product.brand,product.store||'Katalog',custom?'produkt własny':'wartość referencyjna'].filter(Boolean).join(' · ');
  const unit=product.unitWeight?`<span>1 szt. <b>${fmt(product.unitWeight,0)} g</b></span>`:'';
  const buttons=custom
    ? `<button type="button" class="secondary" data-use-product="${escapeHTML(product.id)}">${ico('plus')} Użyj w dzienniku</button><button type="button" class="icon-button subtle-icon" data-edit-product="${escapeHTML(product.id)}" aria-label="Edytuj produkt" title="Edytuj produkt">${ico('pencil')}</button><button type="button" class="icon-delete" data-delete-product="${escapeHTML(product.id)}" aria-label="Usuń produkt" title="Usuń produkt">${ico('x')}</button>`
    : `<button type="button" class="secondary" data-use-product="${escapeHTML(product.id)}">${ico('plus')} Użyj w dzienniku</button>`;
  return `<article class="product-card${custom?' custom-product':''}">
    <div class="product-card-head"><span class="product-emoji" aria-hidden="true">${categoryIcon(product)}</span><div class="product-identity"><b>${escapeHTML(product.name)}</b><small>${escapeHTML(meta)}</small></div><span class="product-kcal">${fmt(product.kcal100)}<small>kcal</small></span></div>
    <div class="product-macros"><span>Białko <b>${fmt(product.protein100,1)} g</b></span><span>Tłuszcz <b>${fmt(product.fat100,1)} g</b></span><span>Węgl. <b>${fmt(product.carbs100,1)} g</b></span>${unit}</div>
    <div class="product-card-actions">${buttons}</div>
  </article>`;
}
function renderProductsView(){
  const list=$('seedProductsList');
  if(!list)return;
  const custom=Array.isArray(state.customProducts)?state.customProducts:[];
  $('customProductCount').textContent=`${custom.length} ${custom.length===1?'produkt':custom.length>1&&custom.length<5?'produkty':'produktów'}`;
  $('customProductsList').innerHTML=custom.length
    ? custom.map(p=>productCard(p,{custom:true})).join('')
    : `<div class="product-empty"><b>Nie masz jeszcze własnych produktów</b><p>Dodaj produkt z etykiety, jeśli nie ma go w katalogu startowym.</p><button type="button" class="primary" data-empty-create-product>${ico('plus')} Dodaj pierwszy produkt</button></div>`;
  const q=normalizeText(productsQuery||'');
  const filtered=seedProducts.filter(p=>!q||normalizeText([p.name,p.brand,p.store,(p.aliases||[]).join(' ')].join(' ')).includes(q));
  const visible=filtered.slice(0,productsLimit);
  $('seedProductCount').textContent=`${fmt(seedProducts.length)} POZYCJI · TYLKO ODCZYT`;
  $('seedProductsList').innerHTML=visible.length
    ? visible.map(p=>productCard(p)).join('')
    : `<div class="product-empty"><b>Brak wyników</b><p>Zmień frazę lub dodaj własny produkt.</p></div>`;
  $('productsStatus').textContent=q
    ? `Znaleziono ${fmt(filtered.length)} z ${fmt(seedProducts.length)} pozycji katalogu dla „${(productsQuery||'').trim()}”.`
    : `Pokazano ${fmt(visible.length)} z ${fmt(seedProducts.length)} pozycji katalogu. Skorzystaj z wyszukiwania lub „Szybkiego wyboru”.`;
  $('loadMoreProducts').hidden=filtered.length<=productsLimit;
  renderQuickPicks();
}
function useProductInDiary(id){
  const product=getProductById(id);
  if(!product)return;
  showView('diary');
  setAddMode('product');
  $('productSearch').value=product.name;
  $('clearSearch').classList.remove('hidden');
  chooseProduct(product);
  $('addFoodCard').scrollIntoView({behavior:'smooth',block:'center'});
}

// Tryby w karcie „Dodaj produkt/danie/dzień”.
function setAddMode(mode){
  document.querySelectorAll('[data-add-mode]').forEach(button=>{
    const active=button.dataset.addMode===mode;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
  });
  document.querySelectorAll('[data-add-panel]').forEach(panel=>{
    panel.classList.toggle('hidden',panel.dataset.addPanel!==mode);
  });
  if(mode==='recipe')fillDiaryRecipeOptions();
  if(mode==='plan-day')fillDiaryPlanOptions();
}
function fillDiaryRecipeOptions(){
  const recipes=state.recipes||[];
  $('diaryRecipe').innerHTML=recipes.length
    ? recipes.map(r=>`<option value="${escapeHTML(r.id)}">${escapeHTML(r.name)} · ${fmt((Number(r.totalKcal)||0)/Math.max(1,Number(r.portions)||1))} kcal / porcję</option>`).join('')
    : '<option value="">Najpierw utwórz danie w „Moich przepisach”</option>';
  $('addRecipeToDiary').disabled=!recipes.length;
}
function fillDiaryPlanOptions(){
  const plans=Array.isArray(state.plans)?state.plans:[];
  $('diaryPlan').innerHTML=plans.length
    ? plans.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.title)}</option>`).join('')
    : '<option value="">Najpierw utwórz plan w „Planie tygodnia”</option>';
  $('addPlanDayToDiary').disabled=!plans.length;
  fillDiaryPlanDays();
}
function fillDiaryPlanDays(){
  const plan=(state.plans||[]).find(p=>p.id===$('diaryPlan').value);
  const select=$('diaryPlanDay');
  if(!plan){
    select.innerHTML='<option value="">Brak dni</option>';
    select.disabled=true;
    $('addPlanDayToDiary').disabled=true;
    $('diaryPlanSummary').textContent='';
    return;
  }
  const options=[];
  for(let index=0;index<7;index++){
    const assignments=(plan.assignments||[]).filter(a=>Number(a.dayIndex)===index);
    if(!assignments.length)continue;
    const date=dayShift(plan.startDate,index);
    const label=new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'long'}).format(new Date(`${date}T12:00:00`));
    options.push(`<option value="${index}">${weekdayName(date)} · ${label} (${assignments.length} posiłków)</option>`);
  }
  select.innerHTML=options.length?options.join(''):'<option value="">Plan nie ma przypisanych dań</option>';
  select.disabled=!options.length;
  $('addPlanDayToDiary').disabled=!options.length;
  renderPlanDaySummary();
}
function renderPlanDaySummary(){
  const plan=(state.plans||[]).find(p=>p.id===$('diaryPlan')?.value);
  const dayIndex=Number($('diaryPlanDay')?.value);
  if(!plan||!Number.isFinite(dayIndex)){$('diaryPlanSummary').textContent='';return;}
  const assignments=(plan.assignments||[]).filter(a=>Number(a.dayIndex)===dayIndex);
  const kcal=assignments.reduce((sum,a)=>{
    const recipe=planRecipeById(a.recipeId);
    return sum+(recipe?(Number(recipe.totalKcal)||0)/Math.max(1,Number(recipe.portions)||1)*(Number(a.servings)||1):0);
  },0);
  $('diaryPlanSummary').textContent=`Wybrany dzień: ${assignments.length} posiłków · ${fmt(kcal)} kcal. Zostaną dodane do dnia ${$('entryDate').value}.`;
}

function showView(view){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v.id!==`${view}View`));if(view==='week')renderWeekly();if(view==='recipes')renderRecipes();if(view==='products')renderProductsView();}
function downloadFile(name,content,type){const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function backupData(){downloadFile(`dziennik-zywieniowy-${today()}.json`,JSON.stringify(state,null,2),'application/json');}
function openDialog(id){$(id).showModal();}
function closeDialog(id){$(id).close();}

// Events
$('entryDate').value=today();$('weekStart').value=today();
document.querySelectorAll('.profile-tab').forEach(b=>b.addEventListener('click',()=>setProfile(b.dataset.profile)));
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('entryDate').addEventListener('change',()=>{render();closePortal();});$('weekStart').addEventListener('change',renderWeekly);
$('editProfile').addEventListener('click',openProfileDialog);$('setupProfile').addEventListener('click',openProfileDialog);
$('profileForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const data={age:Number(f.elements.age.value),height:Number(f.elements.height.value),weight:Number(f.elements.weight.value),pal:Number(f.elements.pal.value),goal:Number(f.elements.goal.value)};if(!validateProfileData(data)){$('profileError').textContent='Sprawdź wprowadzone wartości.';return;}state.profiles[activeProfile()]=data;save();closeDialog('profileDialog');render();toast('Zapisano parametry profilu.');});

$('setupBothForm').addEventListener('submit',e=>{
  e.preventDefault();const f=e.currentTarget;const next={};let valid=true;
  for(const sex of ['female','male']){
    const data=readProfileForm(f,sex);
    if(!validateProfileData(data)){$(`${sex}SetupError`).textContent='Sprawdź wiek (19–100), wzrost (120–230 cm), masę (30–350 kg), aktywność i cel.';valid=false;}else{$(`${sex}SetupError`).textContent='';next[sex]=data;}
  }
  if(!valid)return;
  state.profiles={...state.profiles,...next};save();closeDialog('setupBothDialog');
  document.body.dataset.profile=state.activeProfile;document.querySelectorAll('.profile-tab').forEach(b=>b.classList.toggle('active',b.dataset.profile===state.activeProfile));
  render();renderWeekly();renderRecipes();toast('Oba profile są skonfigurowane.');
});
$('setupBothDialog').addEventListener('cancel',e=>{e.preventDefault();toast('Uzupełnij oba profile, aby rozpocząć korzystanie z dziennika.');});

$('catalogMode').addEventListener('change',()=>{state.catalogMode=$('catalogMode').value;save();$('sourceControl').classList.toggle('hidden',state.catalogMode!=='online');closePortal();$('searchStatus').textContent=state.catalogMode==='saved'?'Wyszukiwanie w zapisanej bazie na tym urządzeniu.':'Wybierz dostawcę online i naciśnij Szukaj.';});
$('onlineSource').addEventListener('change',()=>{state.onlineSource=$('onlineSource').value;save();$('searchStatus').textContent=`Źródło online: ${$('onlineSource').selectedOptions[0].textContent}.`;closePortal();});
$('searchButton').addEventListener('click',()=>performSearch());$('productSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();performSearch();}if(e.key==='Escape')closePortal();});
let searchDebounce; $('productSearch').addEventListener('input',()=>{searchGeneration++;closePortal();$('clearSearch').classList.toggle('hidden',!$('productSearch').value);if($('catalogMode').value==='saved'){clearTimeout(searchDebounce);searchDebounce=setTimeout(()=>performSearch(false),220);}});
$('clearSearch').addEventListener('click',()=>{$('productSearch').value='';$('clearSearch').classList.add('hidden');closePortal();$('searchStatus').textContent='Wpisz minimum 2 znaki.';});
$('resultsPortal').addEventListener('click',e=>{const btn=e.target.closest('[data-result]');if(!btn)return;const p=portalResults[Number(btn.dataset.result)];if(p)chooseProduct(p);});
window.addEventListener('resize',positionPortal);window.addEventListener('scroll',positionPortal,true);document.addEventListener('pointerdown',e=>{if(e.target.closest('#productSearch')||e.target.closest('#resultsPortal')||e.target.closest('#searchButton'))return;closePortal();});
$('grams').addEventListener('input',renderPortion);$('unselect').addEventListener('click',()=>{$('selectedPanel').classList.add('hidden');selectedProduct=null;});$('unitShortcuts').addEventListener('click',e=>{const b=e.target.closest('[data-grams]');if(b){$('grams').value=b.dataset.grams;renderPortion();}});
$('addToDiary').addEventListener('click',()=>{if(!selectedProduct)return;if(selectedProduct.source==='FatSecret'&&selectedProduct.storageAllowed!==true){toast('FatSecret: brak prawa do trwałego zapisu. Wybierz OFF lub Zapisana baza.');return;}addEntry(selectedProduct,$('grams').value,$('mealType').value,$('entryDate').value);$('selectedPanel').classList.add('hidden');selectedProduct=null;$('productSearch').value='';$('clearSearch').classList.add('hidden');});
$('quickPicks').addEventListener('click',e=>{const button=e.target.closest('[data-quick]');if(!button)return;const product=getProductById(button.dataset.quick);if(product)chooseProduct(product);});
$('productsQuickPicks').addEventListener('click',e=>{
  const button=e.target.closest('[data-quick]');if(!button)return;
  const product=getProductById(button.dataset.quick);if(!product)return;
  productsQuery=product.name;productsLimit=48;
  $('productSearchCatalog').value=product.name;
  renderProductsView();
  $('seedProductsList').scrollIntoView({behavior:'smooth',block:'start'});
});
document.querySelectorAll('[data-add-mode]').forEach(button=>button.addEventListener('click',()=>setAddMode(button.dataset.addMode)));
$('diaryPlan').addEventListener('change',fillDiaryPlanDays);
$('diaryPlanDay').addEventListener('change',renderPlanDaySummary);
$('addRecipeToDiary').addEventListener('click',()=>{
  const recipe=state.recipes.find(r=>r.id===$('diaryRecipe').value);
  if(!recipe){toast('Najpierw wybierz danie lub utwórz je w „Moich przepisach”.');return;}
  const servings=Number($('diaryRecipeServings').value);
  if(!Number.isFinite(servings)||servings<0.25||servings>20){toast('Liczba porcji musi wynosić od 0,25 do 20.');return;}
  addRecipeToDiary(recipe,servings,$('entryDate').value,$('diaryRecipeMeal').value);
});
$('addPlanDayToDiary').addEventListener('click',()=>addPlanDayToDiary($('diaryPlan').value,$('diaryPlanDay').value));
$('mealsList').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;const day=ensureDay($('entryDate').value);day.entries=day.entries.filter(x=>x.id!==b.dataset.remove);save();render();});
document.querySelectorAll('[data-water]').forEach(b=>b.addEventListener('click',()=>{const day=ensureDay($('entryDate').value);day.water=Math.min(10000,(day.water||0)+Number(b.dataset.water));save();renderHydration(day);}));
$('weightForm').addEventListener('submit',e=>{e.preventDefault();const w=Number($('weightInput').value);if(!Number.isFinite(w)||w<30||w>350){toast('Masa musi mieścić się w zakresie 30–350 kg.');return;}const list=state.weights[activeProfile()]||[];list.push({date:$('entryDate').value,weight:w});state.weights[activeProfile()]=list;save();$('weightInput').value='';render();toast('Zapisano pomiar masy ciała.');});
$('createProduct').addEventListener('click',()=>openProductDialog());
$('productForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const name=form.elements.name.value.trim();
  const kcal=Number(form.elements.kcal.value);
  if(!name||!Number.isFinite(kcal)||kcal<0||kcal>950){$('productError').textContent='Wprowadź nazwę i kalorie od 0 do 950 kcal / 100 g.';return;}
  const protein=nval(form.elements.protein.value),fat=nval(form.elements.fat.value),carbs=nval(form.elements.carbs.value);
  if([protein,fat,carbs].some(v=>v!==null&&(v<0||v>100))){$('productError').textContent='Makroskładniki muszą mieścić się w zakresie 0–100 g na 100 g.';return;}
  const data={
    name,brand:form.elements.brand.value.trim(),store:form.elements.store.value,
    kcal100:kcal,protein100:protein,fat100:fat,carbs100:carbs,
    unitWeight:nval(form.elements.unitWeight.value),
    source:'Produkt własny',sourceKind:'custom',
    dataNote:'Wartość wpisana przez użytkownika z etykiety lub innego źródła.'
  };
  const editing=editingProductId?state.customProducts.find(p=>p.id===editingProductId):null;
  if(editing){
    Object.assign(editing,data,{updatedAt:new Date().toISOString()});
  }else{
    state.customProducts.push({id:`custom:${crypto.randomUUID?crypto.randomUUID():Date.now()}`,...data,createdAt:new Date().toISOString()});
  }
  const wasEditing=Boolean(editing);
  editingProductId=null;
  save();closeDialog('productDialog');renderProductsView();
  toast(wasEditing?'Zapisano zmiany produktu.':'Dodano własny produkt.');
});
$('productSearchCatalog').addEventListener('input',()=>{
  productsQuery=$('productSearchCatalog').value;productsLimit=48;
  clearTimeout(productsFilterTimer);
  productsFilterTimer=setTimeout(renderProductsView,160);
});
$('loadMoreProducts').addEventListener('click',()=>{productsLimit+=96;renderProductsView();});
function handleProductAction(event){
  if(event.target.closest('[data-empty-create-product]')){openProductDialog();return;}
  const use=event.target.closest('[data-use-product]');
  if(use){useProductInDiary(use.dataset.useProduct);return;}
  const edit=event.target.closest('[data-edit-product]');
  if(edit){const product=state.customProducts.find(p=>p.id===edit.dataset.editProduct);if(product)openProductDialog(product);return;}
  const remove=event.target.closest('[data-delete-product]');
  if(remove){
    const product=state.customProducts.find(p=>p.id===remove.dataset.deleteProduct);
    if(!product)return;
    if(confirm(`Usunąć własny produkt „${product.name}”?`)){
      state.customProducts=state.customProducts.filter(p=>p.id!==product.id);
      save();renderProductsView();toast('Usunięto własny produkt.');
    }
  }
}
$('customProductsList').addEventListener('click',handleProductAction);
$('seedProductsList').addEventListener('click',handleProductAction);

$('createPlan').addEventListener('click',()=>{if(!state.recipes.length){toast('Najpierw dodaj przepis w zakładce „Moje przepisy”.');showView('recipes');return;}openPlanDialog();});
$('addPlanAssignment').addEventListener('click',()=>{if(!state.recipes.length){$('planError').textContent='Najpierw dodaj przepis w zakładce „Moje przepisy”.';return;}createPlanAssignmentRow();});
$('planForm').elements.startDate.addEventListener('change',updatePlanAssignmentDayLabels);
$('customPlansList').addEventListener('click',e=>{
  if(e.target.closest('[data-empty-create-plan]')){if(!state.recipes.length){showView('recipes');toast('Dodaj najpierw przepis.');}else openPlanDialog();return;}
  const edit=e.target.closest('[data-edit-plan]');if(edit){const plan=state.plans.find(p=>p.id===edit.dataset.editPlan);if(plan)openPlanDialog(plan);return;}
  const del=e.target.closest('[data-delete-plan]');if(del){const plan=state.plans.find(p=>p.id===del.dataset.deletePlan);if(!plan)return;if(confirm(`Usunąć plan „${plan.title}”?`)){state.plans=state.plans.filter(p=>p.id!==plan.id);save();renderCustomPlans();toast('Usunięto plan.');}return;}
});
$('planForm').addEventListener('submit',e=>{
  e.preventDefault();const f=e.currentTarget;const title=f.elements.title.value.trim();const startDate=f.elements.startDate.value;
  const assignments=[...$('planAssignments').querySelectorAll('.plan-assignment-row')].map(row=>({dayIndex:Number(row.querySelector('.assignment-day').value),meal:row.querySelector('.assignment-meal').value,recipeId:row.querySelector('.assignment-recipe-select').value,servings:Number(row.querySelector('.assignment-portions').value)}));
  if(!title||!/^\d{4}-\d{2}-\d{2}$/.test(startDate)||!assignments.length||assignments.some(a=>!a.recipeId||!planRecipeById(a.recipeId)||!Number.isFinite(a.servings)||a.servings<.25||a.servings>20)){$('planError').textContent='Uzupełnij nazwę, datę oraz każdy posiłek: wybierz zapisany przepis i liczbę porcji od 0,25 do 20.';return;}
  const existing=editingPlanId?state.plans.find(p=>p.id===editingPlanId):null;const plan={id:editingPlanId||`plan:${crypto.randomUUID?crypto.randomUUID():Date.now()}`,title,startDate,assignments,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
  if(existing)state.plans=state.plans.map(p=>p.id===editingPlanId?plan:p);else state.plans.unshift(plan);
  save();closeDialog('planDialog');renderWeekly();toast(existing?'Zapisano zmiany planu.':'Utworzono własny plan tygodniowy.');editingPlanId=null;
});
$('createRecipe').addEventListener('click',()=>openRecipeDialog());$('addIngredient').addEventListener('click',()=>createIngredientRow());$('recipeForm').elements.portions.addEventListener('input',updateRecipeTotal);
$('recipeForm').addEventListener('submit',e=>{
  e.preventDefault();const f=e.currentTarget;const ingredients=[...$('ingredientRows').querySelectorAll('.ingredient-row')].map(r=>({name:r.querySelector('.ingredient-name').value.trim(),grams:Number(r.querySelector('.ingredient-grams').value),kcal100:Number(r.querySelector('.ingredient-kcal').value)}));
  if(!f.elements.name.value.trim()||!ingredients.length||ingredients.some(x=>!x.name||!Number.isFinite(x.grams)||x.grams<=0||x.grams>10000||!Number.isFinite(x.kcal100)||x.kcal100<0||x.kcal100>950)){$('recipeError').textContent='Uzupełnij nazwę, składniki, gramaturę (0,1–10 000 g) i kalorie każdego składnika.';return;}
  const portions=Number(f.elements.portions.value);if(!Number.isInteger(portions)||portions<1||portions>30){$('recipeError').textContent='Liczba porcji musi wynosić od 1 do 30.';return;}
  const clean=ingredients.map(x=>({...x,kcal:Number((x.grams*x.kcal100/100).toFixed(2))}));const existing=editingRecipeId?state.recipes.find(r=>r.id===editingRecipeId):null;
  const recipe={id:editingRecipeId||`recipe:${crypto.randomUUID?crypto.randomUUID():Date.now()}`,name:f.elements.name.value.trim(),description:f.elements.description.value.trim(),instructions:f.elements.instructions.value.trim(),meal:f.elements.meal.value,portions,ingredients:clean,totalKcal:clean.reduce((sum,x)=>sum+x.kcal,0),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
  if(existing)state.recipes=state.recipes.map(r=>r.id===editingRecipeId?recipe:r);else state.recipes.push(recipe);
  save();closeDialog('recipeDialog');renderRecipes();renderWeekly();toast(existing?'Zapisano zmiany przepisu.':'Zapisano przepis.');editingRecipeId=null;
});
$('recipesList').addEventListener('click',e=>{
  if(e.target.closest('[data-empty-create-recipe]')){openRecipeDialog();return;}
  const edit=e.target.closest('[data-edit-recipe]');if(edit){const r=state.recipes.find(x=>x.id===edit.dataset.editRecipe);if(r)openRecipeDialog(r);return;}
  const del=e.target.closest('[data-delete-recipe]');if(del){const r=state.recipes.find(x=>x.id===del.dataset.deleteRecipe);if(!r)return;const used=state.plans.some(p=>(p.assignments||[]).some(a=>a.recipeId===r.id));const msg=used?`Przepis „${r.name}” jest używany w planie tygodniowym. Usunięcie usunie go również z tych planów. Kontynuować?`:`Usunąć przepis „${r.name}”?`;if(confirm(msg)){state.recipes=state.recipes.filter(x=>x.id!==r.id);state.plans=state.plans.map(p=>({...p,assignments:(p.assignments||[]).filter(a=>a.recipeId!==r.id)}));save();renderRecipes();renderWeekly();toast('Usunięto przepis.');}return;}
});
$('recipeSearch').addEventListener('input',renderRecipes);$('recipeMealFilter').addEventListener('change',renderRecipes);
$('settingsOpen').addEventListener('click',()=>{ $('workerUrl').value=state.workerUrl||'';openDialog('settingsDialog');refreshCatalogStats();});$('aboutOpen').addEventListener('click',()=>openDialog('aboutDialog'));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
$('saveWorker').addEventListener('click',()=>{const value=$('workerUrl').value.trim().replace(/\/+$/,'');if(value){try{const u=new URL(value);if(!['https:','http:'].includes(u.protocol))throw 0;}catch{toast('Nieprawidłowy adres Worker.');return;}}state.workerUrl=value;save();toast(value?'Zapisano adres Worker.':'Usunięto adres Worker.');});
$('testWorker').addEventListener('click',async()=>{try{const h=await checkWorker($('workerUrl').value.trim());$('workerStatus').textContent=`Połączono · ${h.apiVersion} · FatSecret ${h.sources?.fatsecret?'skonfigurowany':'brak sekretów'} · trwały zapis FatSecret ${h.sources?.fatsecretStorageAllowed?'dozwolony — sprawdź zakres umowy':'wyłączony'} · OFF dostępny.`;}catch(err){$('workerStatus').textContent=err.message;}});
async function refreshCatalogStats(){try{const s=await getCatalogStats();$('catalogInfo').textContent=`Katalog startowy: ${fmt(seedProducts.length)} produktów ogólnych. Import OFF: ${fmt(s.count)} rekordów · ostatnia aktualizacja: ${s.updatedAt?new Date(s.updatedAt).toLocaleString('pl-PL'):'brak'}.`; }catch(err){$('catalogInfo').textContent=err.message;}}
$('catalogFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;$('importStatus').textContent='Rozpoczynam import. Nie zamykaj tej karty.';$('importProgress').value=0;try{const result=await importCatalogFile(file,(pct,stats)=>{$('importProgress').value=pct;$('importStatus').textContent=`Import: ${pct}% · zaimportowano ${fmt(stats.imported)} · odczytano ${fmt(stats.scanned)} rekordów`;});$('importStatus').textContent=`Gotowe: ${fmt(result.imported)} produktów w lokalnej bazie.`;toast('Zaktualizowano zapisaną bazę produktów.');await refreshCatalogStats();}catch(err){$('importStatus').textContent=`Nie udało się zaimportować: ${err.message}`;}finally{e.target.value='';}});
$('clearCatalog').addEventListener('click',async()=>{if(!confirm('Usunąć zaimportowaną bazę OFF z tego urządzenia?'))return;try{await clearImportedCatalog();await refreshCatalogStats();toast('Usunięto zaimportowany katalog.');}catch(e){toast(e.message);}});
$('exportBackup').addEventListener('click',backupData);$('importBackup').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(!imported||typeof imported!=='object'||!imported.profiles||!imported.logs)throw new Error('Nieprawidłowy plik kopii.');state={...defaultState(),...imported};save();render();renderWeekly();renderRecipes();renderProductsView();renderQuickPicks();toast('Zaimportowano kopię danych.');}catch(err){toast(err.message);}finally{e.target.value='';}});
window.addEventListener('keydown',e=>{if(e.key==='Escape')closePortal();});

// Account-scoped state: profiles/logs remain split by gender; custom products, plans and recipes
// are shared between both profile tabs inside the same signed-in account.
function setAuthBusy(busy){$('authSubmit').disabled=busy;$('authSubmit').innerHTML=busy?'Łączenie…':(authMode==='login'?`${ico('login')} Zaloguj się`:`${ico('plus')} Utwórz konto`);}
function showAuthGate(message=''){ $('authGate').classList.remove('hidden');$('authError').textContent=message;$('accountEmail').textContent='';$('logoutButton').hidden=true;document.body.classList.add('auth-locked');document.querySelectorAll('body > header, body > main, body > footer, body > dialog').forEach(el=>el.inert=true); }
function hideAuthGate(user){ $('authGate').classList.add('hidden');document.body.classList.remove('auth-locked');document.querySelectorAll('body > header, body > main, body > footer, body > dialog').forEach(el=>el.inert=false);$('accountEmail').textContent=user?.email||'';$('logoutButton').hidden=false; }
function updateAuthMode(){const register=authMode==='register';$('authTitle').textContent=register?'Utwórz konto':'Zaloguj się';$('authSubmit').innerHTML=register?`${ico('plus')} Utwórz konto`:`${ico('login')} Zaloguj się`;$('authPassword').autocomplete=register?'new-password':'current-password';$('authPassword').minLength=register?8:1;$('authToggle').textContent=register?'Masz już konto? Zaloguj się':'Nie masz konta? Utwórz konto';$('authReset').hidden=register;$('authError').textContent='';}
async function activateUser(user){
  showAuthGate();
  const key=`${STORE_KEY}:user:${user.uid}`;userStoreKey=key;
  const local=loadState(key);
  firebaseSync=firebaseClient.forUser(user.uid);
  try{
    const remote=await firebaseSync.load();
    if(remote&&typeof remote==='object'){
      const base=defaultState();state={...base,...remote,profiles:{...base.profiles,...(remote.profiles||{})},logs:{...base.logs,...(remote.logs||{})},weights:{...base.weights,...(remote.weights||{})},customProducts:Array.isArray(remote.customProducts)?remote.customProducts:[],recipes:Array.isArray(remote.recipes)?remote.recipes:[],plans:Array.isArray(remote.plans)?remote.plans:[]};
    }else{
      // One-time migration of the previous anonymous local profile into the first account on this device.
      const legacy=localStorage.getItem(STORE_KEY);
      if(legacy&&!localStorage.getItem(`${STORE_KEY}:legacy-migrated`)){
        const migrate=confirm('Znaleziono dane z poprzedniej wersji aplikacji zapisane lokalnie. Czy przenieść je na zalogowane konto?');
        state=migrate?loadState(STORE_KEY):local;
        localStorage.setItem(`${STORE_KEY}:legacy-migrated`,'1');
      }else state=local;
    }
    await firebaseSync.save(state); // also migrates the legacy single-document layout into account-scoped documents
    localStorage.setItem(key,JSON.stringify(state));
    $('saveState').innerHTML='<i></i> Konto · synchronizacja aktywna';
  }catch(error){
    console.error('Firebase load:',error);state=local;$('saveState').innerHTML='<i style="background:#c47d52"></i> Błąd synchronizacji';toast('Nie udało się pobrać danych z chmury. Sprawdź połączenie i reguły Firestore.');
  }
  document.body.dataset.profile=state.activeProfile||'female';
  document.querySelectorAll('.profile-tab').forEach(b=>b.classList.toggle('active',b.dataset.profile===state.activeProfile));
  $('catalogMode').value=state.catalogMode||'saved';$('onlineSource').value=state.onlineSource||'fatsecret';$('sourceControl').classList.toggle('hidden',$('catalogMode').value!=='online');
  render();renderRecipes();renderWeekly();renderProductsView();renderQuickPicks();showView('diary');hideAuthGate(user);
  if(profilesNeedInitialSetup(state.profiles))setTimeout(openBothProfilesDialog,220);
}

$('authForm').addEventListener('submit',async e=>{e.preventDefault();if(!firebaseClient){$('authError').textContent='Uzupełnij konfigurację Firebase w js/firebase-config.js i włącz Email/Password w Authentication.';return;}const email=$('authEmail').value.trim();const password=$('authPassword').value;setAuthBusy(true);$('authError').textContent='';try{if(authMode==='register')await firebaseClient.register(email,password);else await firebaseClient.signIn(email,password);}catch(error){const map={'auth/invalid-credential':'Nieprawidłowy e-mail lub hasło.','auth/email-already-in-use':'To konto już istnieje. Zaloguj się.','auth/weak-password':'Hasło musi mieć co najmniej 8 znaków.','auth/invalid-email':'Podaj prawidłowy adres e-mail.','auth/too-many-requests':'Zbyt wiele prób. Spróbuj ponownie później.','auth/network-request-failed':'Brak połączenia z internetem.'};$('authError').textContent=map[error.code]||`Nie udało się zalogować (${error.code||'błąd'}).`;}finally{setAuthBusy(false);}});
$('authToggle').addEventListener('click',()=>{authMode=authMode==='login'?'register':'login';updateAuthMode();});
$('authReset').addEventListener('click',async()=>{const email=$('authEmail').value.trim();if(!email){$('authError').textContent='Najpierw wpisz adres e-mail.';return;}try{await firebaseClient.resetPassword(email);$('authError').textContent='Wysłaliśmy wiadomość z linkiem do zmiany hasła.';}catch(error){$('authError').textContent='Nie udało się wysłać wiadomości. Sprawdź adres e-mail.';}});
$('logoutButton').addEventListener('click',async()=>{if(!confirm('Wylogować się z Dziennika Żywieniowego?'))return;try{await firebaseClient.signOut();}catch(e){toast('Nie udało się wylogować.');}});

// Init — email/password auth is mandatory; Firebase LOCAL persistence remembers the session.
async function initialiseApp(){
  showAuthGate();
  if(!firebaseConfigured(firebaseConfig)){ $('authError').textContent='Aplikacja wymaga konfiguracji Firebase. Uzupełnij js/firebase-config.js, włącz Email/Password Authentication i opublikuj reguły Firestore zgodnie z README_PL.md.';$('authSubmit').disabled=true;return;}
  try{
    firebaseClient=await initFirebaseClient(firebaseConfig);
    authUnsubscribe=firebaseClient.onAuthChanged(async user=>{
      if(user){await activateUser(user);}else{authMode='login';updateAuthMode();$('authForm').reset();clearTimeout(firebaseSaveTimer);firebaseSync=null;userStoreKey=null;state=defaultState();showAuthGate();renderAuthSafe();}
    });
  }catch(error){console.error('Firebase init:',error);$('authError').textContent='Nie można połączyć z Firebase. Sprawdź konfigurację, domenę autoryzowaną i połączenie.';}
}
function renderAuthSafe(){try{document.body.dataset.profile='female';}catch{}}
initialiseApp();

