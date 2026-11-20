import test from 'node:test';
import assert from 'node:assert/strict';
import {storeProducts,storeCatalogInfo,lidlProducts,lidlMeatProducts,lidlDeliProducts,lidlDairyProducts,kauflandProducts,kauflandMeatProducts,kauflandDeliProducts,kauflandDairyProducts} from '../js/store-products.js';
import {seedDishes,dishCatalogInfo} from '../js/seed-dishes.js';

test('store catalog combines Biedronka, Lidl and Kaufland with unique IDs',()=>{
  assert.ok(storeProducts.length>=340,`expected store catalog, got ${storeProducts.length}`);
  assert.equal(new Set(storeProducts.map(p=>p.id)).size,storeProducts.length);
  assert.deepEqual([...new Set(storeProducts.map(p=>p.store))].sort(),['Biedronka','Kaufland','Lidl']);
  assert.equal(storeCatalogInfo.count,storeProducts.length);
  assert.equal(storeCatalogInfo.biedronka,169);
  assert.equal(storeCatalogInfo.lidl,lidlProducts.length+lidlMeatProducts.length+lidlDeliProducts.length+lidlDairyProducts.length);
  assert.equal(storeCatalogInfo.kaufland,kauflandProducts.length+kauflandMeatProducts.length+kauflandDeliProducts.length+kauflandDairyProducts.length);
  assert.equal(storeCatalogInfo.lidlMeat,lidlMeatProducts.length);
  assert.equal(storeCatalogInfo.lidlDeli,lidlDeliProducts.length);
  assert.equal(storeCatalogInfo.lidlDairy,lidlDairyProducts.length);
  assert.equal(storeCatalogInfo.kauflandMeat,kauflandMeatProducts.length);
  assert.equal(storeCatalogInfo.kauflandDeli,kauflandDeliProducts.length);
  assert.equal(storeCatalogInfo.kauflandDairy,kauflandDairyProducts.length);
});

test('Lidl and Kaufland meat and dairy entries use official assortment names and reference values',()=>{
  const meatAndDairy=[...lidlMeatProducts,...lidlDeliProducts,...lidlDairyProducts,...kauflandMeatProducts,...kauflandDeliProducts,...kauflandDairyProducts];
  assert.ok(meatAndDairy.length>=100,`expected at least 100 meat/dairy entries, got ${meatAndDairy.length}`);
  assert.ok(lidlMeatProducts.length>=15);
  assert.ok(lidlDairyProducts.length>=25);
  assert.ok(kauflandMeatProducts.length>=18);
  assert.ok(kauflandDairyProducts.length>=15);
  for(const p of meatAndDairy){
    assert.equal(p.sourceKind,'retailer-assortment-reference',p.id);
    assert.match(p.sourceUrl,/^https:\/\/(www\.lidl\.pl|sklep\.kaufland\.pl)\//,p.id);
    assert.match(p.dataNote,/orientacyjne/i,p.id);
    assert.match(p.dataNote,/etykiet/i,p.id);
    assert.ok(p.name&&p.category&&p.store,p.id);
    assert.ok(Number.isFinite(p.unitWeight)&&p.unitWeight>0,p.id);
    for(const key of ['kcal100','protein100','fat100','carbs100'])assert.ok(Number.isFinite(p[key])&&p[key]>=0,`${p.id}.${key}`);
    assert.ok(p.kcal100<=950,p.id);
    assert.ok(p.protein100+p.fat100+p.carbs100<=100,p.id);
  }
  assert.ok(meatAndDairy.some(p=>p.store==='Lidl'&&/Filet z piersi kurczaka/.test(p.name)));
  assert.ok(meatAndDairy.some(p=>p.store==='Lidl'&&/Serek wiejski/.test(p.name)));
  assert.ok(meatAndDairy.some(p=>p.store==='Kaufland'&&/Schab/.test(p.name)));
  assert.ok(meatAndDairy.some(p=>p.store==='Kaufland'&&/Twaróg/.test(p.name)));
});

test('Biedronka entries keep official card source and valid nutrition',()=>{
  const biedronka=storeProducts.filter(p=>p.store==='Biedronka');
  assert.ok(biedronka.length>=160);
  assert.ok(biedronka.filter(p=>p.category==='Pieczywo').length>=25);
  for(const p of biedronka){
    assert.equal(p.sourceKind,'retailer-official');
    assert.match(p.sourceUrl,/^https:\/\/zakupy\.biedronka\.pl\//);
    assert.ok(Number.isFinite(p.kcal100)&&p.kcal100>=0&&p.kcal100<=950,p.id);
    assert.match(p.dataNote,/etykieta/i);
  }
});

test('Lidl and Kaufland bakery assortment is clearly labelled as reference data',()=>{
  assert.ok(lidlProducts.length>=60);
  assert.ok(kauflandProducts.length>=14);
  for(const p of [...lidlProducts,...kauflandProducts]){
    assert.equal(p.sourceKind,'retailer-assortment-reference');
    assert.match(p.sourceUrl,/^https:\/\//);
    assert.ok(p.name&&p.category&&p.store);
  }
  assert.ok(lidlProducts.some(p=>/kajzerka/i.test(p.name)));
  assert.ok(kauflandProducts.some(p=>/chleb wiejski/i.test(p.name)));
});

test('dish catalog has homemade and fast-food entries with unique IDs',()=>{
  assert.ok(seedDishes.length>=150,`expected dish catalog, got ${seedDishes.length}`);
  assert.equal(new Set(seedDishes.map(d=>d.id)).size,seedDishes.length);
  assert.equal(dishCatalogInfo.count,seedDishes.length);
  assert.ok(dishCatalogInfo.homemade>=85);
  assert.ok(dishCatalogInfo.fastFood>=60);
  for(const d of seedDishes){
    assert.ok(d.id&&d.name&&d.meal&&d.servingWeight>0,d.id);
    for(const k of ['kcal','protein','fat','carbs'])assert.ok(Number.isFinite(d[k])&&d[k]>=0,`${d.id}.${k}`);
  }
});

test('all five Burger Drwala variants are present with official calories',()=>{
  const drwale=seedDishes.filter(d=>/Burger Drwala/.test(d.name));
  assert.equal(drwale.length,5);
  const expected=new Map([['Klasyczny',923],['z kurczakiem',863],['z żurawiną',940],['Serowy',974],['Na ostro',900]]);
  for(const [variant,kcal] of expected){
    const dish=drwale.find(d=>d.name.includes(variant));
    assert.ok(dish,`missing Drwal ${variant}`);
    assert.equal(dish.kcal,kcal,`Drwal ${variant}`);
    assert.equal(dish.category,"McDonald's");
  }
});
