import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { homeFlowDiagnostics } from '../lib/homeFlowDiagnostics.ts';
import { homePreviewPolicy, getHomePreviewMode } from '../lib/homePreviewPolicy.ts';

function environment({ pathname='/', search='?home-debug=1', data=new Map(), unavailable=false, policy=true }={}) {
  const listeners=new Map(), frames=[], styles=[], state={top:0,viewportTop:0,scrollY:0};
  const listen=owner=>(event,callback,options)=>{const key=owner+':'+event;const a=listeners.get(key)||[];a.push({callback,options});listeners.set(key,a);};
  const element=Object.freeze({scrollTop:0,scrollLeft:0,scrollHeight:2000,clientHeight:900,
    getBoundingClientRect:()=>({top:state.top,bottom:900+state.top,left:0,width:390,height:900})});
  const viewport={get offsetTop(){return state.viewportTop;},offsetLeft:0,pageTop:0,width:390,height:900,scale:1,addEventListener:listen('viewport')};
  const sessionStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
  const window={get scrollY(){return state.scrollY;},outerHeight:950,visualViewport:viewport,addEventListener:listen('window')};
  Object.defineProperty(window,'sessionStorage',{get(){if(unavailable)throw Error('blocked');return sessionStorage;}});
  const document={readyState:'loading',visibilityState:'visible',wasDiscarded:false,documentElement:element,body:element,
    scrollingElement:{tagName:'HTML',scrollTop:0},querySelector:()=>element,addEventListener:listen('document'),
    createElement:()=>({textContent:''}),head:{appendChild:e=>styles.push(e.textContent)}};
  for(const name of ['cookie','referrer','URL'])Object.defineProperty(document,name,{get(){throw Error('Private data read');}});
  const sandbox={window,document,location:{pathname,search},URLSearchParams,Date,history:{scrollRestoration:'auto'},
    innerWidth:390,innerHeight:900,performance:{now:()=>1,getEntriesByType:()=>[{type:'back_forward'}]},
    requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},
    getComputedStyle:()=>({scrollBehavior:styles.length?'auto':'smooth',position:'static',transform:'none',overflowX:'visible',overflowY:'visible'})};
  if(policy) vm.runInNewContext(homePreviewPolicy,sandbox);
  vm.runInNewContext(homeFlowDiagnostics,sandbox);
  const fire=(owner,event,data={})=>{for(const l of listeners.get(owner+':'+event)||[])l.callback(data);};
  const flush=()=>{let count=0;while(frames.length){if(++count>30)throw Error('Unbounded animation loop');frames.shift()();}};
  return {window,sandbox,document,state,listeners,styles,data,fire,flush,d:window.__sukoyakaHomeFlow};
}

test('instrumentation requires explicit homepage opt-in and ignores unsupported parameters',()=>{
  assert.equal(environment({search:''}).d,undefined);
  assert.equal(environment({pathname:'/schedule'}).d,undefined);
  assert.equal(environment({search:'?home-debug=1&home-test=unknown'}).d.experiment,'baseline');
});

test('baseline reads layout without scroll, network, timers, cookies, or browsing metadata',()=>{
  const e=environment({search:'?home-debug=1&private=SECRET_VALUE'});Object.freeze(e.sandbox.history);
  e.fire('window','pageshow',{persisted:true});e.flush();
  assert.equal(e.sandbox.history.scrollRestoration,'auto');assert.equal(e.styles.length,0);
  assert.ok(e.d.entries.some(x=>x.event==='requestAnimationFrame:2'));
  assert.equal(e.d.entries.find(x=>x.event==='pageshow').detail.persisted,true);
  const s=JSON.stringify(e.d.report());assert.ok(!s.includes('SECRET_VALUE'));assert.ok(!s.includes('userAgent'));
  assert.equal('scrollTo' in e.window,false);assert.equal('fetch' in e.sandbox,false);assert.equal('setInterval' in e.sandbox,false);
});

test('capture-phase pointer snapshots preserve pre-default state and quantify later viewport/DOM changes',()=>{
  const e=environment();const down=e.listeners.get('document:pointerdown')[0];assert.equal(down.options.capture,true);assert.equal(down.options.passive,true);
  e.fire('document','pointerdown',{pointerId:7,pointerType:'touch',target:{}});
  e.state.top=-24;e.state.viewportTop=24;
  e.fire('document','pointerup',{pointerId:7,target:{}});e.flush();
  const r=e.d.report(),pair=r.tapComparisons[0];assert.equal(pair.delta['header.top'],-24);assert.equal(pair.delta['visualViewport.offsetTop'],24);assert.equal(pair.delta.scrollY,0);
  assert.equal(r.inputCoverage.pagePointerDown,1);assert.equal(r.inputCoverage.status,'page-pointer-observed');
});

test('missing page pointer events are reported as unobserved, not invented app-side taps',()=>{
  const e=environment();e.fire('window','pageshow',{persisted:true});e.flush();
  assert.equal(e.d.report().inputCoverage.status,'no-page-pointer-observed');assert.equal(e.d.report().inputCoverage.pagePointerDown,0);
});

