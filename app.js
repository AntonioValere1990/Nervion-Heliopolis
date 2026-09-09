const views = [...document.querySelectorAll(".view")];
function openView(name) {
  views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}
document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => openView(el.dataset.view));
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {});
  });
}
