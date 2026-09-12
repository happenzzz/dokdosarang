(function(){
"use strict";

/* ══════════ 설정 ══════════ */
var MUSEUM_ID="dokdo-ullim-museum-v1";
var TEACHER_EMAILS=["happenz@naver.com","daesin24841@gmail.com"];      // 교사 계정(구글 로그인). 필요하면 여기에 추가하세요.
var LOCAL_KEY="dokdoUllim_v2";
var PROFILE_KEY="dokdoUllimProfile_v5";
var FILE_DB="dokdoUllimFiles_v2", FILE_STORE="files";
var MAX_FILE_BYTES=25*1024*1024;
var MAP_W=1672, MAP_H=941;
var MASK_W=256, MASK_H=144;
var MASK_B64="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//8AAAB/////AAAAAAAAAAAAAAAAAAAAAAgAAAAAAAP//wAAAH/////AAHAAAAAAAAAAAIAAAAAAP/gAAAAAA///AAAAf8AP/+AA+AAAAAAAAAAAgAAAAAH///gAAAAD//8AAAB/wA//8AD+AAAAAAAAAAeAAAAAB/////gAAAP//wAAAH//D//8AP8AAAAAAAAA/+AAAAAf//////gAA///AAAAf/////4Af8AAAAAAAAH/+AAAAP////////gD//8AAAB//////wA/4AAAAAAAAf//AAAD////////+AP//wAAA///////wB/wAAAAAAAB//+AAA/////////4A///AAAf///////gH/gAAAAAAAD//4AAf/////////gDwAAAAH////////AP/AAAAAAAAP/+AAH/////////+APAAD///////////Af8AAAAAAAA//wAAf/////////8AcAAP//////////+A/wAAAAAAAH/+AAB////AAAAA/wBwAA///////4P//wA/AAAAAAAA//wAAH///8AAAAD/AHAAD///////A//+AB+AAAAAAAH/+AAAf///wAAAAP8AcAAP/4AAB/+D//wAH4AAAAAAB//wAAB////AAAAA/wBwAA//gAAH////+AA/wAAAAAAf/+AAAH///8AAAAD/AHAAD/8AAAf////wAD/AAAAAAD//4AAAAP//wAAAAP8AcAAP/wAAD////+AAP+AAAAAAP//gAAAA///AAAAA/wBwAA//AAAP////wAA/+cAAAAB//+AAAAD//8AAAAD/AH////8AAB////+AAf//wAAAAP//AAAAAf//wAAAAP+Af////wAAP////wAH///AAAAB+/4AAAAD///AAAAA/4B/////AAD/////AA///wBwAAPz/gAAAAf//8AAAAAAAH////8AB/////+Af///4HgAB/H+AAAAD/4PxAAAAAAAH////wAP/////wH////8eA+P//4AAAAP/gf+AAAAAAAD////AD///////////////////gAAAA/+A/8AAAAAAAD///8A//3////////////////+AAAAD/4Af4AAAAAAADgA////8f8H//////////////4AACAH/gAPwAAAAAAAAAB/////8A///////////////gAA+Af+AAfwAAAAAAAAAB////8AB///////////////gAP8B/4AB///+AAAAAAAB///4AAH///////////////4D/8P/8AB///4AAAAAAAH//4AAAf///////////////w//5//8AD///gAAAAAAAf/4AAAP///////////////////////AH//+AAAAAAAAAAAAAA////////////////////////AP//4AAAAAAAAAAAAAD/////////////////f//////////gAAAAAAAAAAAAAf////////////////+//////////+AAAAAAAAAAAAAH/////////////////9///v//////4AAAAAAAAAAAAA//////////////////5///n//////gAAAAAAAAAAAAD//////////////////z//4D//////AAAAAAAAAAAAAD/////////////////////gD/////8QAAAAAAAAAAAAD////////////////////+AD/////4AAAAAAAAAAAAAH////////////////////4AD///D/wAAAAAAAAAAAAAH////////////////////wAD//AH/gAAAAAAAAIAAAAH///////////////////nwAD8AAP+AAAAAAAAf4AAAAH///////////////////HgADwAAf8AAAAAAA//8AAAAP///////////////////GAADAAA/wAAAAAA///8AAAAP//////////////////8AAAAAAB/AAAAAB////+AAAAP//////////////////AAAAAAAB4AAAAAAAAAP+AAAAf/////////////////wAAAAAAABgAAAAAAAAA//AAAAf////////////////8AAAAAAAAAAAAAAAAAAD//AAAAf////////////////AAAAAAAAAAAAAAAAAAAP//gAAAf///////////////wAAAAAAAAAAAABgAAAAA///gAAAP//////////////8AAAAAAAAAAAAAeAAAAAD///wAAAf//////////////AAAAAAAAAAAAAP4AAAAAP///wAAB//////////////gAAAAAAAAAAAAD/gAAAAA////gAAH/////////////4AAAAAACAAAAAAP+AAAAAP////gAAf////////////+AAAAAAf/AAAAAA/4AAAAP/////ggB/////////////gAAAAD///gAAAAD/gAAAD//////HgH////////////4AAAAf////gAAAAP+AAAAf///////wf////////////AAAD//////wAAAA/4AAAD////////x////////////+AAA///////wAAAD/gAAD8Bg//////3////////////+AAH///////AAAAP+AAA+AAB///////////////////8AB///////8AAAA/4AAPgAAB///////////////////8Af///////wAAAB////+AAAB///////////////////4D////////AAAAAAA//4AAAD///v///////////////4////////8AAAAAAD//gAAAH//+H///////////////3////////wAAAAAAP//AAAAH//4P///////////8//////////////8AAAA//8AAAAP//g/n//////////x//////////////wAAAD//wAAAAf/+D8f/////////+B///wH//B//////AAAAP//AAAAB//8Ph//////////8D///A/+AH/////8AAAA//8AAAAH//w+H+f//////7/wH//8H/gAf/////4AAAD//4AAAA///D4/4H/////8H/gH//z/yAB//////gAAAP//wAAAD////j/AH/////gH+AP+f//IAH/////+AAAA///AAAAB/////8AP////wAf8Af9//8AAf/////4AAAD//8AAAAH/////gAP///+AAfwAd3//gAB//////wAAAAP/4AAAB/////8AAf///wAB/AD///gAAH//////AAD/AQ/gAACP/////gAA///+AAH8Af//mAAAf/////8AAD8AB/AAAb/////+AAB///4AAfwH//4AAABf/////wAADwAB8AAH/44D//wAAH///gAB/Af//AAAAB//////gAAHAAH8AD/+AAD//AAAf//+AAH8D//8AAAAH7////+AAAEAAP////gAAAf4AAB///4AAfwf//wAAAA/H////4AAAAAA////8AAAAfwAAH///gAB/////gAAAH8f////gAAAAAD////gAAAB/AAAf//+AAH/////AAAAfh/////AAAAAAP////AAAAH+AAB///4AA/////+AAAH8GP///8AAAAAAH///8AAAAP8AAH///gAD/////+AAA/gYf///AAAAAAAH//9gAAAA/4AAf//+AAP//h//+AAH8Dh///wAAAAAAD//+AAAAAB/gAA///4AA+P+D//8AA/gcH//+AAAAAAAAf/AAAAAAD/AAAf//AAB8/4H//4Af8Bg///gAAAAAAAB/4AAAAAAP+AAB//4AAH//AP/////gAP//4AAAAAAAADAAAAAAAAf8AAH//gAAf/8A/////8AH//+AAAAAAAAAAAAAAAAAAP4AAf/+AAB//gB/////gB///gAAAAAAAAAAAAAAAAAA/gAB//wAAH/8AD////4A///4AAAAAAAAAAAAAAAAAAB8AAH//AAAP4AAH///8AH///AAAAAAAAAAAAAAAAAAABgAAf/8AAAeAAAf//8AB///wAAAAAAAAAAAAAAAAAAAAAAB//wAAAAAAA///wAf//8AAAAAAAAAAAAAAAAAAAAAAAH//AAAAAAAA////////AAAAAAAAAAAAAAAAAAAAAAAA//+AAAAAAAAf//////wAAAAAAAAAAAAAAAAAAAAAAAD//4AAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAAAP//gAAAAAAAAf/////AAAAAAAAAAAAAAAAAAAAAAAAA//+AAAAAAAAAP////4AAAAAAAAAAAAAAAAAAAAAAAAD//4AAAAAAAAAP///+AAAAAAAAAAAAAAAAAAAAAAAAAP//gAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAB//+AAAAAAAAAAP//4AAAAAAAAAAAAAAAAAAAMAAAAAH//4AAAAAAAAAAH/+AAAAAAAAAAAAAAAAAAAB4AAAAAP//gAAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAP/4AAAAA//+AAAAAHgAAAAD4AAAAAAAAAAAAAAAAAAH//4AAAAD//4AAAAB+AAAAACAAAAAAAAAAAAAAAAAAB///4AAAAP//gAAAAf+AAAAAAAAAAAAAAAAAAAAAAAAf///wAAAA///AAAAD/4AAAAAAAAAAAAAAAAAAAAAAAH////wAAAD///AAAA//wAAAAAAAAAAAAAAAAAAAAAAA//////8P///////////gAAAAAAAAAAAAAAAAAAAAAAD///////////////////gAAAAAAAAAAAAAAAAAAAAAAH//////////////////+AAAAAAAAAAAAAAAAAAAAAAAf//////////////////4AAAAAAAAAAAAAAAAAAAAAAAP//////////////////wAAAAAAAAAAAAAAAAAAAAAAD////////////v//////AAAAAAAAAAAAAAAAAAAAAAAf////wAAA///4AAAf//+AAAAAAAAAAAAAAAAAAAAAAD///////////////////8AAAAAAAAAAAAAAAAAAAAAAf///////////////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
var PRESENCE_MIN_INTERVAL=200;      // 이동 동기화 최소 간격
var PRESENCE_MOVE_EPS=0.04;           // 이만큼 움직여야 기록 (비용 절감)
var PRESENCE_HEARTBEAT=20000;
var PRESENCE_TTL=90000;
var EMBEDDED=window.DOKDO_EMBEDDED_ASSETS||{};

var ROOM_LIST=[
  {id:1,icon:"🗺️",name:"독도 지리관",desc:"독도의 위치, 동도와 서도, 지형과 기후를 살펴보는 전시관입니다.",color:"#157fa8",soft:"#e6f6fb",doorX:50.0,doorY:35.4,insideX:63.0,insideY:23.0},
  {id:2,icon:"📜",name:"독도 역사관",desc:"옛 기록과 지도, 안용복과 대한제국 칙령 등 독도의 역사를 만납니다.",color:"#84414b",soft:"#f8ecee",doorX:32.8,doorY:36.1,insideX:27.2,insideY:32.5},
  {id:3,icon:"🐟",name:"독도 생태관",desc:"괭이갈매기, 강치, 바닷속 생물과 독도의 자연환경을 탐구합니다.",color:"#176b9a",soft:"#e8f5fb",doorX:70.5,doorY:39.7,insideX:76.0,insideY:39.9},
  {id:4,icon:"💡",name:"독도 교육관",desc:"독도 수업 자료, 퀴즈, 발표 자료와 배움의 결과를 나눕니다.",color:"#3b8d6d",soft:"#eaf7f1",doorX:34.3,doorY:59.6,insideX:30.5,insideY:63.0},
  {id:5,icon:"💙",name:"독도 사랑관",desc:"독도 사랑 작품, 실천 아이디어와 우리의 행동 선언을 전시합니다.",color:"#c45368",soft:"#fceef1",doorX:64.2,doorY:62.0,insideX:70.1,insideY:65.6}
];
var TYPE_LIST=["조사자료","영상","포스터","발표자료","행동선언","글쓰기","기타"];
var TYPE_ICON={"조사자료":"🔎","영상":"🎬","포스터":"🖼️","발표자료":"📊","행동선언":"📣","글쓰기":"✍️","기타":"📎"};
var FACE_NAMES=["환한 미소","차분한 미소","햇살 윙크","반짝 눈빛","주근깨 미소","눈웃음","호기심 표정","활짝 웃음"];
var HAIR_NAMES=["사이드 숏","단정 보브","트윈 번","웨이브 롱","내추럴 픽시","곱슬 보브","하이 포니","양갈래 땋은 머리","스파이크 숏","긴 생머리","하프업 번","소프트 울프컷"];
var OUTFIT_NAMES=["박물관 정장","교복 스커트","울림 체육복","독도 축구복","독도 도슨트","해양 연구원","섬 탐험 우비","바다 한복","민트 캐주얼","미술 동아리","생태 탐사대","파도 스포츠"];
var ACCESSORY_NAMES=["장식 없음","동그란 안경","민트 안경","파도 머리띠","박물관 모자","산호 비니","화가 베레모","동백꽃 핀","괭이갈매기 날개"];
var HAIR_COLORS=[
  {name:"검정",rgb:[46,42,58]},{name:"갈색",rgb:[120,82,58]},{name:"밤색",rgb:[184,104,78]},{name:"금발",rgb:[236,199,104]},
  {name:"바다 파랑",rgb:[56,128,196]},{name:"민트",rgb:[54,184,160]},{name:"분홍",rgb:[228,113,170]},{name:"보라",rgb:[128,101,208]},
  {name:"은빛",rgb:[204,210,224]},{name:"주황",rgb:[230,126,58]},{name:"숲 초록",rgb:[71,139,91]},{name:"남색",rgb:[38,68,118]}
];
var DEFAULT_AVATAR={face:0,hair:0,hairColor:0,outfit:0,accessory:0};
var FACE_COUNT=8, HAIR_COUNT=12, OUTFIT_COUNT=12, ACCESSORY_COUNT=9;
var EXPOSED_LEG_OUTFITS={1:[180,14],3:[177,15],7:[181,11],10:[174,10],11:[171,12]};
var SKIN_TONES=[[252,199,169],[251,187,142],[232,151,91],[223,142,91],[252,197,173],[212,135,81],[210,132,79],[194,111,65]];
var AVATAR_PRESETS=[
  {name:"도슨트",face:0,hair:0,hairColor:0,outfit:4,accessory:4},
  {name:"연구원",face:1,hair:5,hairColor:4,outfit:5,accessory:1},
  {name:"탐험대",face:2,hair:6,hairColor:1,outfit:6,accessory:5},
  {name:"예술가",face:4,hair:9,hairColor:6,outfit:9,accessory:6},
  {name:"생태대",face:6,hair:10,hairColor:9,outfit:10,accessory:7},
  {name:"응원단",face:7,hair:11,hairColor:4,outfit:11,accessory:8}
];
var WORLD_FRAME_SLOTS={
  1:[{x:37.5,y:13.8,w:4.1,roll:-2,yaw:11,pitch:-4,depth:.78},{x:40.7,y:15.1,w:4.2,roll:-1,yaw:8,pitch:-4,depth:.81},
     {x:67.3,y:12.7,w:4.2,roll:1,yaw:-9,pitch:-4,depth:.79},{x:70.5,y:14.6,w:4.3,roll:2,yaw:-12,pitch:-4,depth:.82},{x:72.4,y:18.1,w:4.4,roll:3,yaw:-14,pitch:-5,depth:.84}],
  2:[{x:7.0,y:15.3,w:4.1,roll:-4,yaw:8,pitch:-5,depth:.77},{x:11.6,y:13.6,w:4.2,roll:-4,yaw:7,pitch:-5,depth:.79},
     {x:16.1,y:12.0,w:4.25,roll:-4,yaw:6,pitch:-5,depth:.81},{x:20.7,y:10.7,w:4.3,roll:-4,yaw:5,pitch:-5,depth:.82},{x:25.4,y:10.1,w:4.35,roll:-3,yaw:3,pitch:-5,depth:.83}],
  3:[{x:76.5,y:23.4,w:4.2,roll:4,yaw:-14,pitch:-4,depth:.78},{x:81.0,y:24.6,w:4.3,roll:4,yaw:-13,pitch:-4,depth:.8},
     {x:85.5,y:26.0,w:4.35,roll:4,yaw:-12,pitch:-4,depth:.82},{x:90.1,y:27.5,w:4.4,roll:4,yaw:-11,pitch:-4,depth:.84},{x:94.5,y:29.0,w:4.45,roll:4,yaw:-10,pitch:-4,depth:.86}],
  4:[{x:7.5,y:51.1,w:4.25,roll:-4,yaw:9,pitch:-4,depth:.82},{x:12.0,y:49.6,w:4.35,roll:-4,yaw:8,pitch:-4,depth:.84},
     {x:16.5,y:48.2,w:4.4,roll:-4,yaw:7,pitch:-4,depth:.86},{x:21.0,y:46.9,w:4.5,roll:-3,yaw:6,pitch:-4,depth:.88},{x:25.5,y:47.2,w:4.55,roll:-2,yaw:4,pitch:-4,depth:.9}],
  5:[{x:74.2,y:53.6,w:4.35,roll:4,yaw:-12,pitch:-4,depth:.83},{x:78.7,y:54.8,w:4.45,roll:4,yaw:-11,pitch:-4,depth:.85},
     {x:83.2,y:56.1,w:4.5,roll:4,yaw:-10,pitch:-4,depth:.87},{x:87.8,y:57.5,w:4.6,roll:4,yaw:-9,pitch:-4,depth:.89},{x:92.4,y:59.0,w:4.65,roll:4,yaw:-8,pitch:-4,depth:.91}]
};
var DEFAULT_SETTINGS={museumTitle:"독도울림박물관"};
var SAMPLE_EXHIBITS=[
  {id:"sample-location",roomId:1,title:"독도는 어디에 있을까?",author:"박물관 안내",group:"예시",type:"조사자료",desc:"대한민국에서 독도까지의 위치와 동도·서도의 모습을 지도와 함께 살펴보는 안내 전시입니다.",link:"",fileUrl:"",fileName:"",fileType:"",fileSize:0,storagePath:"",fileId:"",featured:true,published:true,ownerUid:"sample",studentId:"",sample:true,createdAtMs:1770000000000},
  {id:"sample-history",roomId:2,title:"기록 속의 우리 땅 독도",author:"박물관 안내",group:"예시",type:"조사자료",desc:"옛 지도와 문헌에 나타난 독도의 이름과 우리 조상들의 활동을 알아봅니다.",link:"",fileUrl:"",fileName:"",fileType:"",fileSize:0,storagePath:"",fileId:"",featured:true,published:true,ownerUid:"sample",studentId:"",sample:true,createdAtMs:1770000001000},
  {id:"sample-action",roomId:5,title:"우리의 독도 사랑 행동 선언",author:"박물관 안내",group:"예시",type:"행동선언",desc:"배운 것을 생활 속 실천으로 이어 가는 우리 반의 독도 사랑 행동을 전시해 보세요.",link:"",fileUrl:"",fileName:"",fileType:"",fileSize:0,storagePath:"",fileId:"",featured:false,published:true,ownerUid:"sample",studentId:"",sample:true,createdAtMs:1770000002000}
];

/* ══════════ 상태 ══════════ */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var local=loadLocalData();
var state={
  settings:Object.assign({},DEFAULT_SETTINGS,local.settings||{}),
  exhibits:Array.isArray(local.exhibits)?local.exhibits:[],
  students:Array.isArray(local.students)?local.students:[],
  messages:Array.isArray(local.messages)?local.messages:[],
  presence:[]
};
var profile=loadProfile();
var cloud={ready:false,db:null,storage:null,uid:"",email:"",museumRef:null,unsubs:[],error:""};
var isTeacher=false;
var currentRoomId=1, modalState=null, nearestRoom=null, guidedRoomId=0;
var toastTimer=0, presenceTimer=0, heartbeatTimer=0, lastPresenceWrite=0, lastPresencePos={x:-99,y:-99};
var lastBumpAt=0;
var SESSION_ID="tab-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,12);
var presenceRef=null, presenceConnected=false, presenceDisconnect=null, serverOffset=0;
var presenceUnsubs=[], presenceGeneration=0, presencePaused=false;
var OWN_UIDS=new Set();
var chatBubbles=new Map(), chatSeenIds=new Set(), chatEnteredAt=Date.now(), chatDeleteBusy=false;
var CHAT_BUBBLE_MS=5000;

var overlay=$("#overlay"), avatarEl=$("#avatar"), avatarBody=$("#avatarBody"),
    world=$("#world"), worldShell=$("#worldShell"), viewport=$("#museumViewport"),
    remoteLayer=$("#remoteAvatars");

/* ══════════ 충돌 마스크 ══════════ */
var MASK=(function(){
  var bin=atob(MASK_B64), bytes=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  return bytes;
})();
function maskAt(gx,gy){
  if(gx<0||gy<0||gx>=MASK_W||gy>=MASK_H)return false;
  var idx=gy*MASK_W+gx;
  return (MASK[idx>>3]>>(7-(idx&7)))&1;
}
function walkPoint(x,y){
  return maskAt(Math.floor(x/100*MASK_W),Math.floor(y/100*MASK_H));
}
/* 캐릭터 발 주변 타원 샘플 — 벽에 파고들지 않게 */
var BODY_RX=0.72, BODY_RY=0.85;
function bodyFits(x,y){
  if(x<0.6||x>99.4||y<1.5||y>98.5)return false;
  return walkPoint(x,y)&&walkPoint(x-BODY_RX,y)&&walkPoint(x+BODY_RX,y)&&
         walkPoint(x,y+BODY_RY*.55)&&walkPoint(x,y-BODY_RY*.55)&&
         walkPoint(x-BODY_RX*.72,y+BODY_RY*.45)&&walkPoint(x+BODY_RX*.72,y+BODY_RY*.45);
}
/* 길찾기용 여유 격자 (캐릭터 반경만큼 침식) */
var PASS=(function(){
  var p=new Uint8Array(MASK_W*MASK_H), ex=2, ey=1;
  for(var gy=0;gy<MASK_H;gy++)for(var gx=0;gx<MASK_W;gx++){
    var ok=1;
    for(var dy=-ey;dy<=ey&&ok;dy++)for(var dx=-ex;dx<=ex;dx++)if(!maskAt(gx+dx,gy+dy)){ok=0;break}
    p[gy*MASK_W+gx]=ok;
  }
  return p;
})();
function nearestPassable(gx,gy){
  if(PASS[gy*MASK_W+gx])return [gx,gy];
  for(var r=1;r<=18;r++){
    for(var dy=-r;dy<=r;dy++)for(var dx=-r;dx<=r;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
      var nx=gx+dx, ny=gy+dy;
      if(nx>=0&&ny>=0&&nx<MASK_W&&ny<MASK_H&&PASS[ny*MASK_W+nx])return [nx,ny];
    }
  }
  return null;
}
/* BFS 경로 탐색 + 직선 단축 */
var bfsPrev=new Int32Array(MASK_W*MASK_H);
function findPath(sx,sy,tx,ty){
  var s=nearestPassable(Math.floor(sx/100*MASK_W),Math.floor(sy/100*MASK_H));
  var t=nearestPassable(Math.floor(tx/100*MASK_W),Math.floor(ty/100*MASK_H));
  if(!s||!t)return null;
  var start=s[1]*MASK_W+s[0], goal=t[1]*MASK_W+t[0];
  if(start===goal)return [{x:tx,y:ty}];
  bfsPrev.fill(-1);
  var q=new Int32Array(MASK_W*MASK_H), head=0, tail=0;
  q[tail++]=start; bfsPrev[start]=start;
  var found=false;
  var DX=[1,-1,0,0,1,1,-1,-1], DY=[0,0,1,-1,1,-1,1,-1];
  while(head<tail){
    var cur=q[head++];
    if(cur===goal){found=true;break}
    var cx=cur%MASK_W, cy=(cur-cx)/MASK_W;
    for(var i=0;i<8;i++){
      var nx=cx+DX[i], ny=cy+DY[i];
      if(nx<0||ny<0||nx>=MASK_W||ny>=MASK_H)continue;
      var ni=ny*MASK_W+nx;
      if(bfsPrev[ni]!==-1||!PASS[ni])continue;
      if(i>3&&(!PASS[cy*MASK_W+nx]||!PASS[ny*MASK_W+cx]))continue;   // 모서리 통과 금지
      bfsPrev[ni]=cur; q[tail++]=ni;
    }
  }
  if(!found)return null;
  var pts=[], node=goal, guard=0;
  while(node!==start&&guard++<MASK_W*MASK_H){
    var px=node%MASK_W, py=(node-px)/MASK_W;
    pts.push({x:(px+.5)/MASK_W*100,y:(py+.5)/MASK_H*100});
    node=bfsPrev[node];
  }
  pts.reverse();
  pts.push({x:tx,y:ty});
  return smoothPath(sx,sy,pts);
}
function clearLine(ax,ay,bx,by){
  var steps=Math.ceil(Math.max(Math.abs(bx-ax)/0.3,Math.abs(by-ay)/0.5));
  for(var i=1;i<=steps;i++){
    var t=i/steps;
    if(!bodyFits(ax+(bx-ax)*t,ay+(by-ay)*t))return false;
  }
  return true;
}
function smoothPath(sx,sy,pts){
  var out=[], cx=sx, cy=sy, i=0;
  while(i<pts.length){
    var best=i;
    for(var j=pts.length-1;j>i;j--){
      if(clearLine(cx,cy,pts[j].x,pts[j].y)){best=j;break}
    }
    out.push(pts[best]); cx=pts[best].x; cy=pts[best].y; i=best+1;
  }
  return out;
}

/* ══════════ 아바타 합성 (아틀라스 → 캔버스 → data URL) ══════════ */
var ATLAS_COLS=12, ATLAS_ROWS=4, CELL_W=160, CELL_H=224, HAIR_BASE=0.72;
var atlasImg=new Image(), atlasReady=false, canComposite=true;
var spriteCache=new Map(), spriteWaiters=[];
atlasImg.onload=function(){atlasReady=true;spriteCache.clear();spriteWaiters.splice(0).forEach(function(fn){fn()})};
atlasImg.onerror=function(){canComposite=false;atlasReady=true;spriteWaiters.splice(0).forEach(function(fn){fn()})};
atlasImg.src=assetUrl("assets/avatar-atlas.png");

function normalizeAvatar(v){
  if(typeof v==="number"||typeof v==="string"){
    var n=Math.max(0,Math.floor(Number(v)||0));
    return {face:n%FACE_COUNT,hair:n%HAIR_COUNT,hairColor:n%HAIR_COLORS.length,outfit:n%OUTFIT_COUNT,accessory:n%ACCESSORY_COUNT};
  }
  v=v&&typeof v==="object"?v:{};
  var ci=function(a,len){return Math.max(0,Math.min(len-1,Math.floor(Number(a)||0)))};
  return {face:ci(v.face,FACE_COUNT),hair:ci(v.hair,HAIR_COUNT),hairColor:ci(v.hairColor,HAIR_COLORS.length),outfit:ci(v.outfit,OUTFIT_COUNT),accessory:ci(v.accessory,ACCESSORY_COUNT)};
}
function avatarKey(c){return c.face+"|"+c.hair+"|"+c.hairColor+"|"+c.outfit+"|"+c.accessory}
function drawCell(ctx,col,row){ctx.drawImage(atlasImg,col*CELL_W,row*CELL_H,CELL_W,CELL_H,0,0,CELL_W,CELL_H)}
function drawFaceRegion(ctx,face,x,y,w,h){ctx.drawImage(atlasImg,face*CELL_W+x,y,w,h,x,y,w,h)}
function paintOutfitSkin(ctx,cfg){
  var rgb=SKIN_TONES[cfg.face]||SKIN_TONES[0];
  ctx.fillStyle="rgb("+rgb.join(",")+")";
  ctx.beginPath();ctx.ellipse(18,157,7.2,8.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(142,157,7.2,8.2,0,0,Math.PI*2);ctx.fill();
  var legPatch=EXPOSED_LEG_OUTFITS[cfg.outfit];
  if(legPatch){
    ctx.fillRect(60,legPatch[0],13,legPatch[1]);
    ctx.fillRect(87,legPatch[0],13,legPatch[1]);
  }
}
function spriteUrl(cfgRaw){
  var cfg=normalizeAvatar(cfgRaw), key=avatarKey(cfg);
  if(spriteCache.has(key))return spriteCache.get(key);
  if(!atlasReady||!canComposite)return "";
  var url="";
  try{
    var cv=document.createElement("canvas"); cv.width=CELL_W; cv.height=CELL_H;
    var ctx=cv.getContext("2d"); ctx.imageSmoothingEnabled=false;
    drawCell(ctx,cfg.face,0);                  // 얼굴·몸 기준
    drawCell(ctx,cfg.outfit,2);                // 옷
    // 옷의 손·다리를 선택한 얼굴 피부톤으로 덮고 얼굴 부분을 다시 그립니다.
    paintOutfitSkin(ctx,cfg);
    drawFaceRegion(ctx,cfg.face,0,0,CELL_W,132);
    // 머리: 명도맵에 색을 곱해 음영을 살린 채로 착색
    var hc=document.createElement("canvas"); hc.width=CELL_W; hc.height=CELL_H;
    var hx=hc.getContext("2d"); hx.imageSmoothingEnabled=false;
    hx.drawImage(atlasImg,cfg.hair*CELL_W,1*CELL_H,CELL_W,CELL_H,0,0,CELL_W,CELL_H);
    var rgb=HAIR_COLORS[cfg.hairColor].rgb, boost=1/HAIR_BASE;
    hx.globalCompositeOperation="multiply";
    hx.fillStyle="rgb("+Math.min(255,Math.round(rgb[0]*boost))+","+Math.min(255,Math.round(rgb[1]*boost))+","+Math.min(255,Math.round(rgb[2]*boost))+")";
    hx.fillRect(0,0,CELL_W,CELL_H);
    hx.globalCompositeOperation="destination-in";
    hx.drawImage(atlasImg,cfg.hair*CELL_W,1*CELL_H,CELL_W,CELL_H,0,0,CELL_W,CELL_H);
    hx.globalCompositeOperation="source-over";
    ctx.drawImage(hc,0,0);
    drawCell(ctx,cfg.accessory,3);
    url=cv.toDataURL("image/png");
  }catch(err){canComposite=false;url=""}
  if(url){
    if(spriteCache.size>320)spriteCache.clear();
    spriteCache.set(key,url);
  }
  return url;
}
/* 캔버스를 못 쓰는 환경(file:// 등) 대비 — 아틀라스를 배경 위치로 직접 사용 */
function fallbackLayers(cfgRaw){
  var c=normalizeAvatar(cfgRaw);
  var bg=assetUrl("assets/avatar-atlas.png");
  var cellPos=function(col,row){
    return "background-image:url("+bg+");background-size:"+(ATLAS_COLS*100)+"% "+(ATLAS_ROWS*100)+"%;"+
      "background-position:"+(col/(ATLAS_COLS-1)*100)+"% "+(row/(ATLAS_ROWS-1)*100)+"%;";
  };
  var hf=HAIR_COLORS[c.hairColor].rgb;
  return '<span class="rig-part" style="'+cellPos(c.face,0)+'"></span>'+
         '<span class="rig-part" style="'+cellPos(c.outfit,2)+'"></span>'+
         '<span class="rig-part" style="'+cellPos(c.hair,1)+
           'filter:brightness(0) saturate(100%) drop-shadow(0 0 0 rgb('+hf[0]+','+hf[1]+','+hf[2]+'));opacity:.95"></span>'+
         '<span class="rig-part" style="'+cellPos(c.accessory,3)+'"></span>';
}
function rigHtml(cfg,full){
  var url=spriteUrl(cfg);
  if(!url)return '<span class="rig-flip"><span class="rig">'+fallbackLayers(cfg)+'</span></span>';
  var style='--sprite:url('+url+')';
  if(full){
    return '<span class="rig-flip"><span class="rig">'+
      '<span class="rig-part rig-leg-l" style="'+style+'"></span>'+
      '<span class="rig-part rig-leg-r" style="'+style+'"></span>'+
      '<span class="rig-part rig-torso" style="'+style+'"></span>'+
    '</span></span>';
  }
  return '<span class="rig-flip"><span class="rig"><span class="rig-part rig-full" style="'+style+'"></span></span></span>';
}
function spriteBg(cfg){
  var url=spriteUrl(cfg);
  return url?"background-image:url("+url+")":"";
}

/* ══════════ 이동 물리 ══════════ */
var SPEED=340;          // 맵 픽셀/초
var ISO_Y=0.62;         // 세로 이동 압축(아이소메트릭 느낌)
var SX=SPEED/MAP_W*100; // 가로 최고속도(%/초)
var SY=SPEED*ISO_Y/MAP_H*100;
var pos={x:Number(profile.x)||50,y:Number(profile.y)||86};
if(!bodyFits(pos.x,pos.y))pos={x:50,y:86};
var vel={x:0,y:0};
var keyInput={x:0,y:0}, stickInput={x:0,y:0};
var path=null, pathIndex=0;
var facing=/^(up|down|left|right)$/.test(profile.facing||"")?profile.facing:"down";
var zoom=1, cam={x:0,y:0}, camTarget={x:0,y:0};
var keysDown={};
var rects={shell:null,view:null};
var lastFrame=0, walking=false;

function refreshRects(){
  rects.shell=worldShell.getBoundingClientRect();
  rects.view=viewport.getBoundingClientRect();
}
function pctToVel(ix,iy){return {x:ix*SX, y:iy*SY}}
function setFacing(dx,dy){
  var f=facing;
  if(Math.abs(dx)*1.6>Math.abs(dy))f=dx<0?"left":"right";
  else if(Math.abs(dy)>0.0001)f=dy<0?"up":"down";
  if(f===facing)return;
  facing=f; profile.facing=f;
  avatarEl.classList.remove("facing-up","facing-down","facing-left","facing-right");
  avatarEl.classList.add("facing-"+f);
  var flip=$(".rig-flip",avatarBody);
  if(flip)flip.style.setProperty("--flip",f==="left"?-1:1);
}
function bump(){
  if(Date.now()-lastBumpAt<420)return;
  lastBumpAt=Date.now();
  avatarEl.classList.remove("bump"); void avatarEl.offsetWidth; avatarEl.classList.add("bump");
  setTimeout(function(){avatarEl.classList.remove("bump")},220);
}
function currentInput(){
  var ix=keyInput.x+stickInput.x, iy=keyInput.y+stickInput.y;
  if(ix||iy){path=null;guidedRoomId=0;return {x:ix,y:iy}}
  if(path&&pathIndex<path.length){
    var t=path[pathIndex];
    var dx=t.x-pos.x, dy=t.y-pos.y;
    if(Math.hypot(dx*MAP_W/100,dy*MAP_H/100)<11){pathIndex++;return currentInput()}
    // 화면상 목표 방향과 실제 속도 방향이 일치하도록 축 속도를 반영해 보정
    var ax=dx*SY, ay=dy*SX, n=Math.hypot(ax,ay)||1;
    return {x:ax/n, y:ay/n};
  }
  path=null;
  return {x:0,y:0};
}
function stepPhysics(dt){
  var inp=currentInput();
  var len=Math.hypot(inp.x,inp.y);
  if(len>1){inp.x/=len;inp.y/=len}
  var target=pctToVel(inp.x,inp.y);
  var k=1-Math.pow(0.0018,dt);
  vel.x+=(target.x-vel.x)*k;
  vel.y+=(target.y-vel.y)*k;

  var moveX=vel.x*dt, moveY=vel.y*dt;
  var steps=Math.max(1,Math.ceil(Math.max(Math.abs(moveX)/0.3,Math.abs(moveY)/0.5)));
  var blocked=false, moved=0;
  for(var i=0;i<steps;i++){
    var sx=moveX/steps, sy=moveY/steps;
    if(sx&&bodyFits(pos.x+sx,pos.y)){pos.x+=sx;moved+=Math.abs(sx)}
    else if(sx){vel.x=0;blocked=true}
    if(sy&&bodyFits(pos.x,pos.y+sy)){pos.y+=sy;moved+=Math.abs(sy)}
    else if(sy){vel.y=0;blocked=true}
  }
  if(blocked&&(Math.abs(inp.x)>.05||Math.abs(inp.y)>.05)){
    bump();
    if(path){path=null;guidedRoomId=0}
  }

  var speedNow=Math.hypot(vel.x*MAP_W/100,vel.y*MAP_H/100);
  var isWalking=speedNow>18;
  if(isWalking!==walking){
    walking=isWalking;
    avatarEl.classList.toggle("walking",walking);
  }
  if(walking){
    setFacing(vel.x,vel.y);
    var dur=Math.max(.30,Math.min(.62,150/speedNow));
    avatarEl.style.setProperty("--step",dur.toFixed(2)+"s");
    var flip=$(".rig-flip",avatarBody);
    if(flip){
      var lean=Math.max(-4,Math.min(4,vel.x*MAP_W/100/22));
      flip.style.setProperty("--lean",(facing==="left"?-lean:lean).toFixed(1)+"deg");
    }
  }
  return moved>0;
}
function updateCamera(dt){
  if(!rects.shell||!rects.view)refreshRects();
  var sw=rects.shell.width*zoom, sh=rects.shell.height*zoom;
  var maxX=Math.max(0,(sw-rects.view.width)/2), maxY=Math.max(0,(sh-rects.view.height)/2);
  camTarget.x=Math.max(-maxX,Math.min(maxX,(50-pos.x)/100*rects.shell.width*zoom));
  camTarget.y=Math.max(-maxY,Math.min(maxY,(50-pos.y)/100*rects.shell.height*zoom));
  var k=dt?1-Math.pow(0.004,dt):1;
  cam.x+=(camTarget.x-cam.x)*k;
  cam.y+=(camTarget.y-cam.y)*k;
  world.style.transform="translate3d("+cam.x.toFixed(2)+"px,"+cam.y.toFixed(2)+"px,0) scale("+zoom+")";
}
var AV_W=74, AV_H=104;
function worldPx(x,y){
  var w=(rects.shell&&rects.shell.width)||1200, h=(rects.shell&&rects.shell.height)||675;
  return {x:x/100*w-AV_W/2, y:y/100*h-AV_H*0.88};
}
function placeAvatar(){
  var p=worldPx(pos.x,pos.y);
  avatarEl.style.transform="translate3d("+p.x.toFixed(1)+"px,"+p.y.toFixed(1)+"px,0)";
}

var remoteNodes=new Map();
function tickRemote(dt){
  remoteNodes.forEach(function(node){
    var k=1-Math.pow(0.02,dt);
    node.cx+=(node.tx-node.cx)*k;
    node.cy+=(node.ty-node.cy)*k;
    var moving=Math.hypot((node.tx-node.cx)*MAP_W/100,(node.ty-node.cy)*MAP_H/100)>4;
    if(moving!==node.moving){node.moving=moving;node.el.classList.toggle("walking",moving)}
    var q=worldPx(node.cx,node.cy);
    node.el.style.transform="translate3d("+q.x.toFixed(1)+"px,"+q.y.toFixed(1)+"px,0)";
  });
}
function loop(ts){
  var dt=lastFrame?Math.min(.05,(ts-lastFrame)/1000):0.016;
  lastFrame=ts;
  var moved=stepPhysics(dt);
  placeAvatar();
  updateCamera(dt);
  tickRemote(dt);
  checkNearestRoom();
  if(moved){profile.x=pos.x;profile.y=pos.y;maybeWritePresence()}
  requestAnimationFrame(loop);
}

function checkNearestRoom(){
  /* 자동 안내는 문 앞이 아니라 실제 실내 바닥에 도착한 뒤 전시 목록을 연다. */
  if(guidedRoomId&&!path){
    var guided=roomById(guidedRoomId);
    if(guided){
      var gx=Number(guided.insideX)||guided.doorX, gy=Number(guided.insideY)||guided.doorY;
      var gd=Math.hypot((pos.x-gx)*MAP_W/100,(pos.y-gy)*MAP_H/100);
      if(gd<70){
        guidedRoomId=0;
        showRoom(guided.id);
        return;
      }
    }
  }
  var closest=null, best=Infinity;
  ROOM_LIST.forEach(function(room){
    var d=Math.hypot((pos.x-room.doorX)*MAP_W/100,(pos.y-room.doorY)*MAP_H/100);
    if(d<best){best=d;closest=room}
  });
  var next=best<150?closest:null;
  if((next&&next.id)===(nearestRoom&&nearestRoom.id)){
    if(next&&guidedRoomId===next.id&&!path){
      var sameArrival=guidedRoomId;
      guidedRoomId=0;
      showRoom(sameArrival);
    }
    return;
  }
  nearestRoom=next;
  $$(".portal,.zone-label").forEach(function(el){
    el.classList.toggle("near",!!(nearestRoom&&Number(el.dataset.room)===nearestRoom.id));
  });
  var prompt=$("#interaction");
  if(nearestRoom){$("#interactionTitle").textContent=nearestRoom.name+" 입장";prompt.classList.remove("hidden")}
  else prompt.classList.add("hidden");
  if(nearestRoom&&guidedRoomId===nearestRoom.id&&!path){
    var arrived=guidedRoomId;
    guidedRoomId=0;
    showRoom(arrived);
  }
}
function walkTo(x,y){
  var p=findPath(pos.x,pos.y,x,y);
  if(!p||!p.length){toast("그곳으로는 갈 수 없어요.");return false}
  path=p; pathIndex=0;
  var m=document.createElement("span");
  m.className="click-marker";
  m.style.left=x+"%"; m.style.top=y+"%";
  world.appendChild(m);
  setTimeout(function(){m.remove()},560);
  return true;
}
function guideToRoom(roomId){
  var room=roomById(roomId);
  if(!room)return;
  closeModal();
  guidedRoomId=room.id;
  var tx=Number(room.insideX)||room.doorX, ty=Number(room.insideY)||room.doorY;
  if(walkTo(tx,ty))toast(room.icon+" 입구를 지나 "+room.name+" 안까지 안내할게요.");
  else guidedRoomId=0;
}
function setZoom(next){
  zoom=Math.max(.65,Math.min(1.55,next));
  refreshRects(); updateCamera(0);
  toast(Math.round(zoom*100)+"%");
}
function recenter(){
  if(bodyFits(50,86))pos={x:50,y:86};
  vel={x:0,y:0}; path=null; guidedRoomId=0; zoom=1;
  refreshRects(); updateCamera(0);
  saveProfileLocal(); schedulePresence(true);
}

/* ══════════ 유틸 ══════════ */
function esc(v){return String(v==null?"":v).replace(/[&<>'"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]})}
function assetUrl(p){return EMBEDDED[p]||p}
function safeUrl(v){try{var u=new URL(String(v||""),location.href);return /^(https?:|blob:|data:image\/)/.test(u.protocol)?u.href:""}catch(e){return ""}}
function uid(p){return (p||"id")+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-5)}
function roomById(id){return ROOM_LIST.find(function(r){return r.id===Number(id)})}
function exhibitById(id){return visibleExhibits().find(function(i){return String(i.id)===String(id)})}
function visibleExhibits(){return state.exhibits.length?state.exhibits:SAMPLE_EXHIBITS}
function normalizeGroup(v){var m=String(v||"").match(/([1-6])/);return m?m[1]:""}
function timeText(ms){if(!ms)return "";try{return new Date(Number(ms)).toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})}catch(e){return ""}}
function formatBytes(v){var n=Number(v)||0;if(!n)return "";var u=["B","KB","MB","GB"],i=0;while(n>=1024&&i<u.length-1){n/=1024;i++}return n.toFixed(n<10&&i>0?1:0)+u[i]}
function sanitizeId(v){return String(v||"").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,60)||uid("id-")}
function toast(msg){
  var el=$("#toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){el.classList.remove("show")},2100);
}
function setSyncStatus(kind,text,err){
  var el=$("#syncBadge");
  el.className="sync-badge"+(kind?" "+kind:"");
  el.textContent=text;
  cloud.error=err?(err.message||String(err)):"";
}
function loadLocalData(){try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||"{}")||{}}catch(e){return {}}}
function saveLocalData(){
  try{localStorage.setItem(LOCAL_KEY,JSON.stringify({
    settings:state.settings,
    exhibits:state.exhibits.slice(0,220),
    students:state.students.slice(0,220),
    messages:state.messages.slice(0,40)
  }))}catch(e){}
}
function loadProfile(){
  try{var p=JSON.parse(localStorage.getItem(PROFILE_KEY)||"{}")||{};p.avatar=p.avatar||DEFAULT_AVATAR;return p}
  catch(e){return {avatar:DEFAULT_AVATAR}}
}
function saveProfileLocal(){
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify({
    name:profile.name||"",group:profile.group||"",studentId:profile.studentId||"",
    avatar:normalizeAvatar(profile.avatar),x:pos.x,y:pos.y,facing:facing
  }))}catch(e){}
}
/* 오프라인 첨부 보관 */
function openFileDB(){
  return new Promise(function(res,rej){
    var req=indexedDB.open(FILE_DB,1);
    req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains(FILE_STORE))req.result.createObjectStore(FILE_STORE)};
    req.onsuccess=function(){res(req.result)};
    req.onerror=function(){rej(req.error)};
  });
}
async function putStoredFile(id,file){
  var db=await openFileDB();
  return new Promise(function(res,rej){
    var tx=db.transaction(FILE_STORE,"readwrite");
    tx.objectStore(FILE_STORE).put(file,id);
    tx.oncomplete=function(){res(id)}; tx.onerror=function(){rej(tx.error)};
  });
}
async function getStoredFile(id){
  try{
    var db=await openFileDB();
    return await new Promise(function(res,rej){
      var tx=db.transaction(FILE_STORE,"readonly");
      var r=tx.objectStore(FILE_STORE).get(id);
      r.onsuccess=function(){res(r.result||null)}; r.onerror=function(){rej(r.error)};
    });
  }catch(e){return null}
}
async function removeStoredFile(id){
  if(!id)return;
  try{
    var db=await openFileDB();
    var tx=db.transaction(FILE_STORE,"readwrite");
    tx.objectStore(FILE_STORE).delete(id);
  }catch(e){}
}

