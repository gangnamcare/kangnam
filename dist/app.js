(()=>{
const nav=document.querySelector('#navigation'),toggle=document.querySelector('.menu-toggle');
const triggers=[...document.querySelectorAll('.nav-trigger')];
function closeSub(){triggers.forEach(b=>{b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true;});}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('is-open',open);if(!open)closeSub();});
triggers.forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';closeSub();b.setAttribute('aria-expanded',String(open));document.getElementById(b.getAttribute('aria-controls')).hidden=!open;}));
document.addEventListener('click',e=>{if(!e.target.closest('.header')){closeSub();nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','메뉴 열기');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const expanded=triggers.find(b=>b.getAttribute('aria-expanded')==='true');if(expanded){closeSub();expanded.focus();}else if(nav.classList.contains('is-open')){toggle.click();toggle.focus();}}});
const phoneDialog=document.querySelector('#phone-dialog');
document.querySelectorAll('[data-phone]').forEach(b=>b.addEventListener('click',()=>phoneDialog.showModal()));
phoneDialog.querySelector('.dialog-close').addEventListener('click',()=>phoneDialog.close());
phoneDialog.addEventListener('click',e=>{if(e.target===phoneDialog){const r=phoneDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)phoneDialog.close();}});
document.querySelectorAll('a[href]').forEach(a=>{if(a.getAttribute('href')===location.pathname.replace(/\/$/,'')&&location.pathname!=='/')a.setAttribute('aria-current','page');});
document.querySelectorAll('[data-copy-address]').forEach(button=>button.addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try {if(!button.dataset.copyAddress||!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(button.dataset.copyAddress);status.textContent='주소를 복사했습니다.';}
 catch {status.textContent='주소를 복사하지 못했습니다. 위 주소를 선택해 직접 복사해 주세요.';}
}));
const form=document.querySelector('#contact-form');if(!form)return;
const chosen=new URLSearchParams(location.search).get('service');
if(['home-care','live-in-care','equipment'].includes(chosen))form.elements.service.value=chosen;
const endpoint=form.dataset.endpoint;
if(endpoint){document.querySelector('#connection-notice').innerHTML='<strong>온라인 상담 안내</strong><p>입력 내용은 동의 후 상담 담당자에게 전달됩니다.</p>';form.querySelector('.submit').textContent='상담 신청';}
const setError=(name,msg)=>{const e=document.querySelector('#'+name+'-error');if(e)e.textContent=msg;const els=name==='grade'?[...form.querySelectorAll('[name="grade"]')]:[form.elements[name]];els.forEach(el=>{if(el)el.setAttribute('aria-invalid',msg?'true':'false');});};
const labels={name:'신청자 이름을 입력해 주세요.',phone:'연락처를 입력해 주세요.',service:'희망 서비스를 선택해 주세요.',region:'이용 지역을 입력해 주세요.',grade:'장기요양등급 여부를 선택해 주세요.',consent:'개인정보 수집·이용 동의 항목을 확인해 주세요.'};
form.addEventListener('input',e=>{if(e.target.name)setError(e.target.name,'');});
form.addEventListener('change',e=>{if(e.target.name)setError(e.target.name,'');});
form.addEventListener('submit',async e=>{
 e.preventDefault();const status=document.querySelector('#form-status');status.className='';status.textContent='';const values=Object.fromEntries(new FormData(form));let first=null;
 for(const [name,msg] of Object.entries(labels)){let err=!String(values[name]||'').trim()?msg:'';if(name==='phone'&&!err&&!/^(?:01[016789]\d{7,8}|02\d{7,8}|0[3-6][1-5]\d{7,8}|070\d{8})$/.test(values.phone.replace(/[\s-]/g,'')))err='올바른 국내 연락처를 입력해 주세요. 예: 010-1234-5678';setError(name,err);if(err&&!first)first=name;}
 if(first){status.textContent='입력하지 않았거나 올바르지 않은 항목을 확인해 주세요.';(first==='grade'?document.querySelector('#grade'):form.elements[first]).focus();return;}
 const submit=form.querySelector('.submit');const old=submit.textContent;submit.disabled=true;submit.textContent=endpoint?'전송 중…':'입력 내용 확인 중…';form.setAttribute('aria-busy','true');
 try{
  if(!endpoint){await new Promise(r=>setTimeout(r,250));status.textContent='입력 항목을 확인했습니다. 현재 접수 기능이 연결되지 않아 상담은 접수되지 않았으며, 입력 내용은 전송·저장되지 않았습니다.';return;}
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
  try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values),signal:ctrl.signal,credentials:'same-origin'});if(!r.ok)throw new Error('request failed');const data=await r.json();if(data.accepted!==true||typeof data.receiptId!=='string'||!data.receiptId.trim())throw new Error('unconfirmed');status.className='success';status.textContent='상담이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';form.reset();}finally{clearTimeout(timer);}
 }catch{status.textContent='전송 결과를 확인하지 못했습니다. 접수 완료 여부를 확인할 수 없으니 연결 상태를 확인하고 상담 담당자에게 문의해 주세요.';}
 finally{submit.disabled=false;submit.textContent=old;form.removeAttribute('aria-busy');status.focus();}
});
})();
