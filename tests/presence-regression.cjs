// Local RTDB contract simulation; not a Firebase emulator or live server test.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
const rules=JSON.parse(fs.readFileSync(path.join(root,'database.rules.json'),'utf8')).rules.museumPresence['dokdo-ullim-museum-v1'];
function extract(source,name){
 let start=source.indexOf('function '+name+'(');assert(start>=0,name);
 if(source.slice(start-6,start)==='async ')start-=6;
 let i=source.indexOf('{',start)+1,depth=1;
 for(;depth;i++){if(source[i]==='{')depth++;if(source[i]==='}')depth--;}
 return source.slice(start,i);
}
class Snapshot{
 constructor(value,key){this.value=value;this.key=key;}
 exists(){return this.value!==null&&this.value!==undefined;}
 val(){return this.exists()?this.value:null;}
 child(k){return new Snapshot(this.value?.[k],k);}
 isNumber(){return typeof this.value==='number';}
 isString(){return typeof this.value==='string';}
 hasChildren(keys){return keys.every(k=>this.child(k).exists());}
}
function validateTree(rule,value,env){
 if(value===null||value===undefined)return;
 if(rule['.validate']!==undefined)assert(evaluate(rule['.validate'],{...env,newData:new Snapshot(value)}),'validation denied');
 if(typeof value==='object')for(const k of Object.keys(value)){
  const childRule=rule[k]||rule.$other;
  if(childRule)validateTree(childRule,value[k],env);
 }
}
function evaluate(expr,env){return typeof expr==='boolean'?expr:vm.runInNewContext(expr,env);}
function permission(uid,session,oldValue,nextValue,rule=rules.$session){
 const env={auth:uid?{uid}:null,data:new Snapshot(oldValue),newData:new Snapshot(nextValue),$session:session,now:Date.now()};
 assert(evaluate(rule['.write'],env),'PERMISSION_DENIED');
 validateTree(rule,nextValue,env);
}
const flush=()=>new Promise(r=>setImmediate(r));
let records=new Map(),clients=[],serverListeners=[],reservations=new Map(),calls=[];
function notify(event,key,value){for(const l of [...serverListeners])if(l.event===event)l.fn(new Snapshot(value,key));}
function databaseFor(c){return {ref(p){
 if(p==='.info/serverTimeOffset'||p==='.info/connected')return {on(event,fn){queueMicrotask(()=>fn(new Snapshot(p.endsWith('connected')?true:0)))},off(){}};
 return {
 child(key){return {
 key,
 onDisconnect(){return {async remove(){permission(c.cloud.uid,key,records.get(key),null);reservations.set(key,c.cloud.uid)},async cancel(){reservations.delete(key)}}},
 async update(value){permission(c.cloud.uid,key,records.get(key),value);let existed=records.has(key);records.set(key,value);notify(existed?'child_changed':'child_added',key,value);calls.push('update')},
 async remove(){permission(c.cloud.uid,key,records.get(key),null);let previous=records.get(key);records.delete(key);if(previous)notify('child_removed',key,previous)}
 }},
 on(event,fn,error){let listener={owner:c,event,fn,error};serverListeners.push(listener);if(event==='child_added')for(const [key,value] of records)queueMicrotask(()=>fn(new Snapshot(value,key)))},
 off(event,fn){serverListeners=serverListeners.filter(l=>l.owner!==c||l.event!==event||l.fn!==fn)}
 };
 }};}
