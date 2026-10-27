// The library is CSS-only. This optional demo control persists an explicit choice.
const key = "beauty-demo-theme";
let selected = "auto";
try {
  const saved = localStorage.getItem(key);
  if (["light", "dark"].includes(saved)) selected = saved;
} catch {
  /* Storage can be blocked; the system preference still works. */
}
document.documentElement.dataset.theme = selected;

document.addEventListener("DOMContentLoaded", () => {
  const control = document.querySelector("#theme");
  if (control) {
    control.value = selected;
    control.addEventListener("change", () => {
      document.documentElement.dataset.theme = control.value;
      for (const container of document.querySelectorAll(".beauty"))
        container.dataset.theme = control.value;
      try {
        localStorage.setItem(key, control.value);
      } catch {
        /* The choice still applies to the current page. */
      }
    });
  }
  const form = document.querySelector("[data-demo-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    status.hidden = false;
    status.textContent =
      document.documentElement.lang === "ru"
        ? "Все готово. Это демонстрация: данные никуда не отправлены."
        : "All set. This is a demo; nothing was sent.";
  });
});
