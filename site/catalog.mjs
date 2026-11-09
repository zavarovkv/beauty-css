// Each specimen is rendered and shown as escaped source from the same string.
export function catalog(lang, prefix) {
  const t = (ru, en) => (lang === "ru" ? ru : en);
  return [
    {
      id: "typography",
      title: t("Типографика", "Typography"),
      text: t(
        "Обычный HTML уже выглядит хорошо. Классы нужны только для дополнительных акцентов.",
        "Ordinary HTML already looks good. Classes are only needed for optional treatments.",
      ),
      examples: [
        {
          title: t("Заголовки и абзацы", "Headings and paragraphs"),
          html: `<hgroup>
  <h2>${t("Дайте тексту пространство", "Make room for the words")}</h2>
  <p>${t("Хорошая страница начинается с ясной мысли.", "A good page starts with a clear idea.")}</p>
</hgroup>
<p>${t("Заголовки помогают найти нужное, абзацы — раскрыть мысль. Умеренная длина строки и свободный интерлиньяж делают чтение удобным на любом экране.", "Headings help us find our place, and paragraphs give an idea room to develop. A comfortable measure and generous leading make reading easier on any screen.")}</p>
<h3>${t("Заголовок третьего уровня", "A third-level heading")}</h3>
<h4>${t("Заголовок четвертого уровня", "A fourth-level heading")}</h4>
<h5>${t("Заголовок пятого уровня", "A fifth-level heading")}</h5>
<h6>${t("Заголовок шестого уровня", "A sixth-level heading")}</h6>`,
        },
        {
          title: t("Акценты внутри строки", "Inline emphasis"),
          html: `<p><strong>${t("Важная мысль", "An important idea")}</strong>, <em>${t("легкий акцент", "a little emphasis")}</em>, <mark>${t("выделенный фрагмент", "a highlighted phrase")}</mark>.
<abbr title="Cascading Style Sheets">CSS</abbr>, <code>line-height</code>, <kbd>Ctrl</kbd> + <kbd>C</kbd>, <samp>OK</samp>.</p>
<p><b>${t("Жирный", "Bold")}</b>, <i>${t("курсив", "italic")}</i>, <u>${t("подчеркнутый", "underlined")}</u>, <s>${t("неактуальный", "outdated")}</s>, <del>${t("удаленный", "deleted")}</del>, <ins>${t("добавленный", "inserted")}</ins>.
H<sub>2</sub>O · x<sup>2</sup> · <small>${t("небольшое уточнение", "a small clarification")}</small>.</p>
<p>${t("Встречаемся", "Meet us on")} <time datetime="2026-11-01">${t("1 ноября 2026", "1 November 2026")}</time>. <span class="beauty-nowrap">24 ${t("МБ", "MB")}</span>.</p>`,
        },
        {
          title: t("Редакторские акценты", "Editorial treatments"),
          html: `<article class="beauty-reading">
  <p class="beauty-lead">${t("Первый абзац помогает войти в историю.", "An opening paragraph invites the reader into the story.")}</p>
  <h3 class="beauty-heading-compact">${t("Короткий заголовок с плотным ритмом", "A short heading with a compact rhythm")}</h3>
  <p>${t("Одна", "One")} <span class="beauty-emphasis">${t("важная деталь", "important detail")}</span> ${t("может изменить впечатление от целой страницы.", "can change how a whole page feels.")}</p>
  <p class="beauty-note">${t("Дополнительные сведения —", "For more information,")} <a href="#start">${t("в инструкции", "read the guide")}</a>.</p>
  <p class="beauty-fine-print">${t("Небольшая подпись или источник.", "A small attribution or source.")}</p>
</article>`,
        },
      ],
    },
    {
      id: "links",
      title: t("Ссылки и кнопки", "Links and buttons"),
      text: t(
        "Ссылки ведут на страницы. Кнопки выполняют действия. Фокус с клавиатуры остается заметным.",
        "Links navigate. Buttons perform actions. Keyboard focus stays visible.",
      ),
      examples: [
        {
          title: t("Обычная и составная ссылка", "Ordinary and compound links"),
          html: `<p><a href="#start">${t("Подключить библиотеку", "Get started")}</a></p>
<p><a href="https://github.com/zavarovkv/beauty-css">
  <span class="beauty-link-label">GitHub</span><span class="beauty-link-icon" aria-hidden="true">↗</span>
</a></p>`,
        },
        {
          title: t("Действия и состояния", "Actions and states"),
          html: `<p><a class="beauty-button" href="${prefix}dist/beauty.min.css" download>${t("Скачать CSS", "Download CSS")}</a>
<button type="button" disabled>${t("Недоступно", "Unavailable")}</button></p>
<form data-example-form>
  <label for="button-email">Email</label>
  <input id="button-email" type="email" placeholder="you@example.com" required>
  <input type="submit" value="${t("Проверить", "Validate")}">
  <input type="reset" value="${t("Сбросить", "Reset")}">
  <input type="button" value="${t("Открыть пример", "Example action")}" disabled>
  <p class="beauty-note">${t("Демонстрация: данные никуда не отправляются.", "Demo only: nothing is sent.")}</p>
  <p role="status" hidden></p>
</form>`,
        },
      ],
    },
    {
      id: "quotes",
      title: t("Цитаты и списки", "Quotes and lists"),
      text: t(
        "Блочные и строчные цитаты, вложенные списки и определения сохраняют нативную семантику.",
        "Block and inline quotes, nested lists and definitions retain native semantics.",
      ),
      examples: [
        {
          title: t("Цитаты", "Quotations"),
          html: `<blockquote>
  <p>${t("Хорошая типографика помогает сосредоточиться на смысле.", "Good typography helps the reader focus on the meaning.")}</p>
  <footer>${t("Заметка о дизайне", "A note on design")}</footer>
</blockquote>
<p>${t("А это", "This is")} <q>${t("цитата внутри строки", "an inline quotation")}</q>.</p>
<blockquote class="beauty-callout">
  <p>${t("Цитата с мягким фоном для отдельного акцента.", "A quotation on a quiet surface for extra emphasis.")}</p>
</blockquote>`,
        },
        {
          title: t("Три вида списков", "Three kinds of list"),
          html: `<ul>
  <li>${t("Ясная мысль", "A clear idea")}
    <ul><li>${t("Полезное уточнение", "A useful detail")}</li></ul>
  </li>
  <li>${t("Логичная последовательность", "A logical sequence")}</li>
</ul>
<ol><li>${t("Написать", "Write")}</li><li>${t("Отредактировать", "Edit")}</li><li>${t("Опубликовать", "Publish")}</li></ol>
<dl>
  <dt>Classless</dt><dd>${t("Стили для всей HTML-страницы.", "Styles for an entire HTML page.")}</dd>
  <dt>Prose</dt><dd>${t("Стили только внутри контейнера .beauty.", "Styles inside a .beauty container.")}</dd>
</dl>`,
        },
      ],
    },
    {
      id: "footnotes",
      title: t("Примечания", "Footnotes"),
      text: t(
        "Надстрочные ссылки и компактные примечания с обратным переходом.",
        "Superscript references and compact notes with return links.",
      ),
      examples: [
        {
          title: t("Источник и возврат к тексту", "A source and a return link"),
          html: `<p>${t("Утверждение с источником", "A sourced statement")}<sup id="note-example-ref"><a class="beauty-footnote-ref" href="#note-example" role="doc-noteref">1</a></sup>.</p>
<div class="beauty-footnotes" role="doc-endnotes"><ol role="list">
  <li id="note-example"><p>${t("Краткое пояснение к утверждению.", "A short explanation of the statement.")} <a class="beauty-footnote-backref" href="#note-example-ref" role="doc-backlink" aria-label="${t("Вернуться к ссылке 1", "Back to reference 1")}">↩</a></p></li>
</ol></div>`,
        },
      ],
    },
    {
      id: "statistics",
      title: t("Цифры и шаги", "Numbers and steps"),
      text: t(
        "Крупные значения и последовательности действий. Без графиков, анимации и дополнительных библиотек.",
        "Prominent values and a clear sequence of actions. No charts, animation or extra libraries.",
      ),
      examples: [
        {
          title: t("Число с подписью", "A value and its label"),
          html: `<dl>
  <dt class="beauty-stat-label">${t("Выполнено задач", "Tasks completed")}</dt>
  <dd class="beauty-stat-value">120</dd>
  <dt class="beauty-stat-label">${t("Обработано токенов", "Tokens processed")}</dt>
  <dd class="beauty-stat-value"><data value="1900000" title="1 900 000">${t("1,9", "1.9")}<small class="beauty-stat-unit">&nbsp;${t("млн", "M")}</small></data></dd>
</dl>`,
        },
        {
          title: t("Связанные шаги", "Connected steps"),
          html: `<ol class="beauty-steps" role="list">
  <li><small class="beauty-step-marker" aria-hidden="true">1</small><div>
    <h3>${t("Составьте план", "Make a plan")}</h3>
    <p>${t("Определите цель и выберите следующий шаг.", "Agree on the goal and choose the next step.")}</p>
  </div></li>
  <li><small class="beauty-step-marker" aria-hidden="true">2</small><div>
    <h3>${t("Выполните работу", "Do the work")}</h3>
    <p>${t("Сосредоточьтесь на главном и проверьте результат.", "Focus on what matters and review the result.")}</p>
  </div></li>
  <li><small class="beauty-step-marker" aria-hidden="true">3</small><div>
    <h3>${t("Поделитесь итогом", "Share the outcome")}</h3>
    <p>${t("Расскажите, что изменилось и что будет дальше.", "Explain what changed and what comes next.")}</p>
  </div></li>
</ol>`,
        },
      ],
    },
    {
      id: "tables",
      title: t("Таблицы и код", "Tables and code"),
      text: t(
        "Широкий контент прокручивается внутри своего блока. Его можно читать и с клавиатуры.",
        "Wide content scrolls within its own region, including with a keyboard.",
      ),
      examples: [
        {
          title: t("Таблица", "Table"),
          html: `<div class="beauty-scroll" role="region" aria-label="${t("Файлы библиотеки", "Library files")}" tabindex="0">
  <table>
    <caption>${t("Два способа подключения", "Two ways to add Beauty")}</caption>
    <thead><tr><th scope="col">${t("Файл", "File")}</th><th scope="col">${t("Область действия", "Scope")}</th><th scope="col">${t("Класс", "Class")}</th></tr></thead>
    <tbody>
      <tr><th scope="row">beauty.min.css</th><td>${t("Вся страница", "Whole page")}</td><td>—</td></tr>
      <tr><th scope="row">beauty.prose.min.css</th><td>${t("Контейнер", "Container")}</td><td>.beauty</td></tr>
    </tbody>
  </table>
</div>`,
        },
        {
          title: t("Блок кода", "Code block"),
          html: `<pre tabindex="0"><code>:root {
  --beauty-link: #7250a5;
  --beauty-reading-width: 42.5rem;
}</code></pre>
<pre tabindex="0"><samp>${t("Сборка завершена. Все готово к публикации.", "Build complete. Ready to publish.")}</samp></pre>`,
        },
      ],
    },
    {
      id: "forms",
      title: t("Формы", "Forms"),
      text: t(
        "Нативные поля, подписи и состояния. Примеры работают локально и ничего не отправляют.",
        "Native fields, labels and states. Examples run locally and never submit data.",
      ),
      examples: [
        {
          title: t("Текст и выбор", "Text and selection"),
          html: `<fieldset>
  <legend>${t("Ваши предпочтения", "Your preferences")}</legend>
  <label for="demo-name">${t("Имя", "Name")}</label>
  <input id="demo-name" autocomplete="name" placeholder="${t("Как к вам обращаться", "What should we call you?")}">
  <label for="demo-select">${t("Формат", "Format")}</label>
  <select id="demo-select"><option>${t("Статья", "Article")}</option><option>${t("Документация", "Documentation")}</option></select>
  <label for="demo-message">${t("Сообщение", "Message")}</label>
  <textarea id="demo-message" placeholder="${t("Расскажите о своей идее", "Tell us about your idea")}"></textarea>
  <label><input type="checkbox" checked>${t("Получать обновления", "Receive updates")}</label>
  <label><input type="radio" name="frequency" checked>${t("Раз в неделю", "Weekly")}</label>
  <label><input type="radio" name="frequency">${t("Раз в месяц", "Monthly")}</label>
</fieldset>`,
        },
        {
          title: t("Состояния полей", "Field states"),
          html: `<label for="demo-readonly">${t("Только чтение", "Read only")}</label>
<input id="demo-readonly" value="Beauty.css" readonly>
<label for="demo-disabled">${t("Недоступное поле", "Disabled field")}</label>
<input id="demo-disabled" value="${t("Недоступно", "Unavailable")}" disabled>
<label for="demo-invalid">Email</label>
<input id="demo-invalid" type="email" value="example" aria-invalid="true" aria-describedby="demo-error">
<p id="demo-error">${t("Укажите полный адрес, например you@example.com.", "Enter a complete address, such as you@example.com.")}</p>`,
        },
        {
          title: t("Другие нативные поля", "More native controls"),
          html: `<label for="demo-number">${t("Количество", "Quantity")}</label><input id="demo-number" type="number" min="1" max="10" value="3">
<label for="demo-date">${t("Дата", "Date")}</label><input id="demo-date" type="date" value="2026-11-01">
<label for="demo-search">${t("Поиск", "Search")}</label><input id="demo-search" type="search" placeholder="${t("Найти в тексте", "Search the text")}">
<label for="demo-password">${t("Пароль", "Password")}</label><input id="demo-password" type="password" autocomplete="new-password" placeholder="••••••••">
<label for="demo-file">${t("Файл", "File")}</label><input id="demo-file" type="file">
<label for="demo-color">${t("Цвет", "Color")}</label><input id="demo-color" type="color" value="#0060a0">
<label for="demo-range">${t("Уровень", "Level")}</label><input id="demo-range" type="range" min="0" max="100" value="60">
<label for="demo-progress">${t("Загрузка", "Progress")}</label><progress id="demo-progress" value="60" max="100">60%</progress>
<label for="demo-meter">${t("Использовано места", "Storage used")}</label><meter id="demo-meter" value="0.35">35%</meter>`,
        },
      ],
    },
    {
      id: "media",
      title: t("Медиа и раскрывающиеся блоки", "Media and disclosures"),
      text: t(
        "Изображения сохраняют пропорции. Подписи остаются рядом, а details работает без скриптов.",
        "Images keep their proportions. Captions stay close, and details works without scripts.",
      ),
      examples: [
        {
          title: t("Изображение с подписью", "An image and its caption"),
          html: `<figure>
  <img src="${prefix}assets/specimen.svg" width="960" height="360" loading="lazy" alt="${t("Три строки разной длины на светлом фоне", "Three lines of different lengths on a quiet background")}">
  <figcaption>${t("Обычный figcaption внутри figure.", "An ordinary figcaption inside a figure.")}</figcaption>
</figure>
<p class="beauty-caption">${t("Отдельная подпись — класс beauty-caption.", "For a separate caption, use beauty-caption.")}</p>
<hr>`,
        },
        {
          title: t("Автор или источник", "Author or source"),
          html: `<figure>
  <img src="${prefix}assets/specimen.svg" width="960" height="360" loading="lazy" alt="${t("Три строки разной длины", "Three lines of different lengths")}">
  <figcaption class="beauty-caption beauty-caption-credit">${t("Иллюстрация автора", "Illustration by the author")}</figcaption>
</figure>`,
        },
        {
          title: t("Дополнительные подробности", "A little more detail"),
          html: `<details>
  <summary>${t("Что работает без JavaScript?", "What works without JavaScript?")}</summary>
  <p>${t("Типографика, системная тема, формы, фокус и этот блок. Скрипт на странице только переключает тему и помогает копировать примеры.", "Typography, the system palette, forms, focus and this disclosure. This page uses a small script for the theme control and copying examples.")}</p>
</details>`,
        },
        {
          title: t("Текст справа налево", "Right-to-left text"),
          html: `<div dir="rtl" lang="ar">
  <blockquote><p>التصميم الجيد يمنح النص مساحة.</p></blockquote>
  <ol><li>الفكرة الأولى</li><li>الفكرة الثانية</li></ol>
</div>`,
        },
      ],
    },
  ];
}
