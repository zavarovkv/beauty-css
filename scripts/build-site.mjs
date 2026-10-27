import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = new URL("../_site/", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const manifest = JSON.parse(
  await readFile(new URL("../dist/manifest.json", import.meta.url), "utf8"),
);
const base = new URL(process.env.SITE_BASE_URL || "https://zavarov.com/beauty/");
if (!base.pathname.endsWith("/")) throw new Error("SITE_BASE_URL must end with /");
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );

const copy = {
  en: {
    title: "Beauty.css — Simple styles. Beautiful websites.",
    description: pkg.description,
    skip: "Skip to content",
    elements: "Examples",
    guide: "Get started",
    theme: "Theme",
    auto: "System",
    light: "Light",
    dark: "Dark",
    alternate: "Русский",
    alternatePath: "ru/",
    tagline: "Simple styles. Beautiful websites.",
    intro:
      "A small CSS library for people who write. Add one stylesheet to your HTML and give your words a comfortable place to live.",
    download: "Download CSS",
    source: "View on GitHub",
    preview: "CSS typography",
    features: "No required JavaScript. No bundled fonts. No build step for your website.",
    examplesIntro:
      "The article below uses ordinary HTML. Its headings, links, quotes, lists, table and form are styled by the same file you can download.",
    articleTitle: "Make room for the words",
    articleLead: "A short field guide to pages that feel good to read.",
    para: "Good typography gives a page a rhythm. Headings help us find our place, paragraphs give an idea room to develop, and links make the next step clear. The details work together so the reader can focus on the story.",
    inline:
      "You can emphasize a phrase, highlight an idea, add a footnote, or include a line of code without interrupting the flow.",
    emphasis: "This deserves a little emphasis",
    bold: "this matters",
    mark: "keep this in mind",
    quote: "Design is as much about the space between things as the things themselves.",
    attribution: "An observation from building this library",
    listTitle: "A few useful defaults",
    list: [
      "A comfortable line length and generous leading.",
      "Visible links and a clear keyboard focus.",
      "Light and dark palettes that follow your preference.",
    ],
    tableTitle: "A small reading list",
    caption: "Books read this year",
    book: "Book",
    author: "Author",
    read: "Read",
    books: [
      ["The Little Prince", "Antoine de Saint-Exupéry", "March"],
      ["A Room of One’s Own", "Virginia Woolf", "February"],
      ["The Design of Everyday Things", "Don Norman", "January"],
    ],
    codeTitle: "One file, plain HTML",
    codeIntro:
      "Download the file, put it next to your page, and add a stylesheet link. Your browser does the rest.",
    detailsTitle: "What happens without JavaScript?",
    details:
      "Everything you see in the article still works: typography, native form validation, this disclosure, and the system color scheme. JavaScript on this demo only remembers your theme choice and shows a local form confirmation.",
    formTitle: "A form should feel like part of the page",
    email: "Email address",
    emailHint: "Demo only. Nothing is sent or stored.",
    submit: "Try the form",
    full: "Style the whole page",
    fullText:
      "Use the classless file for a new blog, personal website or documentation page. Standard HTML elements get sensible defaults, including a centered page layout.",
    scoped: "Style a single article",
    scopedText:
      "Use the prose file inside an existing website. Add the beauty class to the content container. The host page keeps its layout and controls.",
    fixture: "Open the scoped example",
    customize: "Make it yours",
    customizeText:
      "Override public CSS variables with your own stylesheet. Your normal CSS takes priority over the beauty cascade layer, so there is no need for !important.",
    themeTitle: "Choose a color scheme",
    themeText:
      "The default follows the system. Set data-theme on html for the classless file, or directly on the .beauty container for prose. Use light, dark, or auto.",
    tableHelpTitle: "Keep wide content usable",
    tableHelp:
      "Wrap a wide table in .beauty-scroll with a descriptive accessible name and tabindex=0. It scrolls locally without changing the table’s native semantics. Give overflowing pre elements tabindex=0 too, so keyboard users can scroll them.",
    escapeTitle: "Leave a component alone",
    escapeText:
      "Add .not-beauty to an embedded component. Beauty selectors stop at that element and its descendants. Normal CSS inheritance still applies: set the component’s own font or colors if it needs them.",
    installTitle: "Install and contribute",
    installText:
      "Install the package with npm, or download the CSS above. Distribution files are included; your website needs no build tools.",
    tokenTitle: "Public variables",
    token: "Variable",
    purpose: "Purpose",
    fontPurpose: "Text font family",
    monoPurpose: "Code font family",
    sizePurpose: "Base text size",
    weightPurpose: "Text weight",
    linePurpose: "Text leading",
    widthPurpose: "Classless page width",
    spacePurpose: "Paragraph spacing",
    radiusPurpose: "Control and code radius",
    palettePurpose: "Color palette",
    footer: "Created by Konstantin Zavarov",
    built: "This page is built with Beauty.css.",
  },
  ru: {
    title: "Beauty.css — Простые стили. Красивые сайты.",
    description: "Легкая CSS-библиотека для красивых сайтов, которые приятно читать.",
    skip: "К содержимому",
    elements: "Примеры",
    guide: "Подключение",
    theme: "Тема",
    auto: "Системная",
    light: "Светлая",
    dark: "Темная",
    alternate: "English",
    alternatePath: "../",
    tagline: "Простые стили. Красивые сайты.",
    intro:
      "Небольшая CSS-библиотека для тех, кто пишет. Подключите один файл к HTML-странице — и у вашего текста появится удобное место для жизни.",
    download: "Скачать CSS",
    source: "Код на GitHub",
    preview: "Типографика на CSS",
    features: "Без обязательного JavaScript, встроенных шрифтов и сборки на вашем сайте.",
    examplesIntro:
      "Эта статья написана на обычном HTML. Заголовки, ссылки, цитаты, списки, таблица и форма оформлены тем же файлом, который можно скачать.",
    articleTitle: "Дайте тексту пространство",
    articleLead: "Небольшое руководство по страницам, которые приятно читать.",
    para: "Хорошая типографика задает странице ритм. Заголовки помогают ориентироваться, абзацы дают мысли раскрыться, а ссылки показывают, куда идти дальше. Детали работают вместе, чтобы читатель мог сосредоточиться на истории.",
    inline:
      "Можно выделить фразу, подчеркнуть мысль, добавить сноску или строку кода, сохранив плавное течение текста.",
    emphasis: "Здесь нужен легкий акцент",
    bold: "это важно",
    mark: "стоит запомнить",
    quote: "Дизайн складывается из самих элементов и пространства между ними.",
    attribution: "Наблюдение из работы над этой библиотекой",
    listTitle: "Несколько полезных настроек",
    list: [
      "Удобная длина строки и свободный интерлиньяж.",
      "Заметные ссылки и четкий фокус при навигации с клавиатуры.",
      "Светлая и темная палитры, которые следуют вашим предпочтениям.",
    ],
    tableTitle: "Небольшой список прочитанного",
    caption: "Книги, прочитанные в этом году",
    book: "Книга",
    author: "Автор",
    read: "Прочитана",
    books: [
      ["Маленький принц", "Антуан де Сент-Экзюпери", "Март"],
      ["Своя комната", "Вирджиния Вулф", "Февраль"],
      ["Дизайн привычных вещей", "Дон Норман", "Январь"],
    ],
    codeTitle: "Один файл, обычный HTML",
    codeIntro:
      "Скачайте файл, положите рядом со страницей и подключите его. Остальное сделает браузер.",
    detailsTitle: "Что работает без JavaScript?",
    details:
      "Все элементы статьи: типографика, встроенная проверка формы, этот раскрывающийся блок и системная цветовая схема. JavaScript в демо только запоминает выбранную тему и показывает локальное подтверждение формы.",
    formTitle: "Форма как часть страницы",
    email: "Электронная почта",
    emailHint: "Это демо. Данные никуда не отправляются и не сохраняются.",
    submit: "Попробовать",
    full: "Оформить страницу целиком",
    fullText:
      "Файл без классов подойдет новому блогу, личному сайту или документации. Обычные HTML-элементы получают базовые стили, включая ширину страницы и поля.",
    scoped: "Оформить отдельную статью",
    scopedText:
      "На существующем сайте используйте файл prose. Добавьте класс beauty контейнеру с текстом. Внешняя страница сохранит свою верстку и элементы управления.",
    fixture: "Открыть пример с контейнером",
    customize: "Настроить под себя",
    customizeText:
      "Переопределите публичные CSS-переменные в своем файле. Обычные стили имеют приоритет над слоем beauty, поэтому !important не нужен.",
    themeTitle: "Выбрать цветовую схему",
    themeText:
      "По умолчанию используется системная тема. Добавьте data-theme к html для всей страницы или к контейнеру .beauty для prose. Доступны light, dark и auto.",
    tableHelpTitle: "Сохранить удобство широкого контента",
    tableHelp:
      "Оберните широкую таблицу в .beauty-scroll с понятным доступным названием и tabindex=0. Она будет прокручиваться внутри блока, сохраняя семантику таблицы. Добавьте tabindex=0 и к переполненным pre, чтобы их можно было прокручивать с клавиатуры.",
    escapeTitle: "Исключить отдельный компонент",
    escapeText:
      "Добавьте класс .not-beauty встроенному компоненту. Селекторы Beauty перестанут применяться к нему и его содержимому. Обычное наследование CSS сохраняется: при необходимости задайте компоненту собственные шрифт и цвета.",
    installTitle: "Установка и участие",
    installText:
      "Установите пакет через npm или скачайте CSS выше. Готовые файлы включены: вашему сайту инструменты сборки не нужны.",
    tokenTitle: "Публичные переменные",
    token: "Переменная",
    purpose: "Назначение",
    fontPurpose: "Шрифт текста",
    monoPurpose: "Шрифт кода",
    sizePurpose: "Базовый размер текста",
    weightPurpose: "Насыщенность текста",
    linePurpose: "Межстрочный интервал",
    widthPurpose: "Ширина страницы",
    spacePurpose: "Интервал между абзацами",
    radiusPurpose: "Скругление полей и кода",
    palettePurpose: "Цветовая палитра",
    footer: "Автор — Константин Заваров",
    built: "Эта страница оформлена Beauty.css.",
  },
};

