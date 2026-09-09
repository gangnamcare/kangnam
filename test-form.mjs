// Isolated controller checks. No real personal information or network requests.
import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/app.js','utf8');
function fixture(endpoint,response,values={name:'테스트',phone:'010-0000-0000',service:'home-care',region:'테스트',grade:'잘 모르겠음',consent:'on'}){
 const el=()=>({attrs:{},textContent:'',value:'',className:'',disabled:false,hidden:true,events:{},classList:{toggle(){},remove(){},contains(){return false;}},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},removeAttribute(k){delete this.attrs[k];},addEventListener(k,f){this.events[k]=f;},focus(){this.focused=true;}});
 const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,el());return nodes.get(s);};
 const form=get('#contact-form');form.dataset={endpoint};form.elements=Object.fromEntries(['name','phone','service','region','grade','consent','message'].map(n=>[n,get('#'+n)]));form.querySelector=s=>get(s);form.querySelectorAll=()=>[get('#grade')];form.reset=()=>{form.didReset=true;};
 const dialog=get('#phone-dialog');dialog.querySelector=get;const document={querySelector:get,querySelectorAll(){return [];},getElementById:get,addEventListener(){}};
 let fetches=0;const sandbox={document,location:{search:'?service=home-care',pathname:'/contact'},URLSearchParams,FormData:class{*[Symbol.iterator](){yield* Object.entries(values);}},AbortController,setTimeout:f=>{f();return 1;},clearTimeout(){},fetch:async()=>{fetches++;if(response instanceof Error)throw response;return response;}};
 vm.runInNewContext(source,sandbox);return {form,get,async submit(){await form.events.submit({preventDefault(){}});return get('#form-status').textContent;},get fetches(){return fetches;}};
}
let f=fixture('',null);assert.match(await f.submit(),/접수되지 않았/);assert.equal(f.fetches,0);assert.equal(f.form.didReset,undefined);
f=fixture('/test',new Error('offline'));assert.match(await f.submit(),/전송 결과를 확인하지 못/);assert.equal(f.get('.submit').disabled,false);
f=fixture('/test',{ok:false});assert.match(await f.submit(),/전송 결과를 확인하지 못/);
f=fixture('/test',{ok:true,json:async()=>({accepted:true})});assert.match(await f.submit(),/전송 결과를 확인하지 못/);assert.equal(f.form.didReset,undefined);
f=fixture('/test',{ok:true,json:async()=>({accepted:true,receiptId:'test-receipt'})});assert.match(await f.submit(),/상담이 접수되었습니다/);assert.equal(f.form.didReset,true);
f=fixture('/test',null,{name:'',phone:'123',service:'',region:'',grade:'',consent:''});assert.match(await f.submit(),/올바르지 않은 항목/);assert.equal(f.fetches,0);
console.log('PASS: disconnected/no transmission, offline, HTTP error, missing receipt, confirmed receipt, invalid input. No live submissions.');