/* ══════════ 렌더링 ══════════ */
function refresh(updateWorld){
  $("#museumTitle").textContent=state.settings.museumTitle||DEFAULT_SETTINGS.museumTitle;
  document.title=state.settings.museumTitle||DEFAULT_SETTINGS.museumTitle;
  var list=visibleExhibits();
  ROOM_LIST.forEach(function(room){
    var n=list.filter(function(i){return Number(i.roomId)===room.id&&i.published!==false}).length;
    $$('[data-room-count="'+room.id+'"]').forEach(function(el){el.textContent=n});
  });
  updateProfileUI();
  renderPresence();
  renderChat();
  if(updateWorld!==false)renderWorldExhibits();
}
var myRigKey="";
function updateProfileUI(){
  $("#avatarName").textContent=profile.name||"방문자";
  var key=avatarKey(normalizeAvatar(profile.avatar))+"|"+(spriteUrl(profile.avatar)?"c":"f");
  if(key!==myRigKey){
    myRigKey=key;
    avatarBody.innerHTML=rigHtml(profile.avatar,true);
  }
  var flip=$(".rig-flip",avatarBody);
  if(flip)flip.style.setProperty("--flip",facing==="left"?-1:1);
  avatarEl.classList.remove("facing-up","facing-down","facing-left","facing-right");
  avatarEl.classList.add("facing-"+facing);
  var mini=$("#profileMini");
  var bg=spriteBg(profile.avatar);
  mini.setAttribute("style",bg||"background:#dbe7ed;border-radius:6px");
  $("#teacherBtn").classList.toggle("on",isTeacher);
  $("#teacherBtn").querySelector(".label").textContent=isTeacher?"관리":"교사";
  renderChat();
}
function activePresence(){
  var now=Date.now()+serverOffset;
  var seenUid=new Set(), rows=[];
  state.presence.forEach(function(p){
    if(!p||!p.name||now-(Number(p.lastSeenMs)||0)>=PRESENCE_TTL)return;
    // 익명 계정을 교사 계정으로 전환하면 이전 UID 문서가 잠시 남을 수 있습니다.
    // 같은 탭의 세션 또는 이 탭이 사용했던 UID는 내 분신으로 그리지 않습니다.
    if((p.sessionId&&p.sessionId===SESSION_ID&&p.uid!==cloud.uid)||
       (profile.studentId&&p.studentId===profile.studentId&&p.uid!==cloud.uid)||
       (OWN_UIDS.has(p.uid)&&p.uid!==cloud.uid))return;
    if(seenUid.has(p.uid))return;
    seenUid.add(p.uid); rows.push(p);
  });
  if(!rows.some(function(p){return p.uid===cloud.uid})&&profile.name){
    rows.push({uid:cloud.uid||"me",sessionId:SESSION_ID,name:profile.name,group:profile.group,avatar:profile.avatar,x:pos.x,y:pos.y,lastSeenMs:now});
  }
  return rows;
}
function renderPresence(){
  var rows=activePresence();
  $("#onlineCount").textContent=String(Math.max(1,rows.length));
  var listEl=$("#onlineList");
  listEl.innerHTML=rows.map(function(p){
    var bg=spriteBg(p.avatar);
    return '<div class="online-row"><span class="mini" style="'+(bg||"background:#e3ecf1;border-radius:5px")+'"></span>'+
      '<span>'+esc(p.name)+(p.group?' <small style="color:#7b8f9b">'+esc(p.group)+'모둠</small>':'')+
      (p.uid===cloud.uid?' <small style="color:#1d8fae">(나)</small>':'')+'</span></div>';
  }).join("")||'<div class="online-row">아직 접속자가 없습니다.</div>';

  var seen=new Set();
  rows.forEach(function(p){
    if(!p.uid||p.uid===cloud.uid||p.sessionId===SESSION_ID||
       (profile.studentId&&p.studentId===profile.studentId)||OWN_UIDS.has(p.uid))return;
    seen.add(p.uid);
    var node=remoteNodes.get(p.uid);
    if(!node){
      var el=document.createElement("div");
      el.className="avatar remote";
      el.style.position="absolute"; el.style.left="0"; el.style.top="0";
      el.style.width="74px"; el.style.height="104px";
      el.innerHTML='<span class="name-tag"></span><span class="avatar-body"></span>';
      remoteLayer.appendChild(el);
      node={el:el,cx:Number(p.x)||50,cy:Number(p.y)||86,tx:0,ty:0,key:"",moving:false,reactionAt:0};
      remoteNodes.set(p.uid,node);
    }
    node.tx=Number(p.x)||50; node.ty=Number(p.y)||86;
    var tag=node.el.querySelector(".name-tag");
    var label=p.name+(p.group?" · "+p.group+"모둠":"");
    if(tag.textContent!==label)tag.textContent=label;
    var key=avatarKey(normalizeAvatar(p.avatar))+"|"+(p.facing||"down");
    if(node.key!==key){
      node.key=key;
      node.el.querySelector(".avatar-body").innerHTML=rigHtml(p.avatar,false);
      var f=node.el.querySelector(".rig-flip");
      if(f)f.style.setProperty("--flip",p.facing==="left"?-1:1);
      node.el.classList.remove("facing-up","facing-down","facing-left","facing-right");
      node.el.classList.add("facing-"+(p.facing||"down"));
    }
    paintChatBubble(p.uid,node.el);
    if(p.reaction&&p.reactionAt&&p.reactionAt!==node.reactionAt&&Date.now()-p.reactionAt<9000){
      node.reactionAt=p.reactionAt;
      var b=document.createElement("span"); b.className="reaction-bubble"; b.textContent=p.reaction;
      node.el.appendChild(b); setTimeout(function(){b.remove()},1900);
    }
  });
  remoteNodes.forEach(function(node,key){
    if(!seen.has(key)){node.el.remove();remoteNodes.delete(key)}
  });
}
function renderWorldExhibits(){
  var host=$("#worldExhibits");
  var list=visibleExhibits().filter(function(i){return i.published!==false});
  var newest=list.slice().sort(function(a,b){return (b.createdAtMs||0)-(a.createdAtMs||0)})[0];
  var html="";
  ROOM_LIST.forEach(function(room){
    var slots=WORLD_FRAME_SLOTS[room.id]||[];
    var items=list.filter(function(i){return Number(i.roomId)===room.id})
      .sort(function(a,b){return (b.createdAtMs||0)-(a.createdAtMs||0)}).slice(0,slots.length);
    items.forEach(function(item,i){
      var s=slots[i]; if(!s)return;
      html+='<button class="world-exhibit'+(newest&&newest.id===item.id?" newest":"")+'" data-world-view="'+esc(item.id)+'" '+
        'style="left:'+s.x+'%;top:'+s.y+'%;--frame-width:'+s.w+'%;--roll:'+s.roll+'deg;--yaw:'+s.yaw+'deg;--pitch:'+s.pitch+'deg;--depth:'+s.depth+'" '+
        'title="'+esc(item.title)+'"><span class="world-frame-border"><span class="world-art">'+galleryMedia(item)+'</span>'+
        '<span class="world-caption">'+esc(item.title)+'</span></span></button>';
    });
  });
  host.innerHTML=html;
  hydrateOfflinePreviews(host);
}
function renderChat(){
  var box=$("#chatMessages");
  var rows=state.messages.slice().sort(function(a,b){return (a.createdAtMs||0)-(b.createdAtMs||0)}).slice(-40);
  box.innerHTML=rows.map(function(m){
    return '<div>'+(isTeacher?'<button type="button" class="chat-delete" data-chat-delete="'+esc(m.id)+'" aria-label="채팅 삭제">삭제</button>':'')+'<b>'+esc(m.name)+'</b> <small style="color:#8ba0ac">'+timeText(m.createdAtMs)+'</small><br>'+esc(m.text)+'</div>';
  }).join("")||'<div style="color:#8ba0ac">첫 인사를 남겨 보세요.</div>';
  box.scrollTop=box.scrollHeight;
}
function paintChatBubble(owner,el){
  var bubble=chatBubbles.get(owner);
  if(!bubble||bubble.until<=Date.now())return;
  var old=el.querySelector(".speech-bubble");
  if(old&&old.dataset.messageId===bubble.id)return;
  if(old)old.remove();
  var node=document.createElement("span");node.className="speech-bubble";
  node.dataset.messageId=bubble.id;node.textContent=bubble.text;
  el.appendChild(node);
}
function removeChatBubble(id){
  chatBubbles.forEach(function(b,owner){
    if(b.id!==id)return;
    clearTimeout(b.timer);chatBubbles.delete(owner);
    var el=owner===cloud.uid?avatarEl:(remoteNodes.get(owner)||{}).el;
    if(el){var node=el.querySelector(".speech-bubble");if(node&&node.dataset.messageId===id)node.remove()}
  });
}
function showChatBubble(msg){
  if(!msg.ownerUid||!msg.text||chatSeenIds.has(msg.id))return;
  chatSeenIds.add(msg.id);
  if(chatSeenIds.size>1000)chatSeenIds.delete(chatSeenIds.values().next().value);
  var old=chatBubbles.get(msg.ownerUid);
  if(old)removeChatBubble(old.id);
  var b={id:msg.id,text:String(msg.text).slice(0,120),until:Date.now()+CHAT_BUBBLE_MS};
  chatBubbles.set(msg.ownerUid,b);
  b.timer=setTimeout(function(){removeChatBubble(msg.id)},CHAT_BUBBLE_MS);
  var el=msg.ownerUid===cloud.uid?avatarEl:(remoteNodes.get(msg.ownerUid)||{}).el;
  if(el)paintChatBubble(msg.ownerUid,el);
}
function applyChatChanges(snap){
  snap.docChanges().forEach(function(change){
    if(change.type==="removed"){removeChatBubble(change.doc.id);return}
    if(change.type!=="added")return;
    var m=Object.assign({},change.doc.data(),{id:change.doc.id});
    // Do not replay earlier history when opening the page or backfilling after a deletion.
    var age=Date.now()+serverOffset-Number(m.createdAtMs);
    if(Number(m.createdAtMs)>=chatEnteredAt+serverOffset&&age>=-2000&&age<CHAT_BUBBLE_MS)showChatBubble(m);
  });
}
async function deleteChatMessage(id){
  if(!isTeacher||!cloud.ready||chatDeleteBusy)return;
  if(!confirm("이 채팅을 모든 접속자의 기록에서 삭제할까요?"))return;
  chatDeleteBusy=true;
  try{
    await cloud.museumRef.collection("messages").doc(sanitizeId(id)).delete();
    removeChatBubble(id);
    state.messages=state.messages.filter(function(m){return m.id!==id});saveLocalData();renderChat();
    toast("채팅을 삭제했습니다.");
  }catch(e){toast("채팅을 삭제하지 못했습니다. 연결과 교사 계정을 확인해 주세요.")}
  finally{chatDeleteBusy=false}
}
async function clearChatHistory(){
  if(!isTeacher||!cloud.ready||chatDeleteBusy)return;
  if(!confirm("지금까지의 채팅 기록을 모두 삭제할까요? 모든 접속자에게 적용되며 되돌릴 수 없습니다."))return;
  chatDeleteBusy=true;
  var btn=$("#clearChatBtn"),cutoff=Date.now()+serverOffset;
  if(btn){btn.disabled=true;btn.textContent="채팅 삭제 중…"}
  try{
    while(true){
      var snap=await cloud.museumRef.collection("messages").orderBy("createdAtMs").endAt(cutoff).limit(300).get({source:"server"});
      if(snap.empty)break;
      var batch=cloud.db.batch();snap.docs.forEach(function(d){batch.delete(d.ref)});
      await batch.commit();
      snap.docs.forEach(function(d){removeChatBubble(d.id)});
    }
    state.messages=state.messages.filter(function(m){return m.createdAtMs>cutoff});
    saveLocalData();renderChat();toast("채팅 기록을 모두 삭제했습니다.");
  }catch(e){toast("채팅 삭제가 완료되지 않았습니다. 연결을 확인한 뒤 다시 눌러 주세요.")}
  finally{chatDeleteBusy=false;if(btn){btn.disabled=false;btn.textContent="채팅 기록 전체 삭제"}}
}
function galleryMedia(item){
  var url=safeUrl(item.fileUrl);
  if(url&&/^image\//.test(item.fileType||""))return '<img loading="lazy" src="'+esc(url)+'" alt="">';
  if(url&&/^video\//.test(item.fileType||""))return '<video src="'+esc(url)+'" muted playsinline></video>';
  if(item.fileId)return '<span data-offline-preview="'+esc(item.fileId)+'" data-offline-type="'+esc(item.fileType||"")+'">'+(TYPE_ICON[item.type]||"📎")+'</span>';
  var yt=getYoutubeId(item.link);
  if(yt)return '<img loading="lazy" src="https://img.youtube.com/vi/'+esc(yt)+'/mqdefault.jpg" alt="">';
  return '<span>'+(TYPE_ICON[item.type]||"📎")+'</span>';
}
function getYoutubeId(v){
  var m=String(v||"").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
  return m?m[1]:"";
}
async function hydrateOfflinePreviews(root){
  var nodes=$$("[data-offline-preview]",root);
  for(var i=0;i<nodes.length;i++){
    var el=nodes[i], file=await getStoredFile(el.dataset.offlinePreview);
    if(!file)continue;
    var type=el.dataset.offlineType||file.type||"";
    if(/^image\//.test(type)){
      var img=document.createElement("img"); img.src=URL.createObjectURL(file); el.replaceWith(img);
    }else if(/^video\//.test(type)){
      var v=document.createElement("video"); v.src=URL.createObjectURL(file); v.muted=true; v.playsInline=true; el.replaceWith(v);
    }
  }
}

/* ══════════ 모달 ══════════ */
function modalShell(title,body,small){
  overlay.classList.remove("hidden");
  overlay.innerHTML='<div class="modal'+(small?" small":"")+'"><div class="modal-head"><h2>'+title+'</h2>'+
    '<button class="modal-close" data-close-modal aria-label="닫기">✕</button></div><div class="modal-body">'+body+'</div></div>';
}
function closeModal(){overlay.classList.add("hidden");overlay.innerHTML="";modalState=null}
function ensureProfile(next){if(profile.name){next();return}showProfile(next)}

function showProfile(afterSave){
  modalState={type:"profile"};
  var draft=Object.assign({},normalizeAvatar(profile.avatar));
  modalShell("🎨 내 캐릭터 만들기",
    '<div class="notice"><b>얼굴·머리·색·옷·장식을 골라 나만의 캐릭터를 만드세요.</b><br>10만 가지가 넘는 조합을 공통 좌표계로 맞춰 두어 어떤 조합도 자연스럽게 겹쳐집니다.</div>'+
    '<div class="form-grid" style="margin-top:12px">'+
      '<div class="field"><label for="profileName">이름 또는 별칭</label><input id="profileName" maxlength="20" value="'+esc(profile.name||"")+'" placeholder="예: 김하늘"></div>'+
      '<div class="field"><label for="profileGroup">모둠</label><select id="profileGroup"><option value="">선택하지 않음</option>'+
        [1,2,3,4,5,6].map(function(n){return '<option value="'+n+'"'+(profile.group===String(n)?" selected":"")+'>'+n+'모둠</option>'}).join("")+
      '</select></div>'+
    '</div>'+
    '<div class="avatar-editor" id="avatarEditor">'+
      '<section class="avatar-preview-card"><div class="avatar-preview" id="avatarPreview"></div>'+
        '<strong class="avatar-preview-label" id="avatarPreviewLabel"></strong>'+
        '<p class="avatar-preview-help">작은 2D 스프라이트가 되어 박물관을 걸어 다녀요.</p>'+
        '<div class="avatar-quick-actions"><button type="button" class="btn" data-random-avatar>🎲 랜덤</button>'+
        AVATAR_PRESETS.map(function(p,i){return '<button type="button" class="btn" data-avatar-preset="'+i+'">'+esc(p.name)+'</button>'}).join("")+'</div></section>'+
      '<div class="avatar-controls">'+
        '<section class="avatar-section"><div class="avatar-section-title"><span>1. 얼굴</span><small>8가지 표정·피부톤</small></div><div class="avatar-choice-grid" id="faceOptions"></div></section>'+
        '<section class="avatar-section"><div class="avatar-section-title"><span>2. 머리 모양</span><small>12가지 스타일</small></div><div class="avatar-choice-grid" id="hairOptions"></div></section>'+
        '<section class="avatar-section"><div class="avatar-section-title"><span>3. 머리 색깔</span><small id="hairColorName"></small></div><div class="color-options" id="hairColorOptions"></div></section>'+
        '<section class="avatar-section"><div class="avatar-section-title"><span>4. 옷</span><small>12가지 복장</small></div><div class="avatar-choice-grid" id="outfitOptions"></div></section>'+
        '<section class="avatar-section"><div class="avatar-section-title"><span>5. 장식</span><small>9가지 모자·안경·핀</small></div><div class="avatar-choice-grid" id="accessoryOptions"></div></section>'+
      '</div>'+
    '</div>'+
    '<div class="modal-actions"><button class="btn" data-close-modal>취소</button><button class="btn primary" id="saveProfileBtn">저장하고 입장</button></div>');

  function choiceButtons(part,names){
    return names.map(function(name,index){
      var cand=Object.assign({},draft); cand[part]=index;
      return '<button type="button" class="avatar-option'+(draft[part]===index?" selected":"")+'" data-avatar-part="'+part+'" data-avatar-value="'+index+'">'+
        '<span class="choice-sprite" style="'+spriteBg(cand)+'" aria-hidden="true"></span><span>'+esc(name)+'</span></button>';
    }).join("");
  }
  function render(){
    $("#avatarPreview").setAttribute("style",spriteBg(draft));
    $("#avatarPreviewLabel").textContent=FACE_NAMES[draft.face]+" · "+HAIR_NAMES[draft.hair]+" · "+OUTFIT_NAMES[draft.outfit]+" · "+ACCESSORY_NAMES[draft.accessory];
    $("#faceOptions").innerHTML=choiceButtons("face",FACE_NAMES);
    $("#hairOptions").innerHTML=choiceButtons("hair",HAIR_NAMES);
    $("#outfitOptions").innerHTML=choiceButtons("outfit",OUTFIT_NAMES);
    $("#accessoryOptions").innerHTML=choiceButtons("accessory",ACCESSORY_NAMES);
    $("#hairColorName").textContent=HAIR_COLORS[draft.hairColor].name;
    $("#hairColorOptions").innerHTML=HAIR_COLORS.map(function(c,i){
      return '<button type="button" class="color-option'+(draft.hairColor===i?" selected":"")+'" style="--swatch:rgb('+c.rgb.join(",")+')" data-hair-color="'+i+'" aria-label="머리 색 '+esc(c.name)+'"></button>';
    }).join("");
  }
  if(!atlasReady)spriteWaiters.push(function(){if(modalState&&modalState.type==="profile")render()});
  $("#avatarEditor").onclick=function(e){
    var p=e.target.closest("[data-avatar-part]");
    if(p){draft[p.dataset.avatarPart]=Number(p.dataset.avatarValue);render();return}
    var c=e.target.closest("[data-hair-color]");
    if(c){draft.hairColor=Number(c.dataset.hairColor);render();return}
    var preset=e.target.closest("[data-avatar-preset]");
    if(preset){draft=Object.assign({},AVATAR_PRESETS[Number(preset.dataset.avatarPreset)]||DEFAULT_AVATAR);render();return}
    if(e.target.closest("[data-random-avatar]")){
      draft={face:Math.floor(Math.random()*FACE_COUNT),hair:Math.floor(Math.random()*HAIR_COUNT),hairColor:Math.floor(Math.random()*HAIR_COLORS.length),outfit:Math.floor(Math.random()*OUTFIT_COUNT),accessory:Math.floor(Math.random()*ACCESSORY_COUNT)};
      render();
    }
  };
  render();
  $("#saveProfileBtn").onclick=async function(){
    var name=$("#profileName").value.trim();
    if(!name){toast("이름 또는 별칭을 입력해 주세요.");return}
    profile.name=name;
    profile.group=normalizeGroup($("#profileGroup").value);
    profile.avatar=normalizeAvatar(draft);
    if(!profile.studentId)profile.studentId=cloud.uid||uid("student-");
    saveProfileLocal(); updateProfileUI();
    try{await registerProfile()}catch(e){toast("프로필은 이 기기에 저장했습니다. 연결되면 자동 동기화됩니다.")}
    closeModal(); refresh(false); schedulePresence(true);
    if(afterSave)afterSave();
  };
}
function showRouteGuide(){
  modalState={type:"guide"};
  modalShell("🧭 전시관 길찾기",
    '<div class="notice"><b>가고 싶은 관을 누르면 벽과 전시대를 피해 입구를 지나 전시관 안까지 자동으로 걸어갑니다.</b><br>이동 중 방향키·WASD·조이스틱을 움직이면 언제든 직접 조작으로 바뀝니다.</div>'+ 
    '<div class="guide-grid">'+ROOM_LIST.map(function(room){
      return '<button type="button" class="guide-room" data-guide-room="'+room.id+'"><span>'+room.icon+'</span>'+esc(room.name)+'</button>';
    }).join("")+'</div>'+
    '<div class="modal-actions"><button class="btn" data-close-modal>취소</button></div>',true);
}
function showHelp(){
  modalState={type:"help"};
  modalShell("🧭 박물관 이용 방법",
    '<div class="notice"><b>캐릭터를 직접 움직여 전시관을 찾아가는 박물관입니다.</b></div>'+
    '<div style="display:grid;gap:11px;font-size:15px;line-height:1.65;margin-top:12px">'+
      '<div><b>1. 이동하기</b><br>컴퓨터는 방향키 또는 WASD(두 방향을 같이 누르면 대각선), 스마트패드는 오른쪽 아래 조이스틱을 사용합니다. 가고 싶은 바닥을 누르면 벽을 피해 알아서 걸어갑니다.</div>'+
      '<div><b>2. 지나갈 수 없는 곳</b><br>벽, 전시대, 수조, 화단, 벤치는 통과할 수 없습니다. 다만 표시된 입구와 문턱은 실제로 걸어서 통과할 수 있어요.</div>'+ 
      '<div><b>3. 전시관 들어가기</b><br>입구를 향해 계속 걸으면 전시관 안으로 들어갑니다. 문 앞 F 표시에서 F 키나 화면의 입장 버튼을 누르면 전시 목록도 바로 볼 수 있습니다. 위쪽 🧭 길찾기는 전시관 안까지 안내합니다.</div>'+ 
      '<div><b>4. 작품 전시하기</b><br>작품을 올리면 선택한 관의 벽면 액자로 바로 나타납니다. 액자를 누르면 자세히 볼 수 있어요.</div>'+
      '<div><b>5. 함께 활동하기</b><br>전체 채팅, 반응 이모지, 접속자 보기를 쓸 수 있습니다. 왼쪽 아래 −/＋로 확대·축소합니다.</div>'+
    '</div>'+
    '<div class="modal-actions"><button class="btn primary" data-close-modal>알겠어요</button></div>',true);
}
function showConnectionHelp(){
  modalState={type:"connection"};
  var detail=cloud.error?'<div class="notice warn" style="margin-top:10px"><b>확인 내용</b><br>'+esc(cloud.error)+'</div>':"";
  modalShell("☁️ 실시간 연결 안내",
    '<div style="display:grid;gap:11px;font-size:14px;line-height:1.65">'+
      '<div><b>'+(cloud.ready?"Firebase 실시간 연결 중":"현재는 이 기기 미리보기 모드")+'</b><br>'+
      (cloud.ready?"전시물, 학생, 채팅, 접속자 위치가 같은 Firebase 프로젝트의 모든 기기에 동기화됩니다."
                  :"Firebase Hosting 주소에서 열고 익명 로그인을 사용 설정하면 자동으로 실시간 모드가 됩니다.")+'</div>'+
      '<div>배포 묶음의 <b>ANTIGRAVITY_DEPLOY.md</b> 순서대로 설정하면 별도의 키 입력 없이 연결됩니다.</div>'+
    '</div>'+detail+
    '<div class="modal-actions"><button class="btn primary" data-close-modal>확인</button></div>',true);
}
function detailMedia(item){
  var url=safeUrl(item.fileUrl);
  if(url&&/^image\//.test(item.fileType||""))return '<img src="'+esc(url)+'" alt="" style="width:100%;border-radius:12px">';
  if(url&&/^video\//.test(item.fileType||""))return '<video src="'+esc(url)+'" controls playsinline style="width:100%;border-radius:12px"></video>';
  var yt=getYoutubeId(item.link);
  if(yt)return '<div style="position:relative;padding-top:56.25%"><iframe src="https://www.youtube.com/embed/'+esc(yt)+'" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px" allowfullscreen title="영상"></iframe></div>';
  return "";
}
function exhibitCardsHtml(list){
  if(!list.length)return '<div class="notice" style="margin-top:13px">아직 전시된 작품이 없습니다. 위의 전시하기 버튼으로 첫 작품을 올려 보세요.</div>';
  return '<div class="exhibit-grid">'+list.map(function(item){
    var room=roomById(item.roomId);
    return '<button class="exhibit-card" data-view="'+esc(item.id)+'"><span class="thumb">'+galleryMedia(item)+'</span>'+
      '<span class="meta"><strong>'+esc(item.title)+'</strong>'+
      '<span>'+esc(item.author||"익명")+(item.group?" · "+esc(item.group)+"모둠":"")+' · '+esc(room?room.name:"")+'</span></span></button>';
  }).join("")+'</div>';
}
function showRoom(roomId){
  var room=roomById(roomId)||ROOM_LIST[0];
  currentRoomId=room.id;
  modalState={type:"room",roomId:room.id};
  var list=visibleExhibits().filter(function(i){return Number(i.roomId)===room.id&&(i.published!==false||isTeacher)})
    .sort(function(a,b){return (b.createdAtMs||0)-(a.createdAtMs||0)});
  modalShell(room.icon+" "+esc(room.name),
    '<div class="notice" style="background:'+room.soft+';border-color:'+room.color+'33">'+esc(room.desc)+'</div>'+
    '<div class="modal-actions" style="justify-content:flex-start;margin-top:12px">'+
      '<button class="btn primary" data-add-room="'+room.id+'">＋ 이 관에 전시하기</button>'+
      '<button class="btn" data-browse>전체 전시 보기</button></div>'+
    exhibitCardsHtml(list));
  hydrateOfflinePreviews(overlay);
}
function showBrowse(){
  modalState={type:"browse"};
  var list=visibleExhibits().filter(function(i){return i.published!==false||isTeacher})
    .sort(function(a,b){return (b.createdAtMs||0)-(a.createdAtMs||0)});
  modalShell("🖼️ 전체 전시",
    '<div class="modal-actions" style="justify-content:flex-start">'+
      ROOM_LIST.map(function(r){return '<button class="btn" data-open-room="'+r.id+'">'+r.icon+' '+esc(r.name)+'</button>'}).join("")+
    '</div>'+exhibitCardsHtml(list));
  hydrateOfflinePreviews(overlay);
}
function showExhibit(id){
  var item=exhibitById(id); if(!item)return;
  var room=roomById(item.roomId);
  modalState={type:"exhibit",id:id};
  var canEdit=isTeacher||(item.ownerUid&&item.ownerUid===cloud.uid);
  modalShell("🖼️ "+esc(item.title),
    detailMedia(item)+
    '<div style="margin-top:12px;font-size:14px;color:#5c7482">'+esc(item.author||"익명")+
      (item.group?" · "+esc(item.group)+"모둠":"")+' · '+esc(room?room.name:"")+' · '+esc(item.type||"기타")+'</div>'+
    '<p style="margin:11px 0 0;font-size:15px;line-height:1.7;white-space:pre-wrap">'+esc(item.desc||"")+'</p>'+
    (item.link?'<p style="margin-top:10px"><a href="'+esc(safeUrl(item.link))+'" target="_blank" rel="noopener">🔗 연결된 자료 열기</a></p>':"")+
    (item.fileName?'<p style="margin-top:10px"><button class="btn" data-open-file="'+esc(item.id)+'">📎 '+esc(item.fileName)+' <small>'+formatBytes(item.fileSize)+'</small></button></p>':"")+
    '<div class="modal-actions">'+
      (canEdit?'<button class="btn danger" data-delete-exhibit="'+esc(item.id)+'">삭제</button>':"")+
      '<button class="btn" data-open-room="'+(room?room.id:1)+'">← 전시관으로</button>'+
      '<button class="btn primary" data-close-modal>닫기</button></div>',true);
}
function showAddExhibit(roomId){
  ensureProfile(function(){
    var room=roomById(roomId)||ROOM_LIST[0];
    modalState={type:"add",roomId:room.id};
    modalShell("＋ 작품 전시하기",
      '<div class="form-grid">'+
        '<div class="field"><label for="exTitle">작품 제목</label><input id="exTitle" maxlength="80" placeholder="예: 독도의 하루"></div>'+
        '<div class="field"><label for="exRoom">전시관</label><select id="exRoom">'+
          ROOM_LIST.map(function(r){return '<option value="'+r.id+'"'+(r.id===room.id?" selected":"")+'>'+r.icon+' '+esc(r.name)+'</option>'}).join("")+'</select></div>'+
        '<div class="field"><label for="exAuthor">만든 사람</label><input id="exAuthor" maxlength="20" value="'+esc(profile.name||"")+'"></div>'+
        '<div class="field"><label for="exType">자료 종류</label><select id="exType">'+
          TYPE_LIST.map(function(t){return '<option value="'+esc(t)+'">'+(TYPE_ICON[t]||"")+' '+esc(t)+'</option>'}).join("")+'</select></div>'+
      '</div>'+
      '<div class="field" style="margin-top:11px"><label for="exDesc">작품 설명</label><textarea id="exDesc" maxlength="1500" placeholder="무엇을 어떻게 표현했는지 적어 주세요."></textarea></div>'+
      '<div class="field" style="margin-top:11px"><label for="exLink">연결 주소(선택)</label><input id="exLink" placeholder="유튜브나 자료 링크"></div>'+
      '<div class="field" style="margin-top:11px"><label for="exFile">파일 첨부(선택 · 25MB 이하)</label><input id="exFile" type="file" accept="image/*,video/*,application/pdf"></div>'+
      '<div class="notice" style="margin-top:11px">이름과 작품만 올리고, 주소·연락처 같은 개인정보는 넣지 않습니다.</div>'+
      '<div id="uploadProgress" class="notice hidden" style="margin-top:9px"></div>'+
      '<div class="modal-actions"><button class="btn" data-close-modal>취소</button><button class="btn primary" id="saveExhibitBtn">전시하기</button></div>');
    $("#saveExhibitBtn").onclick=function(){saveExhibitForm()};
  });
}
async function saveExhibitForm(){
  if(!cloud.ready){toast("서버 연결 후 전시할 수 있습니다.");return}
  var title=$("#exTitle").value.trim();
  if(!title){toast("작품 제목을 입력해 주세요.");return}
  var btn=$("#saveExhibitBtn"); btn.disabled=true; btn.textContent="올리는 중…";
  var file=($("#exFile").files||[])[0]||null;
  if(file&&file.size>MAX_FILE_BYTES){toast("파일은 25MB 이하만 올릴 수 있습니다.");btn.disabled=false;btn.textContent="전시하기";return}
  var item={
    id:uid("ex-"),roomId:Number($("#exRoom").value)||1,title:title,
    author:$("#exAuthor").value.trim()||profile.name||"익명",
    group:profile.group||"",type:$("#exType").value||"기타",
    desc:$("#exDesc").value.trim(),link:safeUrl($("#exLink").value),
    fileUrl:"",fileName:"",fileType:"",fileSize:0,storagePath:"",fileId:"",
    featured:false,published:true,ownerUid:cloud.uid||"local",
    studentId:profile.studentId||"",createdAtMs:Date.now()
  };
  try{
    if(file){
      item.fileName=file.name; item.fileType=file.type||""; item.fileSize=file.size;
      if(cloud.ready){
        var res=await uploadAttachment(item.id,file,function(pct){
          var p=$("#uploadProgress"); if(p){p.classList.remove("hidden");p.textContent="업로드 "+pct+"%"}
        });
        item.fileUrl=res.url; item.storagePath=res.path;
      }else{
        item.fileId=await putStoredFile(item.id,file);
      }
    }
    await persistExhibit(item);
    state.exhibits=visibleExhibits().filter(function(i){return !i.sample&&i.id!==item.id}).concat([item]);
    saveLocalData();
    closeModal(); refresh(true); toast("작품을 전시했습니다.");
    showRoom(item.roomId);
  }catch(e){
    console.warn(e);
    btn.disabled=false; btn.textContent="전시하기";
    toast("올리는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
}
function uploadAttachment(itemId,file,onProgress){
  return new Promise(function(resolve,reject){
    var path="museums/"+MUSEUM_ID+"/exhibits/"+cloud.uid+"/"+sanitizeId(itemId)+"-"+Date.now();
    var task=cloud.storage.ref(path).put(file,{contentType:file.type||"application/octet-stream"});
    task.on("state_changed",function(s){
      if(onProgress&&s.totalBytes)onProgress(Math.round(s.bytesTransferred/s.totalBytes*100));
    },reject,function(){
      task.snapshot.ref.getDownloadURL().then(function(url){resolve({url:url,path:path})},reject);
    });
  });
}
async function openExhibitFile(id){
  var item=exhibitById(id); if(!item)return;
  var url=safeUrl(item.fileUrl);
  if(url){window.open(url,"_blank","noopener");return}
  var file=await getStoredFile(item.fileId);
  if(!file){toast("이 기기에 저장된 파일을 찾지 못했습니다.");return}
  var blobUrl=URL.createObjectURL(file);
  window.open(blobUrl,"_blank","noopener");
  setTimeout(function(){URL.revokeObjectURL(blobUrl)},60000);
}
async function persistExhibit(item){
  if(!cloud.ready)return;
  var copy=Object.assign({},item); delete copy.id; delete copy.sample;
  await cloud.museumRef.collection("exhibits").doc(sanitizeId(item.id)).set(copy);
}
async function patchExhibit(id,patch){
  var item=exhibitById(id); if(!item)return;
  if(!cloud.ready){toast("서버 연결을 확인해 주세요.");return}
  try{
    await cloud.museumRef.collection("exhibits").doc(sanitizeId(id)).update(patch);
    Object.assign(item,patch);saveLocalData();refresh(true);
  }catch(e){toast("서버 반영에 실패했습니다.")}
}
async function deleteExhibit(id,backToAdmin){
  var item=exhibitById(id); if(!item)return;
  if(item.sample){toast("예시 전시는 첫 작품을 올리면 자동으로 사라집니다.");return}
  if(!cloud.ready){toast("서버 연결을 확인해 주세요.");return}
  if(!confirm("이 작품을 삭제할까요? 되돌릴 수 없습니다."))return;
  try{
    await cloud.museumRef.collection("exhibits").doc(sanitizeId(id)).delete();
  }catch(e){toast("서버에서 삭제하지 못했습니다.");return}
  state.exhibits=state.exhibits.filter(function(i){return String(i.id)!==String(id)});
  saveLocalData();refresh(true);await removeStoredFile(item.fileId);
  if(item.storagePath)await cloud.storage.ref(item.storagePath).delete().catch(function(){toast("작품은 삭제했지만 첨부파일 정리가 필요합니다.")});
  toast("작품을 삭제했습니다.");
  if(backToAdmin)showAdminPanel();else closeModal();
}
async function registerProfile(){
  if(!cloud.ready||!profile.name)return;
  var id=sanitizeId(cloud.uid);
  profile.studentId=id; saveProfileLocal();
  await cloud.museumRef.collection("students").doc(id).set({
    name:profile.name,group:profile.group||"",avatar:normalizeAvatar(profile.avatar),
    uid:cloud.uid,active:true,updatedAtMs:Date.now()
  },{merge:true});
}

/* ══════════ 교사 로그인 (구글) ══════════ */
function emailAllowed(email){
  return TEACHER_EMAILS.indexOf(String(email||"").trim().toLowerCase())>=0;
}
function showAdminLogin(){
  if(isTeacher){showAdminPanel();return}
  modalState={type:"admin-login"};
  modalShell("⚙ 교사용 관리",
    '<div class="notice"><b>교사 구글 계정으로 로그인합니다.</b><br>허용된 계정: <b>'+esc(TEACHER_EMAILS.join(", "))+'</b></div>'+
    '<div class="notice warn" style="margin-top:10px">학생은 로그인하지 않아도 관람과 전시가 가능합니다. 관리 기능만 교사 계정으로 보호됩니다.</div>'+
    '<div id="loginError" class="notice warn hidden" style="margin-top:10px"></div>'+
    '<div class="modal-actions"><button class="btn" data-close-modal>취소</button>'+
    '<button class="btn google" id="googleLoginBtn"><b>G</b> 구글 계정으로 로그인</button></div>',true);
  $("#googleLoginBtn").onclick=teacherSignIn;
}
async function teacherSignIn(){
  var btn=$("#googleLoginBtn"), errBox=$("#loginError");
  if(!cloud.ready||!window.firebase||!firebase.auth){
    if(errBox){errBox.classList.remove("hidden");errBox.textContent="Firebase에 연결된 뒤에 로그인할 수 있습니다. 배포된 Hosting 주소에서 열어 주세요."}
    return;
  }
  if(btn){btn.disabled=true;btn.textContent="로그인 창을 여는 중…"}
  if(errBox)errBox.classList.add("hidden");
  var auth=firebase.auth();
  var provider=new firebase.auth.GoogleAuthProvider();
  var previousUid=cloud.uid;
  if(previousUid)OWN_UIDS.add(previousUid);
  provider.setCustomParameters({prompt:"select_account",login_hint:TEACHER_EMAILS[0]});
  presencePaused=true;
  clearTimeout(presenceTimer);presenceTimer=0;
  // Start cleanup without awaiting it. The popup opens in the click handler.
  var cleanup=cleanupPresence(presenceRef);
  try{
    var cred;
    try{
      cred=auth.currentUser&&auth.currentUser.isAnonymous
        ? await auth.currentUser.linkWithPopup(provider)
        : await auth.signInWithPopup(provider);
    }catch(linkErr){
      if(linkErr&&(linkErr.code==="auth/credential-already-in-use"||linkErr.code==="auth/email-already-in-use")&&linkErr.credential){
        await cleanup;
        cred=await auth.signInWithCredential(linkErr.credential);
      }else throw linkErr;
    }
    await cleanup;
    var user=cred.user||auth.currentUser;
    await user.getIdToken(true);
    await user.reload();
    user=auth.currentUser||user;
    var email=(user.email||"").toLowerCase();
    if(!emailAllowed(email)||!user.emailVerified){
      await auth.signOut();
      await auth.signInAnonymously();
      throw new Error("교사로 허용된 구글 계정("+TEACHER_EMAILS.join(", ")+")으로 로그인해 주세요. 선택한 계정: "+(email||"이메일 없음"));
    }
    toast("교사 계정으로 로그인했습니다.");
  }catch(e){
    console.warn(e);
    var msg=e&&e.code==="auth/popup-blocked"?"팝업이 차단되었습니다. 주소창의 팝업 허용을 눌러 주세요."
      :e&&e.code==="auth/popup-closed-by-user"?"로그인 창이 닫혔습니다. 다시 눌러 주세요."
      :e&&e.code==="auth/operation-not-allowed"?"Firebase 콘솔에서 Google 로그인을 사용 설정해 주세요."
      :e&&e.code==="auth/unauthorized-domain"?"Firebase 콘솔 Authentication → 설정 → 승인된 도메인에 이 주소를 추가해 주세요."
      :(e&&e.message)||"로그인에 실패했습니다.";
    if(errBox){errBox.classList.remove("hidden");errBox.textContent=msg}
    if(btn){btn.disabled=false;btn.textContent="구글 계정으로 로그인"}
  }finally{
    await cleanup;
    presencePaused=false;
    var current=auth.currentUser;
    isTeacher=!!(current&&current.emailVerified&&emailAllowed(current.email));
    if(current){
      if(previousUid!==current.uid){
        SESSION_ID="tab-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,12);
        state.presence=state.presence.filter(function(p){return p.uid!==previousUid});
      }
      cloud.uid=current.uid;cloud.email=(current.email||"").toLowerCase();
      OWN_UIDS.add(current.uid);
      cloud.unsubs.splice(0).forEach(function(off){off()});
      attachCloudListeners();
      initPresence();
      registerProfile().catch(function(e){console.warn("프로필 동기화",e)});
      renderPresence();updateProfileUI();
      if(isTeacher)showAdminPanel();
    }else{
      stopPresenceListeners();cloud.ready=false;
      setSyncStatus("error","새로 고침 후 다시 연결해 주세요.");
    }
  }
}
async function teacherSignOut(){
  presencePaused=true;
  stopPresenceListeners();
  await cleanupPresence(presenceRef);
  await firebase.auth().signOut();
  location.reload();
}

function showAdminPanel(){
  if(!isTeacher){showAdminLogin();return}
  modalState={type:"admin"};
  var students=state.students;
  var list=visibleExhibits();
  var studentRows=students.length?students.map(function(s){
    return '<tr><td><b>'+esc(s.name)+'</b></td><td>'+(s.group?esc(s.group)+"모둠":"-")+'</td><td>'+
      list.filter(function(i){return i.studentId===s.id||i.author===s.name}).length+'</td>'+
      '<td><span class="status-pill'+(s.active===false?" off":"")+'">'+(s.active===false?"이용 중지":"활동 가능")+'</span></td>'+
      '<td style="white-space:nowrap"><button class="btn" data-toggle-student="'+esc(s.id)+'">'+(s.active===false?"허용":"중지")+'</button> '+
      '<button class="btn danger" data-delete-student="'+esc(s.id)+'">삭제</button></td></tr>';
  }).join(""):'<tr><td colspan="5">아직 등록된 학생이 없습니다.</td></tr>';
  var exhibitRows=list.length?list.map(function(i){
    var room=roomById(i.roomId);
    return '<tr><td>'+esc(i.title)+'</td><td>'+esc(room?room.name:"")+'</td><td>'+esc(i.author||"")+'</td>'+
      '<td>'+(i.fileName?esc(i.fileName)+"<br><small>"+formatBytes(i.fileSize)+"</small>":"-")+'</td>'+
      '<td>'+(i.published===false?"숨김":"게시")+(i.featured?" ⭐":"")+'</td>'+
      '<td style="white-space:nowrap"><button class="btn" data-publish="'+esc(i.id)+'">'+(i.published===false?"게시":"숨김")+'</button> '+
      '<button class="btn danger" data-delete-exhibit="'+esc(i.id)+'">삭제</button></td></tr>';
  }).join(""):'<tr><td colspan="6">등록된 전시가 없습니다.</td></tr>';
  modalShell("⚙ 교사용 박물관 관리",
    '<div class="notice">로그인 계정: <b>'+esc(cloud.email||"-")+'</b></div>'+
    '<div class="admin-grid" style="margin-top:12px">'+
      '<section class="admin-box"><h3>🏛️ 박물관 설정</h3>'+
        '<div class="field"><label for="museumTitleInput">박물관 제목</label><input id="museumTitleInput" maxlength="40" value="'+esc(state.settings.museumTitle)+'"></div>'+
        '<button class="btn primary" id="saveSettingsBtn" style="margin-top:10px">설정 저장</button></section>'+
      '<section class="admin-box"><h3>☁️ 데이터 관리</h3><div style="display:flex;gap:7px;flex-wrap:wrap">'+
        '<button class="btn" id="exportBtn">JSON 백업</button>'+
        '<button class="btn danger" id="resetBtn">전체 초기화</button>'+
        '<button class="btn danger" id="clearChatBtn">채팅 기록 전체 삭제</button></div>'+
        '<div class="notice" style="margin-top:10px">'+(cloud.ready?"현재 Firestore와 실시간 동기화 중입니다.":"현재 이 기기 미리보기 데이터만 사용 중입니다.")+'</div></section>'+
      '<section class="admin-box full"><h3>🧑‍🎓 학생 관리 <small>'+students.length+'명</small></h3>'+
        '<div class="table-wrap" style="margin-top:10px"><table><thead><tr><th>학생</th><th>모둠</th><th>작품 수</th><th>상태</th><th>관리</th></tr></thead><tbody>'+studentRows+'</tbody></table></div></section>'+
      '<section class="admin-box full"><h3>🖼️ 전시물 관리</h3><div class="table-wrap"><table><thead><tr><th>제목</th><th>전시관</th><th>작성자</th><th>파일</th><th>상태</th><th>관리</th></tr></thead><tbody>'+exhibitRows+'</tbody></table></div></section>'+
    '</div>'+
    '<div class="modal-actions" style="justify-content:space-between"><button class="btn danger" id="logoutAdminBtn">관리 모드 종료</button>'+
    '<button class="btn" data-close-modal>닫기</button></div>');
  $("#saveSettingsBtn").onclick=async function(){
    state.settings.museumTitle=$("#museumTitleInput").value.trim()||DEFAULT_SETTINGS.museumTitle;
    saveLocalData(); refresh(false);
    try{
      if(cloud.ready)await cloud.museumRef.set({museumTitle:state.settings.museumTitle,updatedAtMs:Date.now()},{merge:true});
      toast("설정을 저장했습니다.");
    }catch(e){toast("이 기기에는 저장했지만 서버 저장에 실패했습니다.")}
  };
  $("#exportBtn").onclick=function(){
    var blob=new Blob([JSON.stringify({settings:state.settings,exhibits:state.exhibits,students:state.students},null,2)],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="독도울림박물관-백업-"+new Date().toISOString().slice(0,10)+".json";
    a.click(); setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
  };
  $("#resetBtn").onclick=resetAllData;
  $("#clearChatBtn").onclick=clearChatHistory;
  $("#logoutAdminBtn").onclick=teacherSignOut;
}
async function toggleStudent(id){
  var s=state.students.find(function(i){return String(i.id)===String(id)}); if(!s)return;
  s.active=s.active===false; saveLocalData();
  if(cloud.ready){try{await cloud.museumRef.collection("students").doc(sanitizeId(id)).update({active:s.active})}catch(e){}}
  showAdminPanel();
}
async function deleteStudent(id){
  if(!confirm("이 학생 정보를 삭제할까요?"))return;
  state.students=state.students.filter(function(i){return String(i.id)!==String(id)});
  saveLocalData();
  if(cloud.ready){try{await cloud.museumRef.collection("students").doc(sanitizeId(id)).delete()}catch(e){toast("서버에서 삭제하지 못했습니다.")}}
  showAdminPanel();
}
async function resetAllData(){
  if(!confirm("전시물과 학생 정보를 모두 지웁니다. 계속할까요?"))return;
  if(!confirm("정말 초기화할까요? 되돌릴 수 없습니다."))return;
  if(cloud.ready){
    for(var i=0;i<2;i++){
      var name=["exhibits","students"][i];
      try{
        var snap=await cloud.museumRef.collection(name).get();
        var batch=cloud.db.batch();
        snap.docs.forEach(function(d){batch.delete(d.ref)});
        await batch.commit();
      }catch(e){console.warn(e)}
    }
  }
  state.exhibits=[]; state.students=[]; state.messages=[];
  saveLocalData(); refresh(true); closeModal(); toast("초기화했습니다.");
}
async function sendChat(text){
  if(!cloud.ready){toast("서버 연결 후 대화할 수 있습니다.");return}
  text=String(text||"").trim(); if(!text)return;
  ensureProfile(async function(){
    $("#chatInput").value="";
    var msg={id:uid("msg-"),name:profile.name,text:text.slice(0,120),ownerUid:cloud.uid||"local",createdAtMs:Date.now()+serverOffset};
    showChatBubble(msg);

    if(cloud.ready){
      try{
        var copy=Object.assign({},msg); delete copy.id;
        await cloud.museumRef.collection("messages").doc(sanitizeId(msg.id)).set(copy);
      }catch(e){removeChatBubble(msg.id);if(!$("#chatInput").value)$("#chatInput").value=msg.text;toast("채팅 전송에 실패했습니다.")}
    }
  });
}
function showReaction(value){
  ensureProfile(function(){
    var old=$(".reaction-bubble",avatarEl); if(old)old.remove();
    var b=document.createElement("span"); b.className="reaction-bubble"; b.textContent=value;
    avatarEl.appendChild(b); setTimeout(function(){b.remove()},1900);
    $("#reactionMenu").classList.add("hidden");
    schedulePresence(true,value);
  });
}

/* ══════════ 접속자 동기화 ══════════ */
function maybeWritePresence(){
  var moved=Math.hypot(pos.x-lastPresencePos.x,pos.y-lastPresencePos.y);
  if(moved<PRESENCE_MOVE_EPS)return;
  schedulePresence(false);
}
function schedulePresence(force,reaction){
  if(!cloud.ready||!profile.name)return;
  var wait=force?0:Math.max(0,PRESENCE_MIN_INTERVAL-(Date.now()-lastPresenceWrite));
  if(presenceTimer&&!force)return;
  clearTimeout(presenceTimer);
  presenceTimer=setTimeout(function(){presenceTimer=0;writePresence(reaction)},wait);
}
async function writePresence(reaction){
  if(!cloud.ready||!profile.name||!presenceConnected||!presenceRef||presencePaused)return false;
  lastPresenceWrite=Date.now();
  lastPresencePos={x:pos.x,y:pos.y};
  var data={uid:cloud.uid,sessionId:SESSION_ID,studentId:profile.studentId||"",name:profile.name,group:profile.group||"",avatar:normalizeAvatar(profile.avatar),
    facing:facing,x:Number(pos.x.toFixed(2)),y:Number(pos.y.toFixed(2)),lastSeenMs:firebase.database.ServerValue.TIMESTAMP};
  if(reaction){data.reaction=reaction;data.reactionAt=Date.now()}
  try{await presenceRef.update(data);return true}catch(e){setSyncStatus("error","이동 연결 확인 필요",e);return false}
}

/* ══════════ Firebase ══════════ */
async function initFirebase(){
  setSyncStatus("","Firebase 연결 중");
  if(!window.firebase||!firebase.apps||!firebase.apps.length)throw new Error("Firebase Hosting 주소에서 열면 실시간 연결이 시작됩니다.");
  var auth=firebase.auth();
  await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  await new Promise(function(resolve){var off=auth.onAuthStateChanged(function(){off();resolve()})});
  var user=auth.currentUser;
  if(!user){
    var res=await Promise.race([auth.signInAnonymously(),
      new Promise(function(_,rej){setTimeout(function(){rej(new Error("Firebase 로그인 시간이 초과되었습니다."))},9000)})]);
    user=res.user;
  }
  cloud.uid=user.uid;
  OWN_UIDS.add(user.uid);
  cloud.email=(user.email||"").toLowerCase();
  isTeacher=emailAllowed(cloud.email)&&user.emailVerified;
  cloud.db=firebase.firestore();
  cloud.storage=firebase.storage();
  cloud.museumRef=cloud.db.collection("museums").doc(MUSEUM_ID);
  cloud.ready=true;
  attachCloudListeners();
  initPresence();
  setSyncStatus("","접속자 연결 중");
  updateProfileUI();
  schedulePresence(true);
  heartbeatTimer=setInterval(function(){schedulePresence(true)},PRESENCE_HEARTBEAT);
}
function attachCloudListeners(){
  var onErr=function(e){console.warn(e);setSyncStatus("error","동기화 확인 필요",e)};
  cloud.unsubs.push(cloud.museumRef.onSnapshot(function(snap){
    if(snap.exists)state.settings=Object.assign({},DEFAULT_SETTINGS,snap.data()||{});
    saveLocalData(); refresh(false);
  },onErr));
  cloud.unsubs.push(cloud.museumRef.collection("exhibits").onSnapshot(function(snap){
    state.exhibits=snap.docs.map(function(d){return Object.assign({},d.data(),{id:d.id})});
    saveLocalData(); refresh(true);
  },onErr));
  cloud.unsubs.push(cloud.museumRef.collection("students").onSnapshot(function(snap){
    state.students=snap.docs.map(function(d){return Object.assign({},d.data(),{id:d.id})});
    saveLocalData(); refresh(false);
  },onErr));
  cloud.unsubs.push(cloud.museumRef.collection("messages").orderBy("createdAtMs","desc").limit(40).onSnapshot(function(snap){
    applyChatChanges(snap);
    state.messages=snap.docs.map(function(d){return Object.assign({},d.data(),{id:d.id})});
    saveLocalData(); renderChat();
  },onErr));

}


function stopPresenceListeners(){
  presenceGeneration++;
  presenceConnected=false;
  clearTimeout(presenceTimer);presenceTimer=0;
  presenceUnsubs.splice(0).forEach(function(off){off()});
}
function cleanupPresence(ref){
  // Presence cleanup must never prevent opening Google's popup.
  if(!ref)return Promise.resolve();
  var timer;
  var cleanup=ref.remove().catch(function(e){console.warn("접속 정보 정리 지연",e)});
  return Promise.race([cleanup,new Promise(function(resolve){timer=setTimeout(resolve,1800)})])
    .then(function(){clearTimeout(timer)});
}
function initPresence(){
  stopPresenceListeners();
  var generation=presenceGeneration;
  var db=firebase.database();
  var room=db.ref("museumPresence/"+MUSEUM_ID);
  presenceRef=room.child(SESSION_ID);
  var myRef=presenceRef;
  var peers={};
  function onError(e){
    if(generation!==presenceGeneration)return;
    setSyncStatus("error","접속자 연결 확인 필요",e);
  }
  function listen(ref,event,fn){
    ref.on(event,fn,onError);
    presenceUnsubs.push(function(){ref.off(event,fn)});
  }
  listen(db.ref(".info/serverTimeOffset"),"value",function(s){serverOffset=Number(s.val())||0});
  listen(db.ref(".info/connected"),"value",async function(s){
    if(generation!==presenceGeneration)return;
    presenceConnected=false;
    if(s.val()!==true){setSyncStatus("error","연결 복구 중");return}
    try{
      presenceDisconnect=myRef.onDisconnect();
      // Queue deletion BEFORE publishing the first presence record.
      await presenceDisconnect.remove();
      if(generation!==presenceGeneration||presencePaused)return;
      presenceConnected=true;
      var saved=await writePresence();
      if(generation===presenceGeneration&&(saved||!profile.name))setSyncStatus("online","실시간 연결");
    }catch(e){onError(e)}
  });
  function renderPeers(){state.presence=Object.keys(peers).map(function(k){return peers[k]});renderPresence()}
  function changed(s){
    if(generation!==presenceGeneration)return;
    peers[s.key]=s.val();renderPeers();
  }
  listen(room,"child_added",changed);
  listen(room,"child_changed",changed);
  listen(room,"child_removed",function(s){
    if(generation!==presenceGeneration)return;
    delete peers[s.key];renderPeers();
  });
}

/* ══════════ 입력 ══════════ */
function updateKeyInput(){
  var x=(keysDown.right?1:0)-(keysDown.left?1:0);
  var y=(keysDown.down?1:0)-(keysDown.up?1:0);
  keyInput.x=x; keyInput.y=y;
}
function bindControls(){
  $("#helpBtn").onclick=showHelp;
  $("#syncBadge").onclick=showConnectionHelp;
  $("#profileBtn").onclick=function(){showProfile()};
  $("#guideBtn").onclick=showRouteGuide;
  $("#browseBtn").onclick=function(){showBrowse()};
  $("#addBtn").onclick=function(){showAddExhibit(currentRoomId)};
  $("#teacherBtn").onclick=showAdminLogin;
  $("#onlineBtn").onclick=function(){$("#onlinePanel").classList.toggle("hidden")};
  $("#closeOnlineBtn").onclick=function(){$("#onlinePanel").classList.add("hidden")};
  $("#chatToggleBtn").onclick=function(){
    $("#chatPanel").classList.toggle("collapsed");
    $("#chatToggleBtn").textContent=$("#chatPanel").classList.contains("collapsed")?"＋":"−";
  };
  $("#chatMessages").onclick=function(e){var b=e.target.closest("[data-chat-delete]");if(b)deleteChatMessage(b.dataset.chatDelete)};
  $("#chatForm").onsubmit=function(e){e.preventDefault();sendChat($("#chatInput").value)};
  $("#inviteBtn").onclick=async function(){
    try{await navigator.clipboard.writeText(location.href);toast("초대 링크를 복사했습니다.")}
    catch(e){toast("주소창의 링크를 복사해 친구에게 보내 주세요.")}
  };
  $("#zoomOutBtn").onclick=function(){setZoom(zoom-.12)};
  $("#zoomInBtn").onclick=function(){setZoom(zoom+.12)};
  $("#recenterBtn").onclick=recenter;
  $("#reactionBtn").onclick=function(){$("#reactionMenu").classList.toggle("hidden")};
  $("#fullscreenBtn").onclick=function(){
    if(!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();
    else if(document.exitFullscreen)document.exitFullscreen();
  };
  $("#interaction").onclick=function(){if(nearestRoom)showRoom(nearestRoom.id)};
  $$(".reaction-menu button").forEach(function(b){b.onclick=function(){showReaction(b.dataset.reaction)}});
  $$(".zone-label,.portal").forEach(function(b){
    b.style.left=""; b.style.top="";
    b.onclick=function(e){e.stopPropagation();showRoom(Number(b.dataset.room))};
  });
  ROOM_LIST.forEach(function(room){
    var p=$('.portal[data-room="'+room.id+'"]');
    if(p){p.style.left=room.doorX+"%";p.style.top=room.doorY+"%"}
  });

  /* 아날로그 스틱 */
  var stick=$("#stick"), knob=$("#stickKnob"), stickId=null;
  function stickMove(e){
    var r=stick.getBoundingClientRect();
    var dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    var max=r.width/2-14, d=Math.hypot(dx,dy);
    if(d>max){dx=dx/d*max;dy=dy/d*max;d=max}
    knob.style.transform="translate("+dx+"px,"+dy+"px)";
    stickInput.x=dx/max; stickInput.y=dy/max;
    if(Math.abs(stickInput.x)<.14&&Math.abs(stickInput.y)<.14){stickInput.x=0;stickInput.y=0}
  }
  stick.addEventListener("pointerdown",function(e){
    if(!overlay.classList.contains("hidden"))return;
    stickId=e.pointerId; stick.setPointerCapture(stickId); stickMove(e); e.preventDefault();
  });
  stick.addEventListener("pointermove",function(e){if(stickId===e.pointerId)stickMove(e)});
  ["pointerup","pointercancel","lostpointercapture"].forEach(function(t){
    stick.addEventListener(t,function(e){
      if(stickId!==e.pointerId)return;
      stickId=null; stickInput.x=0; stickInput.y=0; knob.style.transform="";
    });
  });

  /* 클릭·터치로 걸어가기 */
  world.addEventListener("click",function(e){
    var frame=e.target.closest("[data-world-view]");
    if(frame){e.stopPropagation();showExhibit(frame.dataset.worldView);return}
  });
  world.addEventListener("pointerdown",function(e){
    if(e.target.closest("button")||!overlay.classList.contains("hidden"))return;
    var r=world.getBoundingClientRect();
    walkTo((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);
  });

  var KEYMAP={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      if(!overlay.classList.contains("hidden"))closeModal();
      $("#reactionMenu").classList.add("hidden");
      return;
    }
    if(!overlay.classList.contains("hidden"))return;
    if(document.activeElement&&/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))return;
    var key=e.key.toLowerCase();
    if(key==="f"||key==="enter"){if(nearestRoom){e.preventDefault();showRoom(nearestRoom.id)}return}
    if(KEYMAP[key]){e.preventDefault();keysDown[KEYMAP[key]]=true;updateKeyInput()}
  });
  document.addEventListener("keyup",function(e){
    var key=e.key.toLowerCase();
    if(KEYMAP[key]){keysDown[KEYMAP[key]]=false;updateKeyInput()}
  });
  window.addEventListener("blur",function(){keysDown={};updateKeyInput();stickInput.x=0;stickInput.y=0});

  overlay.addEventListener("click",async function(e){
    if(e.target===overlay||e.target.closest("[data-close-modal]")){closeModal();return}
    var b;
    if((b=e.target.closest("[data-guide-room]"))){guideToRoom(Number(b.dataset.guideRoom));return}
    if((b=e.target.closest("[data-open-room]"))){showRoom(Number(b.dataset.openRoom));return}
    if((b=e.target.closest("[data-add-room]"))){showAddExhibit(Number(b.dataset.addRoom));return}
    if((b=e.target.closest("[data-browse]"))){showBrowse();return}
    if((b=e.target.closest("[data-view]"))){showExhibit(b.dataset.view);return}
    if((b=e.target.closest("[data-open-file]"))){openExhibitFile(b.dataset.openFile);return}
    if((b=e.target.closest("[data-publish]"))){
      var it=exhibitById(b.dataset.publish);
      if(it){await patchExhibit(it.id,{published:it.published===false});showAdminPanel()}
      return;
    }
    if((b=e.target.closest("[data-delete-exhibit]"))){deleteExhibit(b.dataset.deleteExhibit,modalState&&modalState.type==="admin");return}
    if((b=e.target.closest("[data-toggle-student]"))){toggleStudent(b.dataset.toggleStudent);return}
    if((b=e.target.closest("[data-delete-student]"))){deleteStudent(b.dataset.deleteStudent);return}
  });

  var resizeTimer=0;
  window.addEventListener("resize",function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){refreshRects();updateCamera(0)},120);
  });
  window.addEventListener("pagehide",function(){
    saveProfileLocal();
    if(presenceRef)presenceRef.remove().catch(function(){});
  });
  window.addEventListener("pageshow",function(){schedulePresence(true)});
  document.addEventListener("visibilitychange",function(){
    if(!document.hidden){schedulePresence(true)}
    if(document.hidden){keysDown={};updateKeyInput();stickInput.x=0;stickInput.y=0;saveProfileLocal()}
  });
  setInterval(function(){renderPresence()},20000);
  setInterval(function(){saveProfileLocal()},8000);
  if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches){
    $("#chatPanel").classList.add("collapsed");
    $("#chatToggleBtn").textContent="＋";
  }
}

/* ══════════ 시작 ══════════ */
async function boot(){
  $("#mapImage").src=assetUrl("assets/dokdo-museum-map.webp");
  bindControls();
  refreshRects();
  refresh(true);
  updateCamera(0);
  placeAvatar();
  if(!atlasReady)spriteWaiters.push(function(){updateProfileUI();refresh(false)});
  requestAnimationFrame(loop);
  try{await initFirebase()}
  catch(e){console.warn(e);setSyncStatus("error","서버 연결 안 됨 · 눌러서 확인",e)}
  $("#loadingScreen").style.opacity="0";
  setTimeout(function(){$("#loadingScreen").classList.add("hidden")},380);
  if(!profile.name)setTimeout(function(){showProfile()},260);
  else if(cloud.ready){try{await registerProfile()}catch(e){}}
}
boot();
})();
