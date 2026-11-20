export function firebaseConfigured(config){
  return Boolean(config && config.apiKey && !config.apiKey.startsWith('UZUPELNIJ') && config.projectId && !config.projectId.startsWith('UZUPELNIJ') && config.appId && !config.appId.startsWith('UZUPELNIJ'));
}

// Firebase Auth LOCAL persistence remembers the session on this browser/device.
// Passwords are handled only by Firebase Auth and are never written to app storage.
export async function initFirebaseClient(config){
  if(!firebaseConfigured(config)) throw new Error('Logowanie nie jest skonfigurowane. Skontaktuj się z administratorem aplikacji.');
  const [appMod,authMod,firestoreMod]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
  ]);
  const app=appMod.initializeApp(config);
  const auth=authMod.getAuth(app);
  await authMod.setPersistence(auth,authMod.browserLocalPersistence);
  const db=firestoreMod.getFirestore(app);
  return {
    onAuthChanged(callback){return authMod.onAuthStateChanged(auth,callback);},
    async signIn(email,password){return (await authMod.signInWithEmailAndPassword(auth,email,password)).user;},
    async register(email,password){return (await authMod.createUserWithEmailAndPassword(auth,email,password)).user;},
    async resetPassword(email){return authMod.sendPasswordResetEmail(auth,email);},
    async signOut(){return authMod.signOut(auth);},
    forUser(uid){
      const ref=name=>firestoreMod.doc(db,'users',uid,'appData',name);
      return {
        uid,
        async load(){
          const [female,male,shared,prefs,legacy]=await Promise.all([
            firestoreMod.getDoc(ref('profile_female')),firestoreMod.getDoc(ref('profile_male')),
            firestoreMod.getDoc(ref('shared')),firestoreMod.getDoc(ref('preferences')),firestoreMod.getDoc(ref('main'))
          ]);
          const old=legacy.exists()?(legacy.data().state||{}):{};
          if(!female.exists()&&!male.exists()&&!shared.exists()&&!prefs.exists()&&legacy.exists()) return old;
          const f=female.exists()?female.data():{profile:old.profiles?.female,logs:old.logs?.female,weights:old.weights?.female};
          const m=male.exists()?male.data():{profile:old.profiles?.male,logs:old.logs?.male,weights:old.weights?.male};
          const sh=shared.exists()?shared.data():{customProducts:old.customProducts,recipes:old.recipes,plans:old.plans};
          const pr=prefs.exists()?prefs.data():old;
          return {
            activeProfile:pr.activeProfile||'female',profiles:{female:f.profile||null,male:m.profile||null},
            logs:{female:f.logs||{},male:m.logs||{}},weights:{female:f.weights||[],male:m.weights||[]},
            customProducts:Array.isArray(sh.customProducts)?sh.customProducts:[],recipes:Array.isArray(sh.recipes)?sh.recipes:[],plans:Array.isArray(sh.plans)?sh.plans:[],
            workerUrl:pr.workerUrl||'',catalogMode:pr.catalogMode||'saved',onlineSource:pr.onlineSource||'fatsecret'
          };
        },
        async save(state){
          await Promise.all([
            firestoreMod.setDoc(ref('profile_female'),{profile:state.profiles?.female||null,logs:state.logs?.female||{},weights:state.weights?.female||[],updatedAt:firestoreMod.serverTimestamp()}),
            firestoreMod.setDoc(ref('profile_male'),{profile:state.profiles?.male||null,logs:state.logs?.male||{},weights:state.weights?.male||[],updatedAt:firestoreMod.serverTimestamp()}),
            firestoreMod.setDoc(ref('shared'),{customProducts:state.customProducts||[],recipes:state.recipes||[],plans:state.plans||[],updatedAt:firestoreMod.serverTimestamp()}),
            firestoreMod.setDoc(ref('preferences'),{activeProfile:state.activeProfile||'female',workerUrl:state.workerUrl||'',catalogMode:state.catalogMode||'saved',onlineSource:state.onlineSource||'fatsecret',updatedAt:firestoreMod.serverTimestamp()})
          ]);
        }
      };
    }
  };
}
