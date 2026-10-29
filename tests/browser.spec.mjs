import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("trailing header actions stay at the inline end when navigation wraps", async ({ page }) => {
  await page.goto("/examples/classless.html");
  await page.evaluate(() => {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<header><nav aria-label="Account navigation" id="navigation">
        <strong id="brand">Example website</strong>
        <div class="beauty-nav-end" id="actions"><button type="button">Continue with your account</button></div>
      </nav></header>`,
    );
  });
  for (const direction of ["ltr", "rtl"]) {
    await page.evaluate((value) => (document.documentElement.dir = value), direction);
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const navigation = await page.locator("#navigation").boundingBox();
      const actions = await page.locator("#actions").boundingBox();
      const edge = direction === "ltr" ? actions.x + actions.width : actions.x;
      const expected = direction === "ltr" ? navigation.x + navigation.width : navigation.x;
      expect(Math.abs(edge - expected)).toBeLessThan(1);
      if (width === 375) {
        const brand = await page.locator("#brand").boundingBox();
        expect(actions.y).toBeGreaterThanOrEqual(brand.y + brand.height);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
    }
  }
});

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
      <p><span class="beauty-emphasis" id="emphasis">An emphasized phrase.</span></p>
      <a class="beauty-button" id="action" href="#fixture-title">A prominent link.</a>`,
    );
  });
  await expect(page.locator("#inline-quote")).toHaveCSS("display", "inline");
  await expect(page.locator("#lead")).toHaveCSS("font-size", "20px");
  await expect(page.locator("#callout")).toHaveCSS("display", "block");
  await expect(page.locator("#attribution")).toHaveCSS("font-size", "12px");
  await expect(page.locator("#emphasis")).toHaveCSS("text-decoration-style", "wavy");
  await expect(page.locator("#action")).toHaveCSS("font-weight", "600");
  await expect(page.locator("#action")).toHaveCSS("text-decoration-line", "none");
});

test("a host can give native quotations and callouts the same frame through tokens", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  await page.addStyleTag({
    content: `.beauty {
    --beauty-quote-background: #fffaf1;
    --beauty-quote-border: 1px solid #222;
    --beauty-quote-inset: 0;
    --beauty-quote-padding: 1.2rem;
    --beauty-quote-padding-end: 1.2rem;
    --beauty-quote-padding-block: 0.5rem;
    --beauty-quote-margin-block: 1.2em;
    --beauty-quote-text: var(--beauty-text);
    --beauty-callout-background: #fffaf1;
    --beauty-callout-border: 1px solid #222;
  }`,
  });
  await page
    .locator("#prose")
    .evaluate((container) =>
      container.insertAdjacentHTML(
        "beforeend",
        '<blockquote id="native-frame"><p>The first paragraph.</p><p>The second paragraph.</p></blockquote>' +
          '<blockquote class="beauty-callout" id="callout-frame"><p>The first paragraph.</p><p>The second paragraph.</p></blockquote>',
      ),
    );
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const styles = await page.locator("#native-frame,#callout-frame").evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return Object.fromEntries(
          [
            "fontFamily",
            "fontSize",
            "fontWeight",
            "fontStyle",
            "color",
            "backgroundColor",
            "borderInlineStart",
            "padding",
            "margin",
            "width",
            "height",
          ].map((name) => [name, style[name]]),
        );
      }),
    );
    expect(styles[0]).toEqual(styles[1]);
  }
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

test("captions stay close to their image and short semantic values do not split", async ({
  page,
}) => {
  await page.goto("/examples/prose.html");
  await page
    .locator("#prose")
    .evaluate((container) =>
      container.insertAdjacentHTML(
        "beforeend",
        '<p id="caption-image"><img src="../assets/specimen.svg" width="160" height="60" alt="Sample"></p>' +
          '<p class="beauty-caption" id="image-caption">A caption.</p>' +
          '<p><time id="unbroken-date" datetime="2026-10-28">28 October 2026</time></p>' +
          '<p><span class="beauty-nowrap" id="unbroken-value">300 students</span></p>',
      ),
    );
  const margins = await page.locator("#caption-image, #prose > p").evaluateAll((nodes) =>
    nodes.map((node) => ({
      id: node.id,
      bottom: parseFloat(getComputedStyle(node).marginBottom),
    })),
  );
  expect(margins.find((node) => node.id === "caption-image").bottom).toBeLessThan(
    margins.find((node) => node.id === "long-text").bottom,
  );
  await expect(page.locator("#unbroken-date")).toHaveCSS("white-space", "nowrap");
  await expect(page.locator("#unbroken-value")).toHaveCSS("white-space", "nowrap");
});

for (const path of ["/", "/ru/", "/examples/classless.html", "/examples/prose.html"]) {
  test(`${path} stays inside narrow and wide viewports`, async ({ page }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
      if (path.includes("examples")) {
        const code = await page
          .locator("#wide-code")
          .evaluate((element) => ({ width: element.clientWidth, scroll: element.scrollWidth }));
        expect(code.scroll).toBeGreaterThan(code.width);
        await expect(page.locator("#sample-image")).toHaveJSProperty("complete", true);
      }
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
  test(`${scheme} documentation passes automated accessibility checks`, async ({
    page,
  }, testInfo) => {
    for (const path of ["/", "/ru/"]) {
      await page.goto(path);
      await page.locator("#theme").selectOption(scheme);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        scheme === "dark" ? "rgb(26, 26, 26)" : "rgb(255, 255, 255)",
      );
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
      if (testInfo.project.name === "chromium" && path === "/") {
        await page.screenshot({
          path: testInfo.outputPath(`${scheme}-desktop.png`),
          fullPage: false,
        });
        await page.setViewportSize({ width: 375, height: 812 });
        await page.screenshot({
          path: testInfo.outputPath(`${scheme}-mobile.png`),
          fullPage: false,
        });
      }
    }
  });
}
