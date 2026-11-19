import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const sync=await readFile(new URL('js/firebase-sync.js',root),'utf8');
const app=await readFile(new URL('js/app.js',root),'utf8');
const html=await readFile(new URL('index.html',root),'utf8');
const rules=await readFile(new URL('firestore.rules',root),'utf8');

test('email/password auth and browser-local Firebase session are enabled',()=>{
  assert.match(sync,/signInWithEmailAndPassword/);
  assert.match(sync,/createUserWithEmailAndPassword/);
  assert.match(sync,/sendPasswordResetEmail/);
  assert.match(sync,/browserLocalPersistence/);
  assert.doesNotMatch(sync,/signInAnonymously/);
  assert.match(html,/id="authGate"/);
  assert.match(html,/type="email"/);
  assert.match(html,/type="password"/);
});

test('app remains locked until auth state has a user and supports logout',()=>{
  assert.match(app,/showAuthGate\(\)/);
  assert.match(app,/hideAuthGate\(user\)/);
  assert.match(app,/firebaseClient\.signOut\(\)/);
  assert.match(app,/firebaseClient\.onAuthChanged/);
});

test('user state is namespaced by Firebase uid and legacy migration is opt-in',()=>{
  assert.match(app,/const key=`\$\{STORE_KEY\}:user:\$\{user\.uid\}`/);
  assert.match(app,/Czy przenieść je na zalogowane konto\?/);
  assert.match(app,/localStorage\.setItem\(key,JSON\.stringify\(state\)\)/);
});

test('female/male profile data are stored separately while custom products, plans and recipes share one account document',()=>{
  assert.match(sync,/ref\('profile_female'\)/);
  assert.match(sync,/ref\('profile_male'\)/);
  assert.match(sync,/ref\('shared'\)/);
  assert.match(sync,/customProducts:state\.customProducts/);
  assert.match(sync,/recipes:state\.recipes/);
  assert.match(sync,/plans:state\.plans/);
  assert.match(rules,/request\.auth\.uid == userId/);
});

test('recipe ingredient picker is searchable and textarea has custom styles',async()=>{
  assert.match(app,/ingredient-product-search/);
  assert.match(app,/drawResults/);
  const css=await readFile(new URL('css/styles.css',root),'utf8');
  assert.match(css,/\.recipe-notes-grid textarea/);
  assert.match(css,/\.ingredient-product-results/);
});