function code(value) {
  return `<pre tabindex="0"><code>${escape(value)}</code></pre>`;
}

function document(
  lang,
  content,
  { prefix = "", title, path = "", noindex = false, prose = false } = {},
) {
  const t = copy[lang];
  const pageTitle = title || t.title;
  const canonical = new URL(path, base).href;
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Beauty.css",
    description: t.description,
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
  <meta name="description" content="${escape(t.description)}">
  ${
    noindex
      ? '<meta name="robots" content="noindex, follow">'
      : `<link rel="canonical" href="${escape(canonical)}">
  <link rel="alternate" hreflang="en" href="${base.href}">
  <link rel="alternate" hreflang="ru" href="${new URL("ru/", base).href}">
  <link rel="alternate" hreflang="x-default" href="${base.href}">`
  }
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(pageTitle)}">
  <meta property="og:description" content="${escape(t.description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
  <link rel="stylesheet" href="${prefix}dist/beauty${prose ? ".prose" : ""}.min.css">
  ${noindex ? "" : `<link rel="stylesheet" href="${prefix}assets/site.css">`}
  <script src="${prefix}assets/theme.js"></script>
</head>
<body>
${content}
</body>
</html>\n`;
}

function home(lang) {
  const t = copy[lang];
  const prefix = lang === "ru" ? "../" : "";
  const tokens = [
    ["font", t.fontPurpose],
    ["font-mono", t.monoPurpose],
    ["font-size", t.sizePurpose],
    ["font-weight", t.weightPurpose],
    ["line-height", t.linePurpose],
    ["width", t.widthPurpose],
    ["space", t.spacePurpose],
    ["radius", t.radiusPurpose],
    ["background", lang === "ru" ? "Фон страницы или контейнера" : "Page or container background"],
    ["text", lang === "ru" ? "Основной текст" : "Body text"],
    ["heading", lang === "ru" ? "Заголовки и акценты" : "Headings and emphasis"],
    ["muted", lang === "ru" ? "Второстепенный текст" : "Secondary text"],
    ["link", lang === "ru" ? "Ссылки, кнопки и фокус" : "Links, buttons and focus"],
    ["hover", lang === "ru" ? "Состояние наведения" : "Hover state"],
    ["border", lang === "ru" ? "Линии в контенте" : "Content rules"],
    ["control-border", lang === "ru" ? "Границы полей" : "Control boundaries"],
    ["danger", lang === "ru" ? "Граница поля с ошибкой" : "Invalid field boundary"],
    [
      "surface",
      lang === "ru" ? "Фон кода и полей для чтения" : "Code and read-only control background",
    ],
    ["mark", lang === "ru" ? "Фон выделения" : "Highlight background"],
  ];
  return document(
    lang,
    `
