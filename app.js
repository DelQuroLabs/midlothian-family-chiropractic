'use strict';
const toggle=document.querySelector('.menu-toggle');
const nav=document.getElementById('mobile-nav');
function closeMenu(){nav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden){closeMenu();toggle.focus();}});
matchMedia('(min-width:1001px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const search=document.querySelector('[data-resource-search]');
const filters=document.querySelectorAll('[data-filter]');
let category='all';
function filterResources(){
  const query=search?.value.trim().toLocaleLowerCase()||'';
  let count=0;
  document.querySelectorAll('[data-resource-card]').forEach(card=>{const show=(category==='all'||card.dataset.category===category)&&card.textContent.toLocaleLowerCase().includes(query);card.hidden=!show;if(show)count++;});
  const status=document.querySelector('[data-search-status]');
  if(status)status.textContent=count+' '+(count===1?'guide':'guides');
  const empty=document.querySelector('[data-empty-state]');if(empty)empty.hidden=count>0;
}
search?.addEventListener('input',filterResources);
filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));filterResources();}));

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver'in window&&!reducedMotion.matches){
  document.documentElement.classList.add('js');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.06});
  document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el);}});
  reducedMotion.addEventListener('change',event=>{if(event.matches)document.querySelectorAll('.pending').forEach(el=>el.classList.remove('pending'));});
}
let ticking=false;
const previewFrame=document.querySelector('.preview-page-frame');
function updateProgress(){const height=previewFrame?previewFrame.scrollHeight-previewFrame.clientHeight:document.documentElement.scrollHeight-innerHeight;const position=previewFrame?previewFrame.scrollTop:scrollY;document.querySelector('.reading-progress').style.width=(height>0?Math.min(100,position/height*100):0)+'%';ticking=false;}
(previewFrame||window).addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}},{passive:true});
updateProgress();
