import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const app=await readFile(new URL('../js/app.js',import.meta.url),'utf8');

test('initial setup contains required fields for both profiles and is not dismissible',()=>{
  const start=html.indexOf('<dialog id="setupBothDialog"');
  const end=html.indexOf('</dialog>',start);
  assert.ok(start>=0&&end>start,'dual-profile onboarding dialog exists');
  const form=html.slice(start,end);
  for(const sex of ['female','male'])for(const field of ['Age','Height','Weight','Pal','Goal']){
    assert.match(form,new RegExp(`name="${sex}${field}"`),`${sex} ${field} field exists`);
  }
  assert.doesNotMatch(form,/data-close=/,'initial setup has no skip/close action');
  assert.match(app,/setupBothDialog'\)\.addEventListener\('cancel',e=>\{e\.preventDefault\(\)/,'Escape cancel is prevented');
  assert.match(app,/profilesNeedInitialSetup\(state\.profiles\)/,'startup requires both configured profiles');
});
