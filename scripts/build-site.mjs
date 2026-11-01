import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { catalog } from "../site/catalog.mjs";

const output = new URL("../_site/", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const manifest = JSON.parse(
  await readFile(new URL("../dist/manifest.json", import.meta.url), "utf8"),
);
const base = new URL(process.env.SITE_BASE_URL || "http://localhost:4173/");
if (!base.pathname.endsWith("/")) throw new Error("SITE_BASE_URL must end with /");
const defaultLanguage = process.env.SITE_DEFAULT_LANGUAGE || "en";
if (!["en", "ru"].includes(defaultLanguage))
  throw new Error("SITE_DEFAULT_LANGUAGE must be en or ru");
const languages = ["en", "ru"];
const paths = Object.fromEntries(
  languages.map((lang) => [lang, lang === defaultLanguage ? "" : `${lang}/`]),
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
const fingerprint = async (file) =>
  createHash("sha256")
    .update(await readFile(new URL(`../${file}`, import.meta.url)))
    .digest("hex")
    .slice(0, 12);
const hashes = Object.fromEntries(
  await Promise.all(
    ["site/assets/site.css", "site/assets/theme.js"].map(async (file) => [
      file,
      await fingerprint(file),
    ]),
  ),
);
const tokenCSS = await readFile(new URL("../src/tokens.css", import.meta.url), "utf8");
const defaults = new Map();
const colors = new Map();
for (const [, name, value] of tokenCSS.matchAll(/(--beauty-[\w-]+):\s*([^;]+);/g)) {
  if (!defaults.has(name)) defaults.set(name, value.trim());
  if (/^#[a-f0-9]{6}$/.test(value.trim())) {
    if (!colors.has(name)) colors.set(name, [value.trim(), value.trim()]);
    else colors.get(name)[1] = value.trim();
  }
}
function code(value) {
  return `<pre tabindex="0"><code>${escape(value)}</code></pre>`;
}
function source(value, lang) {
  return `<details class="source"><summary>${lang === "ru" ? "HTML примера" : "Example HTML"}</summary>${code(value)}</details>`;
}
function document(
  lang,
  content,
  { prefix = "", title, path = "", noindex = false, prose = false } = {},
) {
  const description =
    lang === "ru"
      ? "Легкая CSS-библиотека для красивых сайтов. Живые примеры типографики, форм, таблиц, счетчиков и шагов с готовым HTML."
      : "A lightweight CSS library for readable websites. Live typography, form, table, statistic and workflow examples with ready-to-use HTML.";
  const pageTitle =
    title ||
    (lang === "ru"
      ? "Beauty.css — красивые сайты на обычном HTML"
      : "Beauty.css — beautiful websites, ordinary HTML");
  const canonical = new URL(path, base).href;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Beauty.css",
    description,
    url: canonical,
    codeRepository: "https://github.com/zavarovkv/beauty-css",
    programmingLanguage: "CSS",
    license: "https://opensource.org/license/mit",
    version: pkg.version,
  };
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escape(pageTitle)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="icon" href="data:,">
  ${
    noindex
      ? '<meta name="robots" content="noindex, follow">'
      : `<link rel="canonical" href="${escape(canonical)}">
  ${languages.map((code) => `<link rel="alternate" hreflang="${code}" href="${new URL(paths[code], base).href}">`).join("\n  ")}
  <link rel="alternate" hreflang="x-default" href="${base.href}">`
  }
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(pageTitle)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
  <link rel="stylesheet" href="${prefix}dist/beauty${prose ? ".prose" : ""}.min.css?v=${manifest.files[prose ? "beauty.prose.min.css" : "beauty.min.css"].sha256.slice(0, 12)}">
${noindex ? "" : `  <link rel="stylesheet" href="${prefix}assets/site.css?v=${hashes["site/assets/site.css"]}">\n`}  <script src="${prefix}assets/theme.js?v=${hashes["site/assets/theme.js"]}"></script>
</head>
<body>
<!--email_off-->
${content}
<!--/email_off-->
</body>
</html>\n`;
}

function home(lang) {
  const t = (ru, en) => (lang === "ru" ? ru : en);
  const prefix = paths[lang] ? "../" : "";
  const alternate = lang === "ru" ? "en" : "ru";
  const sections = catalog(lang, prefix);
  const count = sections.reduce((sum, section) => sum + section.examples.length, 0);
  const example = (
    section,
  ) => `<section id="${section.id}" class="catalog-section" aria-labelledby="${section.id}-title">
    <h2 id="${section.id}-title">${section.title}</h2><p class="beauty-note">${section.text}</p>
    ${section.examples
      .map(
        (item, index) => `<div class="example" data-example="${section.id}-${index}">
      <p class="example-label beauty-note">${item.title}</p>
      <div class="sample">${item.html}</div>${source(item.html, lang)}
    </div>`,
      )
      .join("\n")}
  </section>`;
  const swatch = (value) =>
    `<span class="color-value"><span class="swatch" style="--swatch:${value}" aria-hidden="true"></span><code>${value}</code></span>`;
  const colorLabels = {
    background: t("Фон", "Background"),
    text: t("Текст", "Text"),
    heading: t("Заголовки", "Headings"),
    muted: t("Второстепенный текст", "Secondary text"),
    link: t("Ссылки и фокус", "Links and focus"),
    hover: t("Наведение", "Hover"),
    border: t("Разделители", "Content borders"),
    "control-border": t("Границы полей", "Control borders"),
    danger: t("Ошибка", "Invalid field"),
    surface: t("Поверхность", "Surface"),
    mark: t("Выделение", "Highlight"),
  };
  return document(
    lang,
    `
<a class="skip-link" href="#main">${t("К содержимому", "Skip to content")}</a>
<header class="site-header">
  <nav class="site-nav" aria-label="${t("Основная навигация", "Main navigation")}">
    <a class="wordmark" href="./"><strong>Beauty.css</strong></a>
    <a href="#examples">${t("Примеры", "Examples")}</a>
    <a href="#start">${t("Подключение", "Get started")}</a>
    <div class="site-tools beauty-nav-end">
      <a href="${prefix}${paths[alternate] || "./"}" lang="${alternate}" hreflang="${alternate}">${t("EN", "RU")}</a>
      <label class="theme-control"><span class="visually-hidden">${t("Цветовая тема", "Color scheme")}</span><select id="theme" disabled><option value="auto">${t("Системная", "System")}</option><option value="light">${t("Светлая", "Light")}</option><option value="dark">${t("Темная", "Dark")}</option></select></label>
    </div>
  </nav>
</header>
<main id="main">
  <section class="hero" aria-labelledby="product-title">
    <p class="beauty-note">v${pkg.version} · ${new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(manifest.files["beauty.min.css"].gzip / 1024)} ${t("КиБ", "KiB")} gzip · MIT</p>
    <h1 id="product-title">${t("Красивые сайты.\nОбычный HTML.", "Beautiful websites.\nOrdinary HTML.")}</h1>
    <p class="beauty-lead">${t("Типографика, формы и детали, которые делают страницу удобной. Подключите один CSS-файл — и пишите.", "Typography, forms and details that make a page feel right. Add one stylesheet, then start writing.")}</p>
    <p class="actions"><a class="beauty-button" href="${prefix}dist/beauty.min.css" download>${t("Скачать CSS", "Download CSS")}</a><a href="https://github.com/zavarovkv/beauty-css"><span class="beauty-link-label">GitHub</span><span class="beauty-link-icon" aria-hidden="true">↗</span></a><a href="https://www.npmjs.com/package/beauty-css">npm</a></p>
    <p class="beauty-note">${t("Без зависимостей и встроенных шрифтов. Светлая и темная темы.", "No dependencies or bundled fonts. Light and dark themes.")}</p>
  </section>
  <div class="documentation" id="examples">
    <aside class="contents">
      <details id="contents-disclosure"><summary>${t("На этой странице", "On this page")}</summary>
      <nav aria-label="${t("Содержание примеров", "Example contents")}">
        <ul><li><a href="#start">${t("Подключение", "Get started")}</a></li>${sections.map((section) => `<li><a href="#${section.id}">${section.title}</a></li>`).join("")}<li><a href="#integration">${t("Контейнер и навигация", "Scope and navigation")}</a></li><li><a href="#palette">${t("Палитра", "Palette")}</a></li><li><a href="#customize">${t("Настройка", "Customization")}</a></li></ul>
        <p class="beauty-note">${count} ${t("живых примеров с HTML", "live HTML examples")}</p>
      </nav></details>
    </aside>
    <div class="catalog">
      <section id="start" class="catalog-section" aria-labelledby="start-title">
        <h2 id="start-title">${t("Один файл — и готово", "One file. Ready to go.")}</h2>
        <p>${t("Для новой страницы используйте версию без классов. Скачайте файл и добавьте эту строку в", "For a new page, use the classless version. Download the file and add this line to")} <code>&lt;head&gt;</code>:</p>
        ${code('<link rel="stylesheet" href="beauty.min.css">')}
        <p>${t("Для существующего сайта — только prose и контейнер", "For an existing website, use only prose and a container")} <code>.beauty</code>:</p>
        ${code('<link rel="stylesheet" href="beauty.prose.min.css">\n\n<article class="beauty">\n  <h1>' + t("Ваш заголовок", "Your heading") + "</h1>\n  <p>" + t("Ваш текст.", "Your words.") + "</p>\n</article>")}
        <p><a href="${prefix}dist/beauty.prose.min.css" download>${t("Скачать prose", "Download prose")}</a> · <a href="${prefix}examples/prose.html">${t("Посмотреть изоляцию стилей", "See scoped styles")}</a></p>
        <details><summary>${t("Установка через npm", "Install with npm")}</summary>${code("npm install beauty-css")}${code('import "beauty-css";\n// ' + t("Или только контейнер:", "Or just a container:") + '\nimport "beauty-css/prose";')}</details>
        <p class="beauty-note">${t("Примеры показывают версию", "These examples show version")} ${pkg.version}. ${t("Чтобы получить точно такие же стили, скачайте CSS с этой страницы. Версия в npm может отличаться.", "Download CSS from this page to get the exact same styles. The npm version may differ.")}</p>
      </section>
      ${sections.map(example).join("\n")}
      <section id="integration" class="catalog-section" aria-labelledby="integration-title">
        <h2 id="integration-title">${t("Внутри вашего сайта", "Inside your website")}</h2>
        <p>${t("Prose оформляет только содержимое .beauty. Встроенный виджет можно исключить классом .not-beauty; обычное наследование шрифтов и цветов сохраняется.", "Prose styles only the contents of .beauty. Exclude an embedded widget with .not-beauty; ordinary font and color inheritance still applies.")}</p>
        ${code('<article class="beauty" data-theme="light">\n  <p>' + t("Стилизованный текст.", "Styled text.") + '</p>\n  <div class="not-beauty">' + t("Независимый компонент", "Independent component") + "</div>\n</article>")}
        <p><a href="${prefix}examples/prose.html">${t("Открыть живой пример prose", "Open the live prose example")}</a> · <a href="${prefix}examples/classless.html">${t("HTML без классов", "Classless HTML")}</a> · <a href="${prefix}examples/rtl.html">RTL</a></p>
        <h3>${t("Навигация без лишней разметки", "Simple navigation")}</h3>
        <p>${t("В версии без классов header, nav и footer получают базовую компоновку. beauty-nav-end прижимает последний элемент к краю. Верхнее меню этой страницы использует тот же класс.", "The classless entry gives header, nav and footer their basic layout. beauty-nav-end aligns a trailing item to the inline end. This page uses it in its own navigation.")}</p>
        ${code("<header>\n  <nav>\n    <strong>" + t("Проект", "Project") + '</strong>\n    <a href="#about">' + t("О проекте", "About") + '</a>\n    <a class="beauty-nav-end" href="/login">' + t("Войти", "Log in") + "</a>\n  </nav>\n</header>")}
      </section>
      <section id="palette" class="catalog-section" aria-labelledby="palette-title">
        <h2 id="palette-title">${t("Две палитры. Одна система.", "Two palettes. One system.")}</h2>
        <p>${t("По умолчанию тема следует настройке устройства. Переключатель вверху позволяет примерить обе палитры.", "By default, the palette follows your device. Use the control at the top to try both schemes.")}</p>
        <div class="beauty-scroll" role="region" aria-labelledby="palette-title" tabindex="0"><table class="palette-table"><thead><tr><th scope="col">${t("Назначение / переменная", "Purpose / variable")}</th><th scope="col">${t("Светлая", "Light")}</th><th scope="col">${t("Темная", "Dark")}</th></tr></thead><tbody>${[...colors].map(([name, values]) => `<tr><th scope="row">${colorLabels[name.slice(9)]}<br><code>${name}</code></th><td>${swatch(values[0])}</td><td>${swatch(values[1])}</td></tr>`).join("")}</tbody></table></div>
        ${code('<html data-theme="dark">\n\n<!-- ' + t("Или на отдельном контейнере:", "Or on a prose container:") + ' -->\n<article class="beauty" data-theme="light">...</article>')}
      </section>
      <section id="customize" class="catalog-section" aria-labelledby="customize-title">
        <h2 id="customize-title">${t("Подстройте под себя", "Make it yours")}</h2>
        <p>${t("Меняйте публичные переменные. Ваши стили имеют приоритет над слоем beauty, поэтому для обычной настройки !important не нужен.", "Override public variables. Your normal styles take priority over the beauty layer, so ordinary customization needs no !important.")}</p>
        ${code(":root {\n  --beauty-link: #7250a5;\n  --beauty-reading-width: 42.5rem;\n}\n\n/* " + t("Для prose переменные задаются на контейнере.", "For prose, set variables on the container.") + " */\n.beauty { --beauty-line-height: 1.7; }")}
        <details><summary>${t("Все переменные и значения по умолчанию", "All variables and their defaults")} (${defaults.size})</summary><div class="beauty-scroll" role="region" aria-label="${t("Публичные переменные", "Public variables")}" tabindex="0"><table><thead><tr><th scope="col">${t("Переменная", "Variable")}</th><th scope="col">${t("Значение", "Default")}</th></tr></thead><tbody>${[...defaults].map(([name, value]) => `<tr><th scope="row"><code>${name}</code></th><td><code>${escape(value)}</code></td></tr>`).join("")}</tbody></table></div></details>
        <p class="beauty-note">${t("Фокус, нативная проверка полей, RTL и стили печати уже предусмотрены. При печати возвращается светлая палитра, длинные строки кода переносятся. Подписи полей и понятные тексты ссылок остаются задачей автора страницы.", "Visible focus, native validation, RTL and print styles are built in. Printing restores a light palette and wraps long code. Field labels and meaningful link text remain the page author's responsibility.")}</p>
        <p><a href="https://github.com/zavarovkv/beauty-css#readme">${t("Документация на GitHub", "Documentation on GitHub")}</a></p>
      </section>
    </div>
  </div>
</main>
<footer class="site-footer"><p><a href="https://zavarov.com/">${t("Константин Заваров", "Konstantin Zavarov")}</a> · <a href="${prefix}LICENSE">MIT</a></p><p>${t("Эта страница оформлена Beauty.css.", "This page is styled with Beauty.css.")}</p></footer>`,
    { prefix, path: paths[lang] },
  );
}

function fixtures() {
  const elements = `<h1 id="fixture-title">Words should feel at home</h1>
<p id="paragraph">An ordinary paragraph with a <a id="content-link" href="#lists">visible link</a>, <em>emphasis</em>, <strong>strong text</strong> and <code>inline code</code>.</p>
<h2 id="lists">Lists and rhythm</h2><ul><li>A clear starting point<ul><li>A nested idea</li></ul></li><li>A useful next step</li></ul>
<ol><li>Read the page</li><li>Follow the link</li></ol>
<blockquote id="quote"><p>A long quotation has room to breathe.</p><footer>A source, in ordinary type</footer></blockquote>
<p>Inline quotations remain inline: <q id="inline-quote">a few borrowed words</q> within a sentence.</p>
<pre tabindex="0" id="wide-code"><code>${"const longLine = '" + "readable ".repeat(35) + "';"}</code></pre>
<h2 id="table-title">A wide table</h2><div class="beauty-scroll" tabindex="0" role="region" aria-labelledby="table-title"><table id="wide-table"><thead><tr>${["Item", "Description", "January", "February", "March", "April"].map((s) => `<th scope="col">${s}</th>`).join("")}</tr></thead><tbody><tr><td>Notes</td><td>Deliberately wide content for a narrow viewport</td><td>1,200.00</td><td>2,300.00</td><td>3,400.00</td><td>4,500.00</td></tr></tbody></table></div>
<p id="long-text">https://example.com/${"a".repeat(180)}</p>
<figure><img id="sample-image" src="../assets/specimen.svg" width="960" height="360" alt="Three lines of different lengths on a quiet background"><figcaption>An image with intrinsic dimensions.</figcaption></figure>
<details><summary>Read a little more</summary><p>Native disclosure needs no script.</p></details>
<h2>Forms</h2><form><fieldset><legend>Your preferences</legend><label for="name">Name</label><input id="name" autocomplete="name" placeholder="Your name"><label for="fixture-email">Email</label><input id="fixture-email" type="email" autocomplete="email" required><label for="choice">Choose an option</label><select id="choice"><option>First choice</option><option>Second choice</option></select><label for="message">Message</label><textarea id="message"></textarea><label><input type="checkbox" id="checkbox">Remember this choice</label><label><input type="radio" name="sample" checked>First option</label><label><input type="radio" name="sample">Second option</label><label for="range">Volume</label><input id="range" type="range"><label for="color">Color</label><input id="color" type="color"><label for="file">Attachment</label><input id="file" type="file"><label for="disabled">Disabled field</label><input id="disabled" disabled value="Unavailable"><p><button type="button" id="button">Continue</button> <button type="button" disabled>Unavailable</button></p></fieldset></form>
<div class="not-beauty" id="escape"><h2 id="escape-heading">An independent component</h2><p id="escape-paragraph">Selector styling stops here; inheritance remains.</p><button id="escape-button" type="button">Independent button</button></div>
<button hidden type="button" id="hidden-control">This must stay hidden</button>`;
  const prose = document(
    "en",
    `<header id="outside"><h1 id="outside-heading">An existing website</h1><p id="outside-paragraph">This area keeps browser defaults.</p><button type="button" id="outside-button">Outside control</button></header><main><article class="beauty" id="prose">${elements}</article></main>`,
    {
      prefix: "../",
      title: "Scoped typography — Beauty.css",
      path: "examples/prose.html",
      noindex: true,
      prose: true,
    },
  );
  const full = document("en", `<main>${elements}</main>`, {
    prefix: "../",
    title: "HTML specimen — Beauty.css",
    path: "examples/classless.html",
    noindex: true,
  });
  const rtl = document(
    "en",
    `<main dir="rtl" class="beauty" lang="ar"><h1>مساحة للكلمات</h1><p>صفحة بسيطة للقراءة والكتابة.</p><blockquote><p>التصميم الجيد يمنح النص مساحة.</p></blockquote><ol><li>الفكرة الأولى</li><li>الفكرة الثانية</li></ol><label for="rtl-input">الاسم</label><input id="rtl-input"><p><a href="../">Beauty.css</a></p></main>`,
    {
      prefix: "../",
      title: "Right-to-left specimen — Beauty.css",
      path: "examples/rtl.html",
      noindex: true,
      prose: true,
    },
  );
  return { "prose.html": prose, "classless.html": full, "rtl.html": rtl };
}

// Regenerate a complete output tree so switching the default language leaves no stale routes.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(new URL("examples/", output), { recursive: true });
await cp(new URL("../dist/", import.meta.url), new URL("dist/", output), { recursive: true });
await cp(new URL("../site/assets/", import.meta.url), new URL("assets/", output), {
  recursive: true,
});
await cp(new URL("../LICENSE", import.meta.url), new URL("LICENSE", output));
for (const lang of languages) {
  await mkdir(new URL(paths[lang], output), { recursive: true });
  await writeFile(new URL(`${paths[lang]}index.html`, output), home(lang));
}
for (const [name, content] of Object.entries(fixtures()))
  await writeFile(new URL(`examples/${name}`, output), content);
await writeFile(
  new URL("sitemap.xml", output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${languages.map((lang) => `<url><loc>${new URL(paths[lang], base).href}</loc></url>`).join("")}</urlset>\n`,
);
process.stdout.write(`Demo built in ${fileURLToPath(output)}\n`);
