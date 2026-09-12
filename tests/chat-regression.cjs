const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
function extract(n){let a=html.indexOf('function '+n+'(');if(html.slice(a-6,a)==='async ')a-=6;let i=html.indexOf('{',a)+1,d=1;for(;d;i++){if(html[i]==='{')d++;if(html[i]==='}')d--;}return html.slice(a,i)}
class El{constructor(){this.children=[];this.dataset={};this.textContent='';this.value='';}appendChild(n){n.parent=this;this.children.push(n)}querySelector(){return this.children.find(n=>n.className==='speech-bubble')}remove(){this.parent.children=this.parent.children.filter(n=>n!==this)}}
(async()=>{
let timers=new Map(),counter=0,storage=new Map(),writePromise;
const c={Map,Date,Number,String,Object,Promise,CHAT_BUBBLE_MS:5000,chatBubbles:new Map(),chatSeenIds:new Set(),chatEnteredAt:Date.now()-100,chatDeleteBusy:false,serverOffset:0,cloud:{ready:true,uid:'self'},avatarEl:new El(),remoteNodes:new Map([['friend',{el:new El()}]]),document:{createElement:()=>new El()},setTimeout:f=>{timers.set(++counter,f);return counter},clearTimeout:id=>timers.delete(id),isTeacher:true,confirm:()=>true,sanitizeId:s=>s,saveLocalData(){},renderChat(){},toast(){},profile:{name:'나'},uid:()=> 'local-message',state:{messages:[]}};
const input=new El();c.$=()=>input;c.ensureProfile=fn=>{writePromise=fn()};
let writes=0,failWrite=false;
const collection={doc(id){return {async set(data){writes++;if(failWrite)throw Error('offline');storage.set(id,data)},async delete(){storage.delete(id)}}},orderBy(){let cutoff;return {endAt(t){cutoff=t;return this},limit(n){return {async get(){let docs=[...storage].filter(([id,m])=>m.createdAtMs<=cutoff).slice(0,n).map(([id])=>({id,ref:id}));return {docs,empty:docs.length===0}}}}}}};
c.cloud.museumRef={collection:()=>collection};let batches=0;c.cloud.db={batch(){let ids=[];return {delete:id=>ids.push(id),async commit(){batches++;ids.forEach(id=>storage.delete(id))}}}};
vm.createContext(c);vm.runInContext(['paintChatBubble','removeChatBubble','showChatBubble','applyChatChanges','deleteChatMessage','clearChatHistory','sendChat'].map(extract).join('\n'),c);
await c.sendChat('안녕 <img src=x onerror=alert(1)>');assert(c.avatarEl.querySelector().textContent.includes('<img'));await writePromise;assert.equal(writes,1);
assert.equal(c.chatBubbles.get('self').until-Date.now()<=5000,true);
const node=c.avatarEl.querySelector();c.showChatBubble({id:'local-message',ownerUid:'self',text:'중복'});assert.equal(c.avatarEl.querySelector(),node);
c.showChatBubble({id:'next',ownerUid:'self',text:'다음 말'});assert.equal(c.avatarEl.children.length,1);assert.equal(c.avatarEl.querySelector().textContent,'다음 말');
c.applyChatChanges({docChanges:()=>[{type:'added',doc:{id:'remote',data:()=>({ownerUid:'friend',text:'반가워',createdAtMs:Date.now()})}}]});assert.equal(c.remoteNodes.get('friend').el.querySelector().textContent,'반가워');
c.applyChatChanges({docChanges:()=>[{type:'removed',doc:{id:'remote'}}]});assert(!c.remoteNodes.get('friend').el.querySelector());
c.applyChatChanges({docChanges:()=>[{type:'added',doc:{id:'old',data:()=>({ownerUid:'friend',text:'옛날 말',createdAtMs:Date.now()-30000})}}]});assert(!c.chatBubbles.has('friend'));
failWrite=true;await c.sendChat('실패 메시지');await writePromise;assert.equal(input.value,'실패 메시지');
storage.set('one',{createdAtMs:Date.now()});c.isTeacher=false;await c.deleteChatMessage('one');assert(storage.has('one'));await c.clearChatHistory();assert(storage.has('one'));c.isTeacher=true;await c.deleteChatMessage('one');assert(!storage.has('one'));
storage.clear();for(let i=0;i<650;i++)storage.set('m'+i,{createdAtMs:Date.now()-10000});storage.set('new',{createdAtMs:Date.now()+10000});await c.clearChatHistory();assert.equal(batches,3);assert.equal(storage.size,1);assert(storage.has('new'));
console.log('PASS instant own bubble, safe text, deduplication/replacement, remote bubble/deletion, no history replay, failed-send restoration, teacher-only UI guard, 650-message paginated deletion preserving newer chat');
})().catch(e=>{console.error(e);process.exitCode=1});