test('page reuse, hidden/visible, focus, viewport and freeze/resume events are captured without correction',()=>{
  const e=environment();e.fire('window','pagehide',{persisted:true});e.document.visibilityState='hidden';e.fire('document','visibilitychange');
  e.document.visibilityState='visible';e.fire('document','visibilitychange');e.fire('window','focus');e.fire('viewport','resize');e.fire('viewport','scroll');e.fire('document','freeze');e.fire('document','resume');e.flush();
  for(const name of ['pagehide','visibilitychange','focus','visualViewport:resize','freeze','resume'])assert.ok(e.d.entries.some(x=>x.event===name),name);
  assert.ok(e.d.entries.some(x=>x.event==='scroll'&&x.detail.sources.includes('visualViewport')));assert.equal(e.state.scrollY,0);
});

test('session records survive re-entry, expire, isolate tabs, and clear only their own key',()=>{
  const a=environment();a.fire('window','pagehide',{persisted:true});
  const b=environment({data:a.data});assert.equal(b.d.report().documentId,2);assert.ok(b.d.entries.some(x=>x.documentId===1));
  const c=environment({data:new Map()});assert.equal(c.d.report().documentId,1);
  a.data.set('unrelated','keep');b.d.clear();assert.equal(a.data.get('unrelated'),'keep');assert.equal(b.d.entries.length,0);
  a.d.persist();const key=[...a.data.keys()].find(k=>k.endsWith('baseline'));const old=JSON.parse(a.data.get(key));old.savedAt=Date.now()-3600001;a.data.set(key,JSON.stringify(old));
  assert.equal(environment({data:a.data}).d.report().documentId,1);
});

test('storage restrictions use bounded memory; coalesced scroll cannot erase all lifecycle evidence',()=>{
  const e=environment({unavailable:true});e.fire('window','pageshow',{persisted:true});e.flush();
  for(let i=0;i<1000;i++)e.fire('window','scroll');assert.equal(e.d.entries.filter(x=>x.event==='scroll').length,0);e.flush();
  assert.equal(e.d.entries.filter(x=>x.event==='scroll').length,1);
  for(let i=0;i<1000;i++)e.d.capture('scroll',{},true);
  assert.equal(e.d.entries.length,400);assert.ok(e.d.entries.some(x=>x.event==='pageshow'));e.d.persist();assert.equal(e.d.report().storage,'unavailable');
});

test('export pauses sampling without changing document state',()=>{
 const b=environment(); const n=b.d.entries.length;b.d.pause();b.d.capture('hidden-export-ui');assert.equal(b.d.entries.length,n);b.d.resume();assert.equal(b.d.entries.at(-1).event,'export-closed');
});

test('comparison controls work without instrumentation and change one variable only',()=>{
  const manual=environment({search:'?home-test=manual'});
  assert.equal(manual.d,undefined);
  assert.equal(manual.sandbox.history.scrollRestoration,'manual');
  assert.equal(manual.styles.length,0);
  assert.equal(manual.state.scrollY,0);
  const instant=environment({search:'?home-test=instant'});
  assert.equal(instant.d,undefined);
  assert.equal(instant.sandbox.history.scrollRestoration,'auto');
  assert.equal(instant.styles.length,1);
  assert.ok(instant.styles[0].includes('html:has([data-home-root])'));
  for(const sample of [manual,instant]) {
    assert.equal('scrollTo' in sample.window,false);
    assert.equal('fetch' in sample.sandbox,false);
    assert.equal('setTimeout' in sample.sandbox,false);
    assert.equal('setInterval' in sample.sandbox,false);
  }
});

test('unsupported modes and other routes remain inert; client mode matches the head policy',()=>{
  for(const search of ['', '?home-test=unknown', '?home-test=manual-instant']) {
    const e=environment({search});
    assert.equal(e.sandbox.history.scrollRestoration,'auto');
    assert.equal(e.styles.length,0);
    assert.equal(getHomePreviewMode('/',search),'baseline');
  }
  for(const mode of ['manual','instant']) {
    const search='?home-test='+mode;
    assert.equal(getHomePreviewMode('/',search),mode);
    const other=environment({pathname:'/schedule',search});
    assert.equal(getHomePreviewMode('/schedule',search),'baseline');
    assert.equal(other.sandbox.history.scrollRestoration,'auto');
    assert.equal(other.styles.length,0);
    const sample=environment({search:search+'&home-debug=1'});
    assert.equal(sample.d.report().experiment,mode);
    assert.equal(sample.d.entries[0].restoration,mode==='manual'?'manual':'auto');
  }
});

test('comparison records do not mix with existing baseline or other mode records',()=>{
  const data=new Map();
  for(const mode of ['baseline','manual','instant']) {
    const e=environment({data,search:'?home-debug=1&home-test='+mode});
    assert.equal(e.d.report().documentId,1);e.d.persist();
  }
  const repeat=environment({data,search:'?home-debug=1&home-test=manual'});
  assert.equal(repeat.d.report().documentId,2);
  assert.equal(repeat.d.report().experiment,'manual');
  repeat.d.clear();assert.equal(data.size,2);
});
