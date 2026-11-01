// Optional documentation controls. The CSS library has no JavaScript dependency.
const key = "beauty-demo-theme";
let selected = "auto";
try {
  const saved = localStorage.getItem(key);
  if (["light", "dark"].includes(saved)) selected = saved;
} catch {
  /* Storage may be unavailable. */
}
document.documentElement.dataset.theme = selected;
// Resolve before native selects are parsed (WebKit ancestor-style caching).
getComputedStyle(document.documentElement).colorScheme;

document.addEventListener("DOMContentLoaded", () => {
  const ru = document.documentElement.lang === "ru";
  const contents = document.querySelector("#contents-disclosure");
  if (contents) {
    const wide = matchMedia("(min-width: 62.01rem)");
    contents.open = wide.matches;
    wide.addEventListener("change", () => {
      contents.open = wide.matches;
    });
  }

  const control = document.querySelector("#theme");
  if (control) {
    control.disabled = false;
    control.value = selected;
    control.addEventListener("change", () => {
      document.documentElement.dataset.theme = control.value;
      try {
        localStorage.setItem(key, control.value);
      } catch {
        /* Session choice still works. */
      }
    });
  }
  for (const form of document.querySelectorAll("[data-example-form]")) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector('[role="status"]');
      status.hidden = false;
      status.textContent = ru
        ? "Все верно. Данные никуда не отправлены."
        : "Looks good. Nothing was sent.";
    });
    form.addEventListener("reset", () => {
      form.querySelector('[role="status"]').hidden = true;
    });
  }
  if (navigator.clipboard?.writeText) {
    for (const pre of document.querySelectorAll(".catalog pre")) {
      // Do not alter live code specimens; their surrounding source can be copied.
      if (pre.closest(".sample")) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-button";
      const label = ru ? "Копировать" : "Copy";
      button.textContent = label;
      let timer;
      button.addEventListener("click", async () => {
        clearTimeout(timer);
        try {
          await navigator.clipboard.writeText(pre.textContent);
          button.textContent = ru ? "Скопировано" : "Copied";
        } catch {
          button.textContent = ru ? "Выделите и скопируйте текст" : "Select and copy the text";
        }
        timer = setTimeout(() => {
          button.textContent = label;
        }, 2500);
      });
      pre.after(button);
    }
  }
});
