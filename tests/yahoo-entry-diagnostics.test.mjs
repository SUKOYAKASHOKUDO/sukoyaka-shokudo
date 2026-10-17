import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { yahooEntryDiagnostics } from '../lib/yahooEntryDiagnostics.ts';

const FLAG = 'sukoyaka:entry-diagnostic:consent:v1';
const LOG = 'sukoyaka:entry-diagnostic:log:v1';
const TTL = 1800000, MAX_BYTES = 160 * 1024, START = 1800000000000;
const consent = now => JSON.stringify({version:1, enabledAt:now, expiresAt:now+TTL});

function environment({now=START, data=new Map(), enabled=true, management=false, pathname='/',
  search=management?'?entry-diagnostics=manage':'', blocked=false, quota=false,
  missingElements=false, missingViewport=false, missingNavigation=false, removeBlocked=false}={}) {
  if (enabled && !data.has(FLAG)) data.set(FLAG,consent(now));
  let time=now, id=0;
  const listeners=new Map(), frames=new Map(), timers=new Map();
  const reads={rect:0,style:0,storage:[],mutations:0,network:0};
  const state={top:0,scrollY:0,scrollTop:0,viewportTop:0,height:844};
  const eventTarget=owner=>({
    addEventListener(event,callback,options){const key=owner+':'+event;const list=listeners.get(key)||[];list.push({callback,options});listeners.set(key,list);},
    removeEventListener(event,callback){const key=owner+':'+event;listeners.set(key,(listeners.get(key)||[]).filter(l=>l.callback!==callback));}
  });
  const el=Object.freeze({get scrollTop(){return state.scrollTop;},getBoundingClientRect(){reads.rect++;return {top:state.top,left:0,width:390,height:157,bottom:state.top+157};}});
  const viewport=missingViewport?null:{...eventTarget('viewport'),get offsetTop(){return state.viewportTop;},get pageTop(){return state.scrollY+state.viewportTop;},width:390,get height(){return state.height;},scale:1};
  const storage={getItem(k){reads.storage.push(k);return data.get(k)??null;},setItem(k,v){if(quota)throw Error('quota');data.set(k,v);},removeItem(k){if(removeBlocked)throw Error('blocked-remove');data.delete(k);}};
  const document={...eventTarget('document'),readyState:'loading',visibilityState:'visible',documentElement:el,body:el,scrollingElement:el,
    referrer:'https://search.yahoo.co.jp/search?p=SEARCH_SECRET',querySelector:()=>missingElements?null:el};
  for(const key of ['cookie','URL','forms'])Object.defineProperty(document,key,{get(){throw Error('Forbidden read: '+key);}});
  const window={...eventTarget('window'),get scrollY(){return state.scrollY;},innerWidth:390,innerHeight:844,visualViewport:viewport};
  Object.defineProperty(window,'localStorage',{get(){if(blocked)throw Error('blocked');return storage;}});
  const forbidden=()=>{reads.mutations++;throw Error('Forbidden mutation or transport');};
  const sandbox={window,document,location:{pathname,search,hash:'',origin:'https://www.sukoyaka-shokudo.com',reload:forbidden},
    history:Object.freeze({scrollRestoration:'auto'}),URLSearchParams,URL,TextEncoder,
    Date:class extends Date{static now(){return time;}},performance:{now:()=>time-now,getEntriesByType:missingNavigation?undefined:()=>[{
      name:'https://private.invalid/URL_SECRET',type:'navigate',redirectCount:0,redirectStart:0,redirectEnd:0,activationStart:0,
      domInteractive:12,toJSON:forbidden,privateValue:'NAV_SECRET'}]},
    requestAnimationFrame:callback=>{const n=++id;frames.set(n,callback);return n;},cancelAnimationFrame:n=>frames.delete(n),
    setTimeout:(callback,delay)=>{const n=++id;timers.set(n,{callback,due:time+delay});return n;},clearTimeout:n=>timers.delete(n),
    getComputedStyle:()=>{reads.style++;return {scrollBehavior:'smooth'};},fetch:forbidden,XMLHttpRequest:forbidden,
    navigator:{sendBeacon:forbidden},setInterval:forbidden};
  window.scrollTo=forbidden;
  vm.runInNewContext(yahooEntryDiagnostics,sandbox);
  const fire=(owner,event,detail={})=>{
    for(const l of [...(listeners.get(owner+':'+event)||[])]){
      if(l.options?.once)listeners.set(owner+':'+event,(listeners.get(owner+':'+event)||[]).filter(x=>x!==l));
      l.callback(detail);
    }
  };
  const flush=()=>{let n=0;while(frames.size){if(++n>30)throw Error('Polling loop');const [key,fn]=frames.entries().next().value;frames.delete(key);fn();}};
  const advance=(ms,runTimers=true)=>{time+=ms;if(runTimers){for(const [key,timer] of [...timers])if(timer.due<=time){timers.delete(key);timer.callback();}}};
  const countListeners=()=>[...listeners.values()].reduce((n,list)=>n+list.length,0);
  return {window,document,sandbox,data,reads,state,listeners,frames,timers,fire,flush,advance,countListeners,
    get controller(){return window.__sukoyakaEntryDiagnostic;},manager:window.__sukoyakaEntryManager,
    log:()=>data.has(LOG)?JSON.parse(data.get(LOG)):null};
}

