import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const css=await readFile(new URL('../css/styles.css',import.meta.url),'utf8');
const js=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
test('search results portal is a body-level fixed overlay above cards',()=>{
  assert.match(html,/<div id="resultsPortal" class="results-portal/);
  assert.match(css,/\.results-portal\{position:fixed;z-index:10000/);
  assert.match(js,/function positionPortal\(/);
  assert.match(js,/el\.style\.top=/);
  assert.match(js,/window\.addEventListener\('scroll',positionPortal,true\)/);
});

test('FatSecret diary persistence is blocked unless Worker reports explicit permission',()=>{
  assert.match(js,/selectedProduct\.source==='FatSecret'&&selectedProduct\.storageAllowed!==true/);
  assert.match(js,/addToDiary'\)\.disabled=p\.source==='FatSecret'&&p\.storageAllowed!==true/);
});

test('catalog mode and provider selection persist between visits',()=>{
  assert.match(js,/state\.catalogMode=\$\('catalogMode'\)\.value;save\(\)/);
  assert.match(js,/state\.onlineSource=\$\('onlineSource'\)\.value;save\(\)/);
});
