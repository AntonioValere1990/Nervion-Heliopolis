const views=[...document.querySelectorAll('.view')];
function openView(name){
  views.forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  window.scrollTo({top:0,behavior:'instant'});
}
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>openView(el.dataset.view)));

// Evita que una versión antigua de la PWA bloquee el rediseño actual.
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});
  if('caches' in window){caches.keys().then(keys=>keys.forEach(k=>caches.delete(k))).catch(()=>{});}
}

const audio=document.querySelector('#player');
const mini=document.querySelector('#miniPlayer');
const miniTitle=document.querySelector('#miniTitle');
const miniToggle=document.querySelector('#miniToggle');
function playEpisode(src,title){
  audio.src=src; miniTitle.textContent=title; mini.hidden=false; audio.play(); miniToggle.textContent='❚❚';
}
document.querySelectorAll('[data-audio]').forEach(el=>el.addEventListener('click',()=>playEpisode(el.dataset.audio,el.dataset.title||'Nervión & Heliópolis')));
miniToggle?.addEventListener('click',()=>{if(audio.paused){audio.play();miniToggle.textContent='❚❚'}else{audio.pause();miniToggle.textContent='▶'}});
audio?.addEventListener('ended',()=>miniToggle.textContent='▶');