test('inactive, expired, invalid and non-home visits have no instrumentation, geometry, timers or logs',()=>{
  const cases=[{enabled:false},{data:new Map([[FLAG,consent(START-TTL)]])},{data:new Map([[FLAG,'invalid']])},
    {data:new Map([[FLAG,JSON.stringify({version:1,enabledAt:START,expiresAt:START+TTL+1})]])},{pathname:'/about'}];
  for(const options of cases){const e=environment(options);assert.equal(e.controller,undefined);assert.equal(e.manager,undefined);assert.equal(e.countListeners(),0);assert.equal(e.reads.rect,0);assert.equal(e.reads.style,0);assert.equal(e.timers.size,0);assert.equal(e.log(),null);}
});

test('opening management does not enable diagnosis or measure; deliberate enable arms ordinary root in new documents',()=>{
  const data=new Map([['unrelated','PRIVATE_STORAGE_SECRET']]);
  const m=environment({enabled:false,management:true,data});assert.ok(m.manager);assert.equal(m.manager.read().enabled,false);assert.equal(m.countListeners(),0);assert.equal(m.reads.rect,0);assert.equal(data.has(FLAG),false);
  const status=m.manager.enable();assert.equal(status.enabled,true);assert.equal(status.expiresAt,START+TTL);assert.equal(m.log(),null);
  const a=environment({enabled:false,data});assert.ok(a.controller);assert.equal(a.log().lastDocument,1);assert.equal(a.log().events[0].event,'head');
  a.fire('window','pagehide',{persisted:true});const b=environment({enabled:false,data});assert.equal(b.log().lastDocument,2);
  assert.equal(data.get('unrelated'),'PRIVATE_STORAGE_SECRET');assert.ok(!a.reads.storage.includes('unrelated'));
});

test('30 minute expiry cancels frames, removes every diagnostic listener and stops records',()=>{
  const e=environment();e.fire('window','pageshow',{persisted:false});assert.ok(e.frames.size);e.advance(TTL);
  assert.equal(e.controller,undefined);assert.equal(e.countListeners(),0);assert.equal(e.frames.size,0);assert.equal(e.timers.size,0);assert.equal(e.data.has(FLAG),false);assert.equal(e.data.has(LOG),false);
  e.fire('window','resize');assert.equal(e.log(),null);
});