<a class="skip-link" href="#main">${t.skip}</a>
<header>
  <nav class="site-nav" aria-label="${lang === "ru" ? "Основная навигация" : "Main navigation"}">
    <a class="wordmark" href="${prefix || "./"}">Beauty.css</a>
    <div class="site-tools">
      <a href="#examples">${t.elements}</a>
      <a href="#start">${t.guide}</a>
      <a href="${t.alternatePath}" lang="${lang === "en" ? "ru" : "en"}" hreflang="${lang === "en" ? "ru" : "en"}">${t.alternate}</a>
      <label>${t.theme} <select id="theme"><option value="auto">${t.auto}</option><option value="light">${t.light}</option><option value="dark">${t.dark}</option></select></label>
    </div>
  </nav>
</header>
<main id="main">
  <section class="hero" aria-labelledby="product-title">
    <p class="eyebrow">${t.preview} · v${pkg.version} · ${(manifest.files["beauty.min.css"].gzip / 1024).toFixed(1)} KB gzip</p>
    <hgroup><h1 id="product-title">Beauty.css</h1><p>${t.tagline}</p></hgroup>
    <p class="hero-description">${t.intro}</p>
    <p class="actions"><a href="${prefix}dist/beauty.min.css" download>${t.download} ↓</a><a href="https://github.com/zavarovkv/beauty-css">${t.source} ↗</a></p>
    <p class="version">${t.features}</p>
  </section>
  <section class="specimen" id="examples" aria-labelledby="examples-title">
    <h2 id="examples-title">${t.elements}</h2>
    <p>${t.examplesIntro}</p>
    <article class="sample-article" aria-labelledby="article-title">
      <hgroup><h2 id="article-title">${t.articleTitle}</h2><p>${t.articleLead}</p></hgroup>
      <p>${t.para}</p>
      <p><em>${t.emphasis}</em>, <strong>${t.bold}</strong>, <mark>${t.mark}</mark>. ${t.inline} <code>line-height: 1.65</code>.</p>
      <blockquote><p>${t.quote}</p><footer>${t.attribution}</footer></blockquote>
      <h3>${t.listTitle}</h3>
      <ul>${t.list.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h3 id="reading-list">${t.tableTitle}</h3>
      <div class="beauty-scroll" tabindex="0" role="region" aria-labelledby="reading-list">
        <table><caption>${t.caption}</caption><thead><tr><th scope="col">${t.book}</th><th scope="col">${t.author}</th><th scope="col">${t.read}</th></tr></thead><tbody>${t.books.map((book) => `<tr>${book.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>
      </div>
      <h3>${t.codeTitle}</h3><p>${t.codeIntro}</p>
      ${code('<link rel="stylesheet" href="beauty.min.css">')}
      <details><summary>${t.detailsTitle}</summary><p>${t.details}</p></details>
      <h3 id="forms">${t.formTitle}</h3>
      <form data-demo-form action="#forms">
        <label for="email">${t.email}</label>
        <div class="form-row"><input id="email" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="email-hint" required><button type="submit">${t.submit}</button></div>
        <p id="email-hint"><small>${t.emailHint}</small></p>
        <p id="form-status" role="status" hidden></p>
      </form>
    </article>
  </section>
  <section class="guide" id="start" aria-labelledby="start-title">
    <h2 id="start-title">${t.guide}</h2>
    <h3>${t.full}</h3><p>${t.fullText}</p>
    ${code('<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>A place for words</title>\n  <link rel="stylesheet" href="beauty.min.css">\n</head>\n<body>\n  <main>\n    <h1>A place for words</h1>\n    <p>Your story starts here.</p>\n  </main>\n</body>\n</html>')}
    <h3>${t.scoped}</h3><p>${t.scopedText}</p>
    ${code('<link rel="stylesheet" href="beauty.prose.min.css">\n\n<article class="beauty">\n  <h1>A place for words</h1>\n  <p>Your existing site stays in charge.</p>\n</article>')}
    <p><a href="${prefix}examples/prose.html">${t.fixture} →</a></p>
    <h3>${t.customize}</h3><p>${t.customizeText}</p>
    ${code(':root {\n  --beauty-font: "Inter", system-ui, sans-serif;\n  --beauty-width: 48rem;\n  --beauty-link: #7250a5;\n}\n\n/* Prose mode: set variables on the container. */\n.beauty { --beauty-font-size: 1.125rem; }')}
    <h3>${t.themeTitle}</h3><p>${t.themeText}</p>
    ${code('<html data-theme="dark">\n\n<!-- Or an isolated article: -->\n<article class="beauty" data-theme="light">...</article>')}
    <h3>${t.tableHelpTitle}</h3><p>${t.tableHelp}</p>
    ${code('<h2 id="results">Results</h2>\n<div class="beauty-scroll" role="region"\n     aria-labelledby="results" tabindex="0">\n  <table>...</table>\n</div>')}
    <h3>${t.escapeTitle}</h3><p>${t.escapeText}</p>
    ${code('<article class="beauty">\n  <p>Article content.</p>\n  <div class="not-beauty">Your independent component</div>\n</article>')}
    <h3 id="variables">${t.tokenTitle}</h3>
    <div class="beauty-scroll" tabindex="0" role="region" aria-labelledby="variables"><table><thead><tr><th scope="col">${t.token}</th><th scope="col">${t.purpose}</th></tr></thead><tbody>${tokens.map(([name, purpose]) => `<tr><td><code>--beauty-${name}</code></td><td>${purpose}</td></tr>`).join("")}</tbody></table></div>
    <h3>${t.installTitle}</h3><p>${t.installText}</p>
    ${code("npm install beauty-css")}
    ${code('import "beauty-css";\n// Or only a content container:\nimport "beauty-css/prose";')}
  </section>
</main>
<footer class="site-footer"><p><a href="https://zavarov.com/">${t.footer}</a> · <a href="https://github.com/zavarovkv/beauty-css/blob/main/LICENSE">MIT</a></p><p>${t.built}</p></footer>`,
    { prefix, path: lang === "ru" ? "ru/" : "" },
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

await mkdir(output, { recursive: true });
await mkdir(new URL("ru/", output), { recursive: true });
await mkdir(new URL("examples/", output), { recursive: true });
await cp(new URL("../dist/", import.meta.url), new URL("dist/", output), { recursive: true });
await cp(new URL("../site/assets/", import.meta.url), new URL("assets/", output), {
  recursive: true,
});
await writeFile(new URL("index.html", output), home("en"));
await writeFile(new URL("ru/index.html", output), home("ru"));
for (const [name, content] of Object.entries(fixtures()))
  await writeFile(new URL(`examples/${name}`, output), content);
await writeFile(
  new URL("sitemap.xml", output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base.href}</loc></url><url><loc>${new URL("ru/", base).href}</loc></url></urlset>\n`,
);
process.stdout.write(`Demo built in ${fileURLToPath(output)}\n`);
