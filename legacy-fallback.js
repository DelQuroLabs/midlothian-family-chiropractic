'use strict';
if(location.pathname.endsWith('/index.php')){const q=new URLSearchParams(location.search);const target=q.get('privacy')==='website'?'privacy/':q.get('p')==='371086'?'about-us/':'';location.replace(new URL(target,new URL('./',document.currentScript.src)).href);}