test('BFCache pageshow and record-time checks expire even when background timers never ran',()=>{
  for(const trigger of ['pageshow','resize']){
    const e=environment();e.advance(TTL+1,false);e.fire('window',trigger,{persisted:true});e.flush();
    assert.equal(e.controller,undefined);assert.equal(e.countListeners(),0);assert.equal(e.log(),null);
  }
});

test('storage denied or full fails closed without exceptions, display mutation or transport',()=>{
  for(const options of [{blocked:true},{quota:true}]){
    const e=environment(options);assert.equal(e.controller,undefined);assert.equal(e.countListeners(),0);assert.equal(e.reads.mutations,0);
    const m=environment({...options,management:true,enabled:false});assert.equal(m.manager.enable().storageAvailable,false);assert.equal(m.countListeners(),0);
  }
  const m=environment({management:true,removeBlocked:true});assert.equal(m.manager.stop().storageAvailable,false);assert.equal(m.manager.clear().storageAvailable,false);
});

test('passive pointer snapshots distinguish last observation, capture, release and both animation frames',()=>{
  const e=environment();assert.equal(e.reads.rect,0);assert.equal(e.reads.style,0);e.document.readyState='complete';
  e.fire('window','pageshow',{persisted:true});e.flush();const prior=e.log().events.at(-1).sequence;
  const down=e.listeners.get('document:pointerdown')[0];assert.equal(down.options.capture,true);assert.equal(down.options.passive,true);
  e.fire('document','pointerdown',{pointerId:1,pointerType:'touch',target:{}});
  e.state.viewportTop=24;e.state.top=-24;
  e.fire('document','pointerup',{pointerId:1,target:{}});e.flush();
  const entries=e.log().events;const a=entries.find(r=>r.event==='pointerdown:capture');
  assert.equal(a.tap.lastObservedBeforeSequence,prior);assert.equal(a.boxes.header.top,0);
  for(const event of ['pointerup:after','pointerup:rAF1','pointerup:rAF2']){
    const r=entries.find(r=>r.event===event);assert.equal(r.tap.downSequence,a.sequence);assert.equal(r.boxes.header.top,-24);assert.equal(r.viewport.offsetTop,24);
  }
  assert.equal(entries.find(r=>r.event==='pageshow').persisted,true);assert.equal(e.reads.mutations,0);
});

test('lifecycle and effect markers stay distinct from hydration completion; missing APIs/elements are null',()=>{
  const e=environment({missingElements:true,missingViewport:true,missingNavigation:true});
  e.fire('document','DOMContentLoaded');e.fire('window','load');e.fire('document','freeze');e.fire('document','resume');
  e.controller.capture('route-layout-effect:before');e.controller.capture('route-layout-effect:after');e.fire('window','pagehide',{persisted:false});
  const rows=e.log().events;for(const name of ['head','DOMContentLoaded','load','freeze','resume','route-layout-effect:before','route-layout-effect:after'])assert.ok(rows.some(r=>r.event===name));
  assert.equal(rows.at(-1).boxes.header,null);assert.equal(rows.at(-1).viewport,null);assert.equal(rows.at(-1).navigation,null);assert.equal(rows.at(-1).persisted,false);
  assert.ok(!rows.some(r=>/hydrated|hydration-complete/.test(r.event)));
});

test('records and UTF-8 encoded persisted envelope respect both limits',()=>{
  const e=environment();for(let i=0;i<700;i++)e.fire('window','resize');e.fire('window','pagehide',{persisted:false});
  assert.ok(e.log().events.length<=160);assert.ok(Buffer.byteLength(e.data.get(LOG),'utf8')<=MAX_BYTES);
  const huge={version:1,enabledAt:START,expiresAt:START+TTL,lastDocument:1,events:[],private:'あ'.repeat(60000)};
  const raw=JSON.stringify(huge);assert.ok(raw.length<MAX_BYTES);assert.ok(Buffer.byteLength(raw,'utf8')>MAX_BYTES);
  e.data.set(LOG,raw);const m=environment({management:true,data:e.data});assert.equal(m.manager.read().events,0);assert.equal(e.data.has(LOG),false);
});

