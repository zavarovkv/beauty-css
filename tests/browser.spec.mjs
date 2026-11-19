import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("prose does not change the surrounding page or an opted-out component's own styles", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  const styles = () =>
    page.evaluate(() => {
      const selectors = ["#outside-heading", "#outside-paragraph", "#outside-button"];
      return selectors.map((selector) => {
        const style = getComputedStyle(document.querySelector(selector));
        return Object.fromEntries(
          [
            "fontFamily",
            "fontSize",
            "color",
            "backgroundColor",
            "padding",
            "margin",
            "display",
            "borderWidth",
          ].map((name) => [name, style[name]]),
        );
      });
    });
  const styled = await styles();
  await expect(page.locator("#escape-button")).not.toHaveCSS("background-color", "rgb(0, 96, 160)");
  await expect(page.locator("#content-link")).toHaveCSS("color", "rgb(0, 96, 160)");
  await page.evaluate(() => {
    document.querySelector('link[rel="stylesheet"]').disabled = true;
  });
  expect(await styles()).toEqual(styled);
});

test("prose tokens and standard CSS are easy to override", async ({ page }) => {
  await page.goto("/examples/prose.html");
  await page.addStyleTag({
    content: ".beauty { --beauty-link: #7250a5; } .beauty h1 { font-size: 30px; }",
  });
  await expect(page.locator("#content-link")).toHaveCSS("color", "rgb(114, 80, 165)");
  await expect(page.locator("#fixture-title")).toHaveCSS("font-size", "30px");
});

test("typography tokens configure responsive headings and quotations without selector overrides", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  await page.addStyleTag({
    content: `.beauty {
      --beauty-h1-font: 500 4rem/1.1 serif;
      --beauty-h1-size: 4rem;
      --beauty-h1-size-small: 1.5rem;
      --beauty-quote-border: 3px solid currentColor;
      --beauty-quote-style: italic;
      --beauty-link-weight: 500;
    }`,
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#fixture-title")).toHaveCSS("font-size", "64px");
  await expect(page.locator("#fixture-title")).toHaveCSS("font-weight", "500");
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator("#fixture-title")).toHaveCSS("font-size", "24px");
  await expect(page.locator("blockquote")).toHaveCSS("border-inline-start-width", "3px");
  await expect(page.locator("blockquote")).toHaveCSS("font-style", "italic");
  await expect(page.locator("#content-link")).toHaveCSS("font-weight", "500");
});