function client(i){
 const c={Date,Set,Math,Number,Promise,console:{warn(){}},setTimeout,clearTimeout,TEACHER_EMAILS:['happenz@naver.com'],MUSEUM_ID:'dokdo-ullim-museum-v1',PRESENCE_TTL:90000,PRESENCE_MIN_INTERVAL:200,SESSION_ID:'session-'+i,OWN_UIDS:new Set(['u'+i]),presenceRef:null,presenceConnected:false,presenceDisconnect:null,serverOffset:0,presenceUnsubs:[],presenceGeneration:0,presencePaused:false,presenceTimer:0,lastPresenceWrite:0,lastPresencePos:{x:0,y:0},pos:{x:50,y:80},facing:'down',state:{presence:[]},profile:{name:'학생'+i,studentId:'u'+i,group:'1',avatar:{face:0,hair:0,hairColor:0,outfit:0,accessory:0}},cloud:{uid:'u'+i,ready:true,unsubs:[]},status:null,setSyncStatus(kind,text,err){c.status={kind,text,err}},renderPresence(){},normalizeAvatar(a){return a},updateProfileUI(){},registerProfile(){return Promise.resolve()},attachCloudListeners(){},toast(){},showAdminPanel(){c.adminOpened=true},isTeacher:false};
 c.firebase={database:()=>databaseFor(c)};c.firebase.database.ServerValue={TIMESTAMP:Date.now()};c.window={firebase:c.firebase};
 c.elements={};c.$=selector=>c.elements[selector]??=( {classList:{add(){},remove(){}},textContent:'',disabled:false} );
 vm.createContext(c);
 vm.runInContext(['emailAllowed','activePresence','writePresence','schedulePresence','stopPresenceListeners','cleanupPresence','initPresence','teacherSignIn'].map(n=>extract(html,n)).join('\n'),c);
 clients.push(c);return c;
}
function user(uid,email=null){return {uid,isAnonymous:!email,email,emailVerified:!!email,getIdToken:async()=>{},reload:async()=>{}};}
(async()=>{
 // Reproduce original failure using original expression exactly.
 const oldRule={...rules.$session,'.write':"auth != null && ((!data.exists() && newData.child('uid').val() == auth.uid) || data.child('uid').val() == auth.uid)"};
 assert.throws(()=>permission('u0','session-0',null,null,oldRule));
 permission('u0','session-0',null,null);
 assert.throws(()=>permission(null,'session-0',null,null));
 console.log('PASS original first-join denial reproduced; fixed empty-node disconnect reservation allowed; anonymous request denied');
 for(let i=0;i<24;i++)client(i).initPresence();await flush();await flush();
 assert.equal(records.size,24);assert.equal(reservations.size,24);
 for(const c of clients){assert.equal(c.activePresence().length,24);assert.equal(c.activePresence().filter(p=>p.uid!==c.cloud.uid).length,23);assert.equal(c.status.kind,'online');}
 const initial=records.get('session-0');
 assert.throws(()=>permission('u1','session-0',initial,null));
 assert.throws(()=>permission('u1','session-0',initial,{...initial,x:55}));
 assert.throws(()=>permission('u1','new',null,{...initial,sessionId:'new'}));
 assert.throws(()=>permission('u0','session-0',initial,{...initial,x:150}));
 assert.throws(()=>permission('u0','session-0',initial,{...initial,admin:true}));
 console.log('PASS 24 clients each see 23 peers; foreign deletion/update, forged UID, bad position and unexpected fields denied');
 const c=clients[0];c.pos.x=60;await c.writePresence();assert.equal(clients[1].state.presence.find(p=>p.uid==='u0').x,60);
 // Simulate server disconnect after reservation.
 const last=clients.pop();last.stopPresenceListeners();permission('u23','session-23',records.get('session-23'),null);records.delete('session-23');notify('child_removed','session-23',null);
 for(const peer of clients)assert.equal(peer.activePresence().length,23);
 const listenerCount=serverListeners.length;c.initPresence();await flush();assert.equal(serverListeners.length,listenerCount);
 console.log('PASS movement delivered, disconnect removed, reconnect listeners not duplicated');
 // Removal failure must not block Google's popup or verified teacher login.
 c.presenceRef={remove:async()=>{throw new Error('PERMISSION_DENIED')}};
 let auth={currentUser:user('u0')};let popup=0;
 auth.currentUser.linkWithPopup=()=>{popup++;auth.currentUser=user('u0','happenz@naver.com');return Promise.resolve({user:auth.currentUser})};
 c.firebase.auth=()=>auth;c.firebase.auth.GoogleAuthProvider=function(){this.setCustomParameters=()=>{}};
 const signing=c.teacherSignIn();assert.equal(popup,1,'popup called synchronously from click');await signing;await flush();assert(c.isTeacher);assert(c.adminOpened);
 // Existing Google account: fallback changes UID and starts a new presence session.
 auth.currentUser=user('u0');auth.currentUser.linkWithPopup=()=>Promise.reject({code:'auth/credential-already-in-use',credential:{}});
 auth.signInWithCredential=async()=>{auth.currentUser=user('teacher-uid','happenz@naver.com');return {user:auth.currentUser}};
 await c.teacherSignIn();await flush();assert.equal(c.cloud.uid,'teacher-uid');assert.notEqual(c.SESSION_ID,'session-0');assert(!records.has('session-0'));assert(records.has(c.SESSION_ID));
 console.log('PASS cleanup rejection does not block popup; linked teacher and existing-account UID switch recover presence');
 // Denied account returns to anonymous, never to admin.
 auth.signInWithPopup=async()=>{auth.currentUser=user('other','other@example.com');return {user:auth.currentUser}};
 auth.signOut=async()=>{auth.currentUser=null};auth.signInAnonymously=async()=>{auth.currentUser=user('new-anon');return {user:auth.currentUser}};
 await c.teacherSignIn();await flush();assert.equal(c.isTeacher,false);assert.equal(c.cloud.uid,'new-anon');
 console.log('PASS unlisted Google account is not promoted to teacher');
 for(const c of clients)c.stopPresenceListeners();
})().catch(e=>{console.error(e);process.exitCode=1});
