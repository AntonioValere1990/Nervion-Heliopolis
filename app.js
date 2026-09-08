const views = [...document.querySelectorAll(".view")];
function openView(name) {
  views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelectorAll("[data-view]").forEach((el) => el.addEventListener("click", () => openView(el.dataset.view)));

const modal = document.querySelector("#modal");
const templates = {
  previa: {
    k: "PREVIA · 27–29 MIN",
    t: "Plantilla exacta",
    b: `<div class="rundown"><div><time>00:00–02:00</time><p><b>Apertura.</b> Qué partido es, por qué importa y cuál es el asunto central.</p></div><div><time>02:00–07:00</time><p><b>Contexto.</b> Momento del equipo, clasificación y novedades verificadas.</p></div><div><time>07:00–14:00</time><p><b>El rival.</b> Fortalezas, debilidades y estilo.</p></div><div><time>14:00–23:00</time><p><b>Tres claves.</b> Lectura táctica y futbolística.</p></div><div><time>23:00–27:00</time><p><b>Jugador a seguir + pronóstico.</b></p></div><div><time>27:00–29:00</time><p><b>Cierre.</b> Idea final y despedida.</p></div></div>`,
  },
  post: {
    k: "POSTPARTIDO · 27–29 MIN",
    t: "Plantilla exacta",
    b: `<div class="rundown"><div><time>00:00–03:00</time><p><b>Resultado + primera lectura.</b></p></div><div><time>03:00–10:00</time><p><b>Qué pasó.</b> Desarrollo y decisiones que marcaron el partido.</p></div><div><time>10:00–19:00</time><p><b>Tres claves.</b> Aciertos, errores y lectura táctica.</p></div><div><time>19:00–24:00</time><p><b>Protagonistas.</b> Destacado, decepción y momento decisivo.</p></div><div><time>24:00–27:00</time><p><b>Lo mejor y lo peor.</b></p></div><div><time>27:00–29:00</time><p><b>Veredicto.</b> Qué significa el resultado y qué viene ahora.</p></div></div>`,
  },
};
document.querySelectorAll("[data-template]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const d = templates[btn.dataset.template];
    document.querySelector("#mk").textContent = d.k;
    document.querySelector("#mt").textContent = d.t;
    document.querySelector("#mb").innerHTML = d.b;
    modal.showModal();
  }),
);
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

const audio = document.querySelector("#player");
const mini = document.querySelector("#miniPlayer");
const miniTitle = document.querySelector("#miniTitle");
const miniToggle = document.querySelector("#miniToggle");
function playEpisode(src, title) {
  audio.src = src;
  miniTitle.textContent = title;
  mini.hidden = false;
  audio.play();
  miniToggle.textContent = "❚❚";
}
document.querySelectorAll("[data-audio]").forEach((el) =>
  el.addEventListener("click", () => playEpisode(el.dataset.audio, el.dataset.title || "Nervión & Heliópolis")),
);
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
const installBtn = document.querySelector("#installBtn");
const installHint = document.querySelector("#installHint");
installBtn.disabled = false;
installHint.textContent = "En Android se instala desde este botón. En iPhone usa Safari → Compartir → Añadir a pantalla de inicio.";
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.disabled = false;
  installHint.textContent = "Pulsa el botón para dejarla en tu pantalla de inicio.";
});
installBtn?.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    return;
  }
  openView("instalar");
  installHint.textContent = "En Chrome: menú ⋮ → Instalar aplicación. En iPhone: Safari → Compartir → Añadir a pantalla de inicio.";
});
window.addEventListener("appinstalled", () => {
  installHint.textContent = "Ya está en tu pantalla de inicio.";
  installBtn.disabled = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {});
  });
}