test("editorial helpers preserve inline quotation semantics and remain scoped", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  await page.locator("#prose").evaluate((container) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<p class="beauty-lead" id="lead">An opening paragraph.</p>
      <blockquote class="beauty-callout" id="callout"><p>A block quotation.</p></blockquote>
      <small class="beauty-fine-print" id="attribution">An attribution.</small>
      <p class="beauty-note" id="note">Already invited? <a href="#fixture-title">Log in</a>.</p>
      <small class="beauty-step-marker" id="step" aria-hidden="true">1</small>
      <p><span class="beauty-emphasis" id="emphasis">An emphasized phrase.</span></p>
      <a class="beauty-button" id="action" href="#fixture-title">A prominent link.</a>`,
    );
  });
  await expect(page.locator("#inline-quote")).toHaveCSS("display", "inline");
  await expect(page.locator("#lead")).toHaveCSS("font-size", "20px");
  await expect(page.locator("#callout")).toHaveCSS("display", "block");
  await expect(page.locator("#attribution")).toHaveCSS("font-size", "12px");
  await page.addStyleTag({ content: ".beauty { --beauty-link-weight: 600; }" });
  await expect(page.locator("#note")).toHaveCSS("font-size", "14px");
  await expect(page.locator("#note")).toHaveCSS("color", "rgb(85, 102, 119)");
  await expect(page.locator("#note a")).toHaveCSS("font-weight", "400");
  await expect(page.locator("#note a")).toHaveCSS("text-decoration-line", "underline");
  await expect(page.locator("#step")).toHaveCSS("font-variant-numeric", "lining-nums tabular-nums");
  await expect(page.locator("#step")).toHaveCSS("color", "rgb(0, 96, 160)");
  await expect(page.locator("#emphasis")).toHaveCSS("text-decoration-style", "wavy");
  await expect(page.locator("#action")).toHaveCSS("font-weight", "600");
  await expect(page.locator("#action")).toHaveCSS("text-decoration-line", "none");
});

test("reading text is responsive and compound links underline only their label", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  await page.addStyleTag({
    content: ".beauty { --beauty-font-weight: 300; --beauty-link-weight: 500; }",
  });
  await page
    .locator("#prose")
    .evaluate((container) =>
      container.insertAdjacentHTML(
        "beforeend",
        '<article class="beauty-reading" id="reading"><p>A comfortable reading measure.</p>' +
          '<a id="compound" href="#fixture-title"><span class="beauty-link-label" id="compound-label">All articles</span>' +
          '<span class="beauty-link-icon" id="compound-icon" aria-hidden="true">→</span></a></article>',
      ),
    );
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#reading")).toHaveCSS("font-size", "16px");
  await expect(page.locator("#reading")).toHaveCSS("max-inline-size", "680px");
  await expect(page.locator("#compound")).toHaveCSS("text-decoration-line", "none");
  await expect(page.locator("#compound-label")).toHaveCSS("text-decoration-line", "underline");
  await expect(page.locator("#compound-label")).toHaveCSS("font-weight", "500");
  await expect(page.locator("#compound-icon")).toHaveCSS("font-weight", "300");
  const beforeIcon = await page
    .locator("#reading")
    .evaluate((node) => node.getBoundingClientRect().height);
  await page.locator("#compound-icon").evaluate((node) => {
    node.innerHTML =
      '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" aria-hidden="true" focusable="false"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';
  });
  const iconBox = await page.locator("#compound-icon svg").boundingBox();
  expect(iconBox.width).toBeCloseTo(16, 1);
  expect(iconBox.height).toBeCloseTo(16, 1);
  expect(
    await page.locator("#reading").evaluate((node) => node.getBoundingClientRect().height),
  ).toBeCloseTo(beforeIcon, 1);
  await expect(page.getByRole("link", { name: "All articles", exact: true })).toBeVisible();
  await page.locator("#compound").hover();
  expect(
    await page.locator("#compound-icon").evaluate((node) => getComputedStyle(node).color),
  ).toBe(await page.locator("#compound").evaluate((node) => getComputedStyle(node).color));
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator("#reading")).toHaveCSS("font-size", "16px");
  await expect(page.locator("#outside-paragraph")).toHaveCSS("font-size", "16px");
  await page.addStyleTag({
    content:
      "#reading { --beauty-reading-size: 1.125rem; --beauty-reading-size-small: 1.0625rem; }",
  });
  await expect(page.locator("#reading")).toHaveCSS("font-size", "17px");
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#reading")).toHaveCSS("font-size", "18px");
});

for (const path of ["/examples/classless.html", "/examples/prose.html"]) {
  test(`${path} stays inside narrow and wide viewports`, async ({ page }) => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
      const code = await page
        .locator("#wide-code")
        .evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth }));
      expect(code.scroll).toBeGreaterThan(code.width);
      await expect(page.locator("#sample-image")).toHaveJSProperty("complete", true);
    }
  });
}

test("system dark scheme works without JavaScript; an explicit light choice wins", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/examples/classless.html");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(26, 26, 26)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-theme", "light"));
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await context.close();
});

test("each prose container can choose its own scheme", async ({ page }) => {
  await page.goto("/examples/prose.html");
  await page.locator("#prose").evaluate((element) => {
    element.dataset.theme = "dark";
  });
  await expect(page.locator("#prose")).toHaveCSS("background-color", "rgb(26, 26, 26)");
  await expect(page.locator("#paragraph")).toHaveCSS("color", "rgb(199, 204, 209)");
  await page.locator("#prose").evaluate((element) => {
    element.dataset.theme = "light";
  });
  await expect(page.locator("#prose")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("native controls, inline quotations, focus and hidden content keep their meaning", async ({
  page,
  browserName,
}) => {
  await page.goto("/examples/classless.html");
  await expect(page.locator("#inline-quote")).toHaveCSS("display", "inline");
  await expect(page.locator("#hidden-control")).toBeHidden();
  await expect(page.locator("#wide-table")).toHaveCSS("display", "table");
  // Safari on macOS includes links with Option-Tab unless full keyboard access is enabled.
  await page.keyboard.press(
    browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab",
  );
  await expect(page.locator("#content-link")).toBeFocused();
  await expect(page.locator("#content-link")).toHaveCSS("outline-style", "solid");
  await page.locator("#checkbox").check();
  await expect(page.locator("#checkbox")).toBeChecked();
  await page.getByText("Read a little more", { exact: true }).click();
  await expect(page.getByText("Native disclosure needs no script.")).toBeVisible();
});

test("right-to-left prose puts the quotation rule on the reading edge", async ({ page }) => {
  await page.goto("/examples/rtl.html");
  await expect(page.locator("blockquote")).toHaveCSS("border-right-width", "2px");
  await expect(page.locator("blockquote")).toHaveCSS("border-left-width", "0px");
});

test("print wraps long code and sample output in both entries without changing screen scrolling", async ({
  page,
}) => {
  const source = "long_identifier_".repeat(80);
  for (const entry of ["classless", "prose"]) {
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/examples/${entry}.html`);
    await page.locator(entry === "prose" ? "#prose" : "body").evaluate((container, text) => {
      for (const tag of ["code", "samp"]) {
        const pre = document.createElement("pre");
        pre.id = `print-${tag}`;
        const content = document.createElement(tag);
        content.textContent = text;
        pre.append(content);
        container.append(pre);
      }
    }, source);
    for (const tag of ["code", "samp"]) {
      expect(
        await page.locator(`#print-${tag}`).evaluate((node) => node.scrollWidth > node.clientWidth),
      ).toBeTruthy();
    }
    await page.emulateMedia({ media: "print" });
    for (const tag of ["code", "samp"]) {
      const output = page.locator(`#print-${tag}`);
      expect(
        await output.evaluate((node) => node.scrollWidth <= node.clientWidth + 1),
      ).toBeTruthy();
      await expect(output).toHaveText(source);
    }
  }
});

