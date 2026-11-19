import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const app=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../css/styles.css',import.meta.url),'utf8');
const firebase=await readFile(new URL('../js/firebase-sync.js',import.meta.url),'utf8');

test('diary keeps the main four cards in the requested order and removes the day chip',()=>{
  const start=html.indexOf('<div class="primary-bento">');
  const end=html.indexOf('</div>\n      </section>',start);
  const main=html.slice(start,end>start?end:undefined);
  const order=['BILANS DNIA','DZIENNIK POSIŁKÓW','TWOJE SPOŻYCIE','DOBRY NAWYK'].map(x=>main.indexOf(x));
  assert.ok(order.every(x=>x>=0));
  assert.deepEqual(order,[...order].sort((a,b)=>a-b));
  assert.doesNotMatch(html,/id="dayLabel"|Dzień dziennika/);
  assert.doesNotMatch(app,/dayLabel|todayLabel/);
});

test('secondary dashboard orders progress directly below profile settings and keeps metrics 2x2',()=>{
  const secondary=html.slice(html.indexOf('class="dashboard-secondary"'),html.indexOf('</section>\n    </section>',html.indexOf('class="dashboard-secondary"')));
  const profile=secondary.indexOf('USTAWIENIA PROFILU');
  const progress=secondary.indexOf('POSTĘPY');
  const metric=secondary.indexOf('metrics-grid');
  assert.ok(profile>=0&&progress>profile&&metric>progress);
  assert.match(css,/\.secondary-profile-stack\s*\{/);
  assert.match(css,/\.metrics-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.secondary-top-grid\{grid-template-columns:minmax\(0,1fr\)/);
});

test('custom plans support create, edit, delete and recipes are their only source',()=>{
  assert.match(html,/id="createPlan"/);
  assert.match(html,/id="planDialog"/);
  assert.match(html,/id="planAssignments"/);
  assert.match(app,/data-edit-plan/);
  assert.match(app,/data-delete-plan/);
  assert.match(app,/!a\.recipeId\|\|!planRecipeById\(a\.recipeId\)/);
  // Cały plan nie jest już dodawany jednym przyciskiem: do dziennika trafia wybrany dzień planu.
  assert.doesNotMatch(app,/data-add-custom-plan/);
  assert.match(html,/data-add-mode="plan-day"/);
  assert.match(app,/function addPlanDayToDiary\(/);
  assert.match(app,/currentPlanData\(\)/);
});

test('sample week is generated statically while custom plans and recipes are part of synced state',()=>{
  assert.match(app,/function currentPlanData\(\)/);
  assert.match(app,/state\.plans\.unshift\(plan\)/);
  assert.match(app,/state\.recipes\.push\(recipe\)/);
  assert.match(firebase,/setDoc\(ref\('shared'\),\{customProducts:state\.customProducts\|\|\[\],recipes:state\.recipes\|\|\[\],plans:state\.plans\|\|\[\]/);
  assert.match(html,/Wzorcowy jadłospis do podglądu\. Nie jest zapisywany i nie podlega edycji\./);
});

test('backup controls are in settings, not in the sticky header',()=>{
  const header=html.slice(html.indexOf('<header'),html.indexOf('</header>')+9);
  assert.match(header,/id="settingsOpen"/);
  assert.doesNotMatch(header,/backup|Kopia zapasowa/i);
  assert.match(html,/id="exportBackup"/);
});


test('service worker pre-caches the single merged starter catalog module',()=>{
  const sw=readFile(new URL('../sw.js',import.meta.url),'utf8');
  return sw.then(source=>{
    assert.match(source,/seed-products\.js/);
    assert.doesNotMatch(source,/seed-products-extra/);
  });
});

test('responsive layout promotes main diary cards and full-width secondary cards on phones',()=>{
  assert.match(css,/@media\(max-width:700px\)[\s\S]*?\.primary-bento\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css,/@media\(max-width:700px\)[\s\S]*?\.secondary-top-grid\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css,/@media\(max-width:700px\)[\s\S]*?\.recipes-grid\{[^}]*grid-template-columns:1fr/);
});
