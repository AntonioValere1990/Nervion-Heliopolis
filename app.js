const EPISODES = [
  { title: "Lo que queda cuando se apaga el derbi", show: "Nervión & Heliópolis · T02 · E06", cover: "public/covers/portada.jpg", audio: "public/audio/nocturno.mp3" },
  { title: "Dos barrios, una misma luz", show: "Nervión & Heliópolis · T02 · E05", cover: "public/covers/ep-tejados.jpg", audio: "public/audio/golondrinas.mp3" },
  { title: "Dos cañas, mesa redonda", show: "Derbi · T01 · E03", cover: "public/covers/show-derbi.jpg", audio: "public/audio/belleza.mp3" },
  { title: "Naranjos de Nervión", show: "Nervión · T01 · E08", cover: "public/covers/show-nervion.jpg", audio: "public/audio/platero.mp3" },
  { title: "Heliópolis a oscuras", show: "Heliópolis · T01 · E04", cover: "public/covers/show-heliopolis.jpg", audio: "public/audio/nariz.mp3" },
  { title: "Dormir es un país", show: "Nervión & Heliópolis · T02 · E04", cover: "public/covers/ep-dormir.jpg", audio: "public/audio/vivo.mp3" },
  { title: "Voces en el pasillo", show: "Nervión · T01 · E07", cover: "public/covers/ep-pasillo.jpg", audio: "public/audio/redondillas.mp3" },
  { title: "El último cine de barrio", show: "Nervión & Heliópolis · T02 · E03", cover: "public/covers/ep-cine.jpg", audio: "public/audio/soneto.mp3" },
  { title: "El río, de vuelta", show: "Heliópolis · T01 · E03", cover: "public/covers/ep-rio.jpg", audio: "public/audio/a_ti.mp3" },
  { title: "Cómo se construye una mesa", show: "Nervión & Heliópolis · T02 · E02", cover: "public/covers/ep-mesa.jpg", audio: "public/audio/ars.mp3" },
  { title: "Lo que se dice al apagar el fuego", show: "Nervión & Heliópolis · T02 · E01", cover: "public/covers/ep-fuego.jpg", audio: "public/audio/repente.mp3" },
];

function rows(list) {
  return list
    .map(
      (ep) => `<article data-audio="${ep.audio}" data-title="${ep.title}" data-cover="${ep.cover}">
      <img src="${ep.cover}" alt="">
      <div><h3>${ep.title}</h3><p>${ep.show}</p></div>
    </article>`,
    )
    .join("");
}
document.getElementById("home-list").innerHTML = rows(EPISODES.slice(0, 6));
document.getElementById("explore-list").innerHTML = rows(EPISODES.slice(0, 8));
document.getElementById("archive-list").innerHTML = rows(EPISODES);

const views = [...document.querySelectorAll(".view")];
function openView(name) {
  views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}
document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => openView(el.dataset.view));
});

const audio = document.querySelector("#player");
const mini = document.querySelector("#miniPlayer");
const miniTitle = document.querySelector("#miniTitle");
const miniCover = document.querySelector("#miniCover");
const miniToggle = document.querySelector("#miniToggle");

function playEpisode(src, title, cover) {
  audio.src = src;
  miniTitle.textContent = title;
  if (cover) miniCover.src = cover;
  mini.hidden = false;
  audio.play();
  miniToggle.textContent = "❚❚";
}

document.body.addEventListener("click", (e) => {
  const el = e.target.closest("[data-audio]");
  if (!el) return;
  playEpisode(el.dataset.audio, el.dataset.title || "Nervión & Heliópolis", el.dataset.cover);
});

miniToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    miniToggle.textContent = "❚❚";
  } else {
    audio.pause();
    miniToggle.textContent = "▶";
  }
});
audio.addEventListener("ended", () => {
  miniToggle.textContent = "▶";
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const hint = document.getElementById("installHint");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  hint.textContent = "Pulsa el botón para dejarla en tu pantalla de inicio.";
});
installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    return;
  }
  openView("instalar");
});
window.addEventListener("appinstalled", () => {
  hint.textContent = "Ya está en tu pantalla de inicio.";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {});
  });
}