test("print restores a light page after an explicit dark choice", async ({ page }) => {
  await page.goto("/examples/classless.html");
  await page.locator("html").evaluate((element) => {
    element.dataset.theme = "dark";
  });
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("#paragraph")).toHaveCSS("color", "rgb(0, 0, 0)");
});

for (const scheme of ["light", "dark"]) {
  test(`${scheme} documentation passes automated accessibility checks`, async ({ page }) => {
    await page.goto(scheme === "light" ? "/" : "/ru/");
    await page.locator("#theme").selectOption(scheme);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      scheme === "dark" ? "rgb(26, 26, 26)" : "rgb(255, 255, 255)",
    );
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test("connected steps stay scoped, fit small screens and follow text direction", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/examples/${entry}.html`);
    await page.locator(entry === "prose" ? "#prose" : "main").evaluate((container) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<ol class="beauty-steps" id="steps" role="list">
        <li><small class="beauty-step-marker" aria-hidden="true">1</small><div><h3>Make a clear plan</h3><p>Choose a useful goal and agree on the next steps.</p></div></li>
        <li><small class="beauty-step-marker" aria-hidden="true">2</small><div><h3>Share the result</h3><p>Explain what changed.</p></div></li>
      </ol>`,
      );
    });
    const list = page.locator("#steps");
    await expect(list).toHaveCSS("display", "grid");
    await expect(list.locator("small").first()).toHaveCSS("width", "24px");
    await expect(list.locator("li").last()).toHaveCSS("margin-top", "0px");
    expect(await list.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    for (const dir of ["ltr", "rtl"]) {
      await list.evaluate((node, value) => node.setAttribute("dir", value), dir);
      const geometry = await list
        .locator("li")
        .first()
        .evaluate((node) => {
          const marker = node.querySelector("small").getBoundingClientRect();
          const text = node.querySelector("div").getBoundingClientRect();
          const rule = getComputedStyle(node, "::after");
          return {
            marker: marker.x,
            text: text.x,
            line: rule.borderInlineStartWidth,
            content: rule.content,
          };
        });
      expect(
        dir === "ltr" ? geometry.marker < geometry.text : geometry.marker > geometry.text,
      ).toBe(true);
      expect(geometry.line).toBe("1px");
      expect(geometry.content).toBe('""');
    }
    expect(
      await list
        .locator("li")
        .last()
        .evaluate((node) => getComputedStyle(node, "::after").content),
    ).toBe("none");
    if (entry === "prose") {
      await list.evaluate((node) => {
        const clone = node.cloneNode(true);
        clone.id = "outside-steps";
        document.body.append(clone);
      });
      await expect(page.locator("#outside-steps")).not.toHaveCSS("display", "grid");
    }
  }
});

