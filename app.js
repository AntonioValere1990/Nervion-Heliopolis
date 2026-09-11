const views = [...document.querySelectorAll(".view")];
function openView(name) {
  views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}
document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => openView(el.dataset.view));
});

// El reproductor ocupa todo el ancho útil de la tarjeta, no solo la columna de texto.
document.querySelectorAll(".episode-card .native-player").forEach((player) => {
  const card = player.closest(".episode-card");
  if (card && player.parentElement !== card) card.appendChild(player);
});

// Si se inicia un reproductor, pausa cualquier otra copia del mismo episodio.
document.querySelectorAll("audio").forEach((audio) => {
  audio.addEventListener("play", () => {
    document.querySelectorAll("audio").forEach((other) => {
      if (other !== audio) other.pause();
    });
  });
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const hint = document.getElementById("installHint");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (hint) hint.textContent = "Pulsa el botón para dejarla en tu pantalla de inicio.";
});
installBtn?.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    return;
  }
  openView("instalar");
});
window.addEventListener("appinstalled", () => {
  if (hint) hint.textContent = "Ya está en tu pantalla de inicio.";
});

if ("caches" in window) {
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== "nh-v17").map((k) => caches.delete(k)))).catch(() => {});
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
    const reg = await navigator.serviceWorker.register("./sw.js?v=17", { updateViaCache: "none" });
      await reg.update();
    } catch (_) {}
  });
}
