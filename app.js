const views = [...document.querySelectorAll(".view")];
function openView(name) {
  views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}
document.querySelectorAll("[data-view]").forEach((el) => {
  el.addEventListener("click", () => openView(el.dataset.view));
});

document.querySelectorAll(".inline-player-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".episode-card");
    const panel = card?.querySelector(".embedded-player");
    const frame = panel?.querySelector("iframe");
    if (!panel || !frame) return;

    document.querySelectorAll(".embedded-player").forEach((other) => {
      if (other !== panel) {
        other.hidden = true;
        const otherToggle = other.closest(".episode-card")?.querySelector(".inline-player-toggle");
        if (otherToggle) otherToggle.textContent = "▶ Escuchar episodio";
      }
    });

    if (!frame.getAttribute("src")) frame.setAttribute("src", panel.dataset.src);
    panel.hidden = !panel.hidden;
    btn.textContent = panel.hidden ? "▶ Escuchar episodio" : "⏸ Ocultar reproductor";
  });
});

document.querySelectorAll(".close-player").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.closest(".embedded-player");
    const card = btn.closest(".episode-card");
    if (panel) panel.hidden = true;
    const toggle = card?.querySelector(".inline-player-toggle");
    if (toggle) toggle.textContent = "▶ Escuchar episodio";
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
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== "nh-v14").map((k) => caches.delete(k)))).catch(() => {});
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./sw.js?v=14", { updateViaCache: "none" });
      await reg.update();
    } catch (_) {}
  });
}