test("catalog examples reveal copyable source and forms never submit", async ({ page }) => {
  await page.goto("/ru/");
  const source = page.locator(".source").first();
  await source.locator("summary").click();
  await expect(source.locator("pre")).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.copiedExample = value;
        },
      },
    });
  });
  await source.locator(".copy-button").click();
  expect(await page.evaluate(() => window.copiedExample)).toBe(
    await source.locator("pre").textContent(),
  );
  const url = page.url();
  await page.locator("#button-email").fill("reader@example.com");
  await page.locator('input[type="submit"]').click();
  await expect(page.locator('[data-example-form] [role="status"]')).toContainText(
    "никуда не отправлены",
  );
  expect(page.url()).toBe(url);
  await page.locator('input[type="reset"]').click();
  await expect(page.locator("#button-email")).toHaveValue("");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#contents-disclosure")).not.toHaveAttribute("open", "");
  await page.locator("#contents-disclosure > summary").click();
  await expect(page.locator('.contents a[href="#palette"]')).toBeVisible();
});

test("list markers inherit text weight and item spacing stays configurable", async ({ page }) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    const root = entry === "prose" ? ".beauty" : "body";
    await page
      .locator(root)
      .evaluate((node) =>
        node.insertAdjacentHTML(
          "beforeend",
          '<ol id="list-fixture"><li>First item</li><li><strong>Emphasis</strong> within an item<ul><li>Nested item</li></ul></li></ol><ol id="loose-list"><li><p>First paragraph</p><p>Second paragraph</p></li><li><p>Next item</p></li></ol>',
        ),
      );
    const item = page.locator("#list-fixture > li").first();
    const weights = await item.evaluate((node) => [
      getComputedStyle(node).fontWeight,
      getComputedStyle(node, "::marker").fontWeight,
    ]);
    expect(weights[1]).toBe(weights[0]);
    expect(
      Number.parseFloat(await item.evaluate((node) => getComputedStyle(node).marginBlockEnd)),
    ).toBeCloseTo(14, 1);
    const looseGap = () =>
      page
        .locator("#loose-list > li")
        .evaluateAll(
          ([first, second]) =>
            second.getBoundingClientRect().top - first.getBoundingClientRect().bottom,
        );
    expect(await looseGap()).toBeCloseTo(14, 1);
    expect(
      await page
        .locator("#loose-list p")
        .first()
        .evaluate((p) => parseFloat(getComputedStyle(p).marginBlockEnd)),
    ).toBeGreaterThan(0);
    await page
      .locator("#loose-list")
      .evaluate((list) => list.style.setProperty("--beauty-list-gap", "4px"));
    expect(await looseGap()).toBeCloseTo(4, 1);
    await expect(page.locator("#list-fixture strong")).toHaveCSS("font-weight", "600");
    await page
      .locator("#list-fixture")
      .evaluate((node) => node.style.setProperty("--beauty-list-gap", "1em"));
    await expect(item).toHaveCSS("margin-bottom", "16px");
  }
});

test("footnotes keep their numbers for every first block, focus, print and prose scope", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    const root = entry === "prose" ? ".beauty" : "body";
    await page.locator(root).evaluate((node) =>
      node.insertAdjacentHTML(
        "beforeend",
        `
      <p>Reference<sup><a id="notes-ref" class="beauty-footnote-ref" href="#notes-1">1</a></sup>.</p>
      <div class="beauty-footnotes" id="notes-fixture"><hr><ol role="list">
        <li id="notes-1"><p>A paragraph. <a class="beauty-footnote-backref" href="#notes-ref">↩</a></p></li>
        <li><blockquote><p>A quotation.</p></blockquote></li>
        <li><ul><li>A nested list.</li></ul></li>
        <li><pre><code>source()</code></pre></li>
      </ol></div>`,
      ),
    );
    const leading = await page.locator(root).evaluate((node) => {
      const fixture = document.createElement("div");
      fixture.style.cssText = "font-size:20px;line-height:1.1";
      fixture.innerHTML = '<p style="margin:0">First line.<br>Second line.<br>Third line.</p>';
      node.append(fixture);
      const paragraph = fixture.firstElementChild;
      const plain = paragraph.getBoundingClientRect().height;
      paragraph.innerHTML =
        'First line<sup><a class="beauty-footnote-ref" href="#notes-1">1</a></sup>.<br>Second line<sup><a class="beauty-footnote-ref" href="#notes-1">2</a></sup>.<br>Third line.';
      const withNotes = paragraph.getBoundingClientRect().height;
      fixture.remove();
      return { plain, withNotes };
    });
    expect(leading.withNotes).toBeCloseTo(leading.plain, 1);
    const ref = page.locator("#notes-ref");
    await expect(ref).toHaveCSS("text-decoration-line", "none");
    await ref.focus();
    await expect(ref).toHaveCSS("outline-style", "solid");
    await expect(ref).toHaveCSS("outline-width", "2px");
    for (const scheme of ["light", "dark"]) {
      await page
        .locator(root)
        .evaluate((node, value) => node.setAttribute("data-theme", value), scheme);
      for (const width of [375, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const markers = await page.locator("#notes-fixture > ol > li").evaluateAll((nodes) =>
          nodes.map((node) => ({
            content: getComputedStyle(node, "::before").content,
            position: getComputedStyle(node, "::before").position,
            size: Number.parseFloat(getComputedStyle(node, "::before").fontSize),
          })),
        );
        expect(
          markers.every(
            (marker) =>
              marker.content.includes("list-item") &&
              marker.position === "absolute" &&
              marker.size > 0,
          ),
        ).toBe(true);
      }
    }
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("#notes-fixture")).toBeVisible();
    await page.emulateMedia({ media: "screen" });
    if (entry === "prose") {
      await page.locator("#notes-fixture").evaluate((node) => node.classList.add("not-beauty"));
      const content = await page
        .locator("#notes-1")
        .evaluate((node) => getComputedStyle(node, "::before").content);
      expect(["none", "normal"]).toContain(content);
    }
  }
});