test('privacy allowlist drops URL, search, cookie-like and arbitrary persisted fields',()=>{
  const e=environment({search:'?private=QUERY_SECRET'});e.fire('window','load');
  const log=e.log();log.private='COOKIE_SECRET';log.events[0].url='URL_SECRET';log.events[0].tap={id:1,kind:'INPUT_SECRET',pointerType:'USER_AGENT_SECRET',target:'HTML_SECRET'};
  log.events[0].navigation={type:'navigate',name:'REFERRER_SECRET',redirectCount:0,toJSON:'STATE_SECRET'};
  log.events[0].boxes.header={top:0,left:0,width:1,height:1,bottom:1,text:'FORM_SECRET'};
  e.data.set(LOG,JSON.stringify(log));const m=environment({management:true,data:e.data});const report=m.manager.read().report;
  for(const token of ['SEARCH_SECRET','QUERY_SECRET','COOKIE_SECRET','URL_SECRET','NAV_SECRET','INPUT_SECRET','USER_AGENT_SECRET','HTML_SECRET','REFERRER_SECRET','STATE_SECRET','FORM_SECRET'])assert.ok(!report.includes(token),token);
  assert.equal(JSON.parse(report).events[0].referrer,'Yahoo');assert.equal(e.reads.mutations,0);
  assert.equal(yahooEntryDiagnostics.includes('.toJSON('),false);
  assert.doesNotMatch(yahooEntryDiagnostics,/\b(fetch|sendBeacon|XMLHttpRequest|setInterval|scrollTo|scrollIntoView)\s*\(/);
  assert.doesNotMatch(yahooEntryDiagnostics,/\.scrollTop\s*=|\.scrollRestoration\s*=|\.style\s*[.=]|beforeunload|['"]unload['"]/);
});

test('management stop and delete terminate other open pages through storage events; no log resurrection',()=>{
  const e=environment();const m=environment({management:true,data:e.data});
  assert.equal(m.manager.stop().enabled,false);e.fire('window','storage',{key:FLAG});assert.equal(e.countListeners(),0);assert.equal(e.controller,undefined);
  assert.ok(m.manager.read().events>0);const r=m.manager.clear();assert.equal(r.events,0);assert.equal(r.enabled,false);e.fire('window','pagehide');e.flush();assert.equal(e.log(),null);
});

test('a stopped BFCache document cannot resume from a new consent session',()=>{
  const e=environment();const m=environment({management:true,data:e.data});m.manager.stop();m.advance(1);m.manager.enable();
  e.fire('window','pageshow',{persisted:true});e.flush();assert.equal(e.controller,undefined);assert.equal(e.log(),null);
  const fresh=environment({enabled:false,data:e.data,now:START+1});assert.ok(fresh.controller);assert.equal(fresh.log().lastDocument,1);
});

test('separate storage profiles remain unmeasured; unrelated storage events and private values are ignored',()=>{
  const m=environment({management:true,enabled:false});m.manager.enable();const isolated=environment({enabled:false});assert.equal(isolated.controller,undefined);assert.equal(isolated.log(),null);
  const e=environment();const before=e.reads.storage.length;e.fire('window','storage',{key:'unrelated',newValue:'STORAGE_SECRET'});assert.equal(e.reads.storage.length,before);
});

test('scroll events coalesce without polling; interior route markers detach without changing scroll policy',()=>{
  const e=environment();for(let i=0;i<500;i++)e.fire('window','scroll');assert.equal(e.frames.size,1);e.flush();assert.equal(e.frames.size,0);
  e.sandbox.location.pathname='/about';e.controller.capture('route-layout-effect:before');assert.equal(e.countListeners(),0);assert.equal(e.controller,undefined);
  assert.equal(e.sandbox.history.scrollRestoration,'auto');assert.equal(e.reads.mutations,0);
});
