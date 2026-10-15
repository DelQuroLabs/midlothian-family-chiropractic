'use strict';
// Clip the preview watermark around photos and interactive controls. Clip paths
// also keep the linked watermark from intercepting clicks in those areas.
(()=>{
  const overlay=document.querySelector('.preview-diagonal-watermark');
  const frame=document.querySelector('.preview-page-frame');
  if(!overlay||!frame)return;
  const logo=overlay.querySelector('.preview-watermark-logo');
  const protectedNodes=[...frame.querySelectorAll('img,a,button,input,textarea,select,summary,h1,h2,.header,.mobile-contact')];
  let queued=false;
  function subtract(area,hole){
    const left=Math.max(area.left,hole.left),right=Math.min(area.right,hole.right);
    const top=Math.max(area.top,hole.top),bottom=Math.min(area.bottom,hole.bottom);
    if(left>=right||top>=bottom)return[area];
    const result=[];
    if(top>area.top)result.push({...area,bottom:top});
    if(bottom<area.bottom)result.push({...area,top:bottom});
    if(left>area.left)result.push({left:area.left,right:left,top,bottom});
    if(right<area.right)result.push({left:right,right:area.right,top,bottom});
    return result;
  }
  function update(){
    queued=false;
    const width=innerWidth,height=innerHeight;
    let areas=[{left:0,top:0,right:width,bottom:height}];
    for(const node of protectedNodes){
      const r=node.getBoundingClientRect();
      if(!r.width||!r.height||r.bottom<0||r.top>height||r.right<0||r.left>width)continue;
      const padding=node.tagName==='IMG'?16:5;
      const hole={left:r.left-padding,right:r.right+padding,top:r.top-padding,bottom:r.bottom+padding};
      areas=areas.flatMap(area=>subtract(area,hole));
    }
    const shape=areas.map(r=>`M${r.left} ${r.top}H${r.right}V${r.bottom}H${r.left}Z`).join('');
    const clip=`path("${shape}")`;
    // Unsupported clipping leaves only the accessible footer attribution link.
    if(!CSS.supports('clip-path',clip)){overlay.style.visibility='hidden';return;}
    overlay.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const logoWidth=Math.min(width*.84,1000,height*.8*800/494);
    const logoHeight=logoWidth*494/800;
    logo.setAttribute('x',(width-logoWidth)/2);
    logo.setAttribute('y',(height-logoHeight)/2);
    logo.setAttribute('width',logoWidth);
    logo.setAttribute('height',logoHeight);
    logo.setAttribute('transform',`rotate(-25 ${width/2} ${height/2})`);
    overlay.style.clipPath=clip;
    overlay.style.visibility='visible';
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  frame.addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  frame.addEventListener('load',schedule,true);
  frame.addEventListener('transitionend',schedule,true);
  frame.addEventListener('animationend',schedule,true);
  if('ResizeObserver'in window){const observer=new ResizeObserver(schedule);observer.observe(frame);protectedNodes.filter(n=>n.tagName==='IMG').forEach(n=>observer.observe(n));}
  document.fonts?.ready.then(schedule);
  schedule();
})();