test("editorial numerals and hanging quotes stay scoped and preserve the text", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    await page.evaluate(() => {
      const host = document.querySelector(".beauty") || document.body;
      host.insertAdjacentHTML(
        "beforeend",
        `<article id="editorial" class="beauty-prose-numerals">
        <h2 id="hanging"><span class="beauty-hanging-open">«</span><span id="first-word">Words</span> and figures»</h2>
        <p id="prose-number">In 2021, <em id="em-number">15 years</em>.
          <code id="code-number">2021</code><sup id="note-number">2</sup>
          <time id="date-number">2026-11-10</time><span class="beauty-lining-nums" id="score">7/10</span>
          <span class="beauty-fraction" id="fraction"><span>1</span>/<span>3</span></span></p>
        <blockquote><p id="quote-number">2021</p></blockquote>
        <figure class="beauty-quotation"><blockquote><p id="figure-number">2021</p></blockquote>
          <figcaption id="attribution-number">Interview, 2021</figcaption></figure>
        <figure class="beauty-quotation" data-typography="off"><blockquote><p id="plain-quote-number">2021</p></blockquote></figure>
        <p class="beauty-caption" id="caption-number">2021</p>
        <p data-typography="off" id="off-number">2021</p>
        <table><tbody><tr><td id="table-number">2021</td></tr></tbody></table>
        <ol><li id="list-number">2021</li></ol>
      </article>`,
      );
    });
    // Hanging punctuation needs outer space; the unstyled host in the prose
    // fixture has only the browser's default 8px body margin.
    await page.addStyleTag({ content: "#editorial { margin-inline: 1em; }" });
    for (const id of ["prose-number", "em-number", "quote-number", "figure-number"])
      await expect(page.locator(`#${id}`)).toHaveCSS(
        "font-variant-numeric",
        "oldstyle-nums proportional-nums",
      );
    for (const id of ["code-number", "note-number", "date-number", "score", "off-number"])
      await expect(page.locator(`#${id}`)).toHaveCSS("font-variant-numeric", "lining-nums");
    for (const id of ["caption-number", "attribution-number", "list-number", "plain-quote-number"])
      await expect(page.locator(`#${id}`)).toHaveCSS("font-variant-numeric", "normal");
    await expect(page.locator("#table-number")).toHaveCSS(
      "font-variant-numeric",
      "lining-nums tabular-nums",
    );
    await expect(page.locator("#fraction")).toHaveCSS(
      "font-variant-numeric",
      "lining-nums proportional-nums",
    );
    await expect(page.locator("#hanging")).toHaveText("«Words and figures»");
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const dir of ["ltr", "rtl"]) {
        await page.locator("#hanging").evaluate((node, direction) => {
          node.dir = direction;
        }, dir);
        const edges = await page
          .locator(".beauty-hanging-open")
          .last()
          .evaluate((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            const ink = range.getBoundingClientRect(),
              box = node.getBoundingClientRect();
            return {
              ink: { left: ink.left, right: ink.right, width: ink.width },
              box: { left: box.left, width: box.width },
            };
          });
        expect(edges.box.width).toBe(0);
        expect(edges.ink.width).toBeGreaterThan(0);
        expect(
          Math.abs((dir === "ltr" ? edges.ink.right : edges.ink.left) - edges.box.left),
        ).toBeLessThan(1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
    await page.emulateMedia({ media: "print" });
    expect(
      (await page.locator("#hanging .beauty-hanging-open").boundingBox()).width,
    ).toBeGreaterThan(0);
    await page.emulateMedia({ media: "screen" });
  }
});
