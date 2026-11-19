import test from 'node:test';
import assert from 'node:assert/strict';
import {seedProducts,seedCatalogInfo} from '../js/seed-products.js';
import {normalizeText} from '../js/catalog.js';

test('starter catalog has stable unique records and valid nutrients',()=>{
  assert.ok(seedProducts.length>=1050,`expected expanded starter catalog, got ${seedProducts.length}`);
  assert.equal(new Set(seedProducts.map(p=>p.id)).size,seedProducts.length,'product IDs must be unique');
  for(const p of seedProducts){
    assert.ok(p.id&&p.name&&p.category,`missing identity for ${p.id}`);
    assert.ok(Number.isFinite(p.kcal100)&&p.kcal100>=0&&p.kcal100<=950,p.id);
    for(const k of ['protein100','fat100','carbs100'])assert.ok(Number.isFinite(p[k])&&p[k]>=0&&p[k]<=100,`${p.id}.${k}`);
    assert.equal(p.store,'Ogólne');
    assert.equal(p.sourceKind==='generic-reference'||p.sourceKind==='published-reference',true);
  }
  assert.equal(seedCatalogInfo.count,seedProducts.length);
  assert.match(seedCatalogInfo.version,/2026-11-20.1/);
});

test('search for bułka returns multiple daily bread variants',()=>{
  const q=normalizeText('bułka');
  const found=seedProducts.filter(p=>normalizeText([p.name,...p.aliases].join(' ')).includes(q));
  assert.ok(found.length>=30,`expected at least 30 bun-related products, got ${found.length}`);
  for(const id of ['roll','roll-graham','roll-multigrain','roll-rye','roll-spelt','roll-protein','roll-milk','roll-butter','roll-hotdog','roll-burger'])
    assert.ok(found.some(p=>p.id===id),`missing ${id}`);
});

test('existing quick-add and recipe references are retained',()=>{
  for(const id of ['banana','chicken','oats','skyr','rice-dry','rice-cooked','pasta-dry','pasta-cooked','bread','roll','egg','cottage','gouda','tomato','cucumber','broccoli','potato','avocado','olive-oil','peanut-butter','salmon','tuna','lentils','dark-chocolate'])
    assert.ok(seedProducts.some(p=>p.id===id),`missing backwards-compatible id ${id}`);
});

test('sourced Frida item keeps traceable source and licence metadata',()=>{
  const p=seedProducts.find(x=>x.id==='roll-sweet');
  assert.equal(p.kcal100,296);assert.equal(p.protein100,9.1);assert.match(p.sourceUrl,/frida\.fooddata\.dk/);assert.equal(p.sourceLicense,'CC BY 4.0');
});


test('expanded catalog includes broad category coverage and useful preparation variants',()=>{
  for(const category of ['Owoce','Warzywa','Pieczywo','Nabiał i jaja','Mięso i ryby','Produkty zbożowe','Rośliny strączkowe','Dania gotowe','Napoje'])
    assert.ok(seedProducts.filter(p=>p.category===category).length>=20,`category too small: ${category}`);
  for(const term of ['mrożone','gotowane','pieczone','opiekane','na mleku','bez laktozy'])
    assert.ok(seedProducts.some(p=>p.name.toLowerCase().includes(term)),`missing useful variant ${term}`);
  assert.ok(seedProducts.every(p=>p.dataNote&&p.source&&p.store==='Ogólne'));
});
