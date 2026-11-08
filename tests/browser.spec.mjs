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

test("page titles balance while section headings wrap naturally in both entries", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    const root = entry === "prose" ? ".beauty" : "body";
    await page.locator(root).evaluate((node) => {
      node.insertAdjacentHTML(
        "beforeend",
        `<section id="heading-wrap-fixture">
          <h1>A page title spanning multiple lines</h1>
          <h2>A section heading spanning multiple lines</h2>
          <h3>Subsection heading</h3>
          <h4>Fourth-level heading</h4>
          <h5>Fifth-level heading</h5>
          <h6>Sixth-level heading</h6>
        </section>`,
      );
    });

    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("#heading-wrap-fixture h1")).toHaveCSS("text-wrap", "balance");
      for (const level of [2, 3, 4, 5, 6]) {
        await expect(page.locator(`#heading-wrap-fixture h${level}`)).toHaveCSS(
          "text-wrap",
          "wrap",
        );
      }
    }

    await page.locator(root).evaluate((node) => {
      node.style.setProperty("--beauty-heading-wrap", "wrap");
      node.style.setProperty("--beauty-section-heading-wrap", "balance");
    });
    await expect(page.locator("#heading-wrap-fixture h1")).toHaveCSS("text-wrap", "wrap");
    await expect(page.locator("#heading-wrap-fixture h2")).toHaveCSS("text-wrap", "balance");
  }
});

test("the heading weight token also configures semantic emphasis in both entries", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    const root = entry === "prose" ? ".beauty" : "body";
    await page.locator(root).evaluate((node) => {
      node.style.setProperty("--beauty-heading-weight", "500");
      node.insertAdjacentHTML(
        "beforeend",
        '<div id="weight-fixture"><h3>Heading</h3><p><strong>Strong</strong> <b>Bold</b></p><dl><dt>Term</dt><dd>Meaning</dd></dl></div>',
      );
    });
    for (const selector of ["h3", "strong", "b", "dt"]) {
      await expect(page.locator(`#weight-fixture ${selector}`)).toHaveCSS("font-weight", "500");
    }
  }
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

test("table headers share a tight text-colored rule across entries and color schemes", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    for (const scheme of ["light", "dark"]) {
      await page.locator(entry === "prose" ? "#prose" : "html").evaluate((element, theme) => {
        element.dataset.theme = theme;
      }, scheme);

      const metrics = await page.locator("#wide-table").evaluate((table) => {
        const heading = getComputedStyle(table.querySelector("thead th"));
        const data = getComputedStyle(table.querySelector("tbody td"));
        return {
          color: heading.color,
          borderColor: heading.borderBottomColor,
          borderWidth: heading.borderBottomWidth,
          paddingEnd: parseFloat(heading.paddingBottom),
          dataBorderColor: data.borderBottomColor,
        };
      });
      expect(metrics.borderWidth).toBe("1px");
      expect(metrics.borderColor).toBe(metrics.color);
      expect(metrics.paddingEnd).toBe(0);
      expect(metrics.dataBorderColor).not.toBe(metrics.color);
    }

    await page.locator("#wide-table").evaluate((table) => {
      table.style.setProperty("--beauty-table-cell-padding", "0.65em 0");
    });
    await expect(page.locator("#wide-table thead th").first()).toHaveCSS("padding-left", "0px");
    await expect(page.locator("#wide-table tbody td").first()).toHaveCSS("padding-left", "0px");
  }
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

test("numeric highlights share responsive type and configurable sizing in both entries", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    await page.locator(entry === "prose" ? "#prose" : "main").evaluate((container) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<dl id="statistics"><dt class="beauty-stat-label">Tasks completed</dt><dd class="beauty-stat-value">120</dd></dl>`,
      );
    });
    const value = page.locator("#statistics dd");
    const label = page.locator("#statistics dt");
    await expect(value).toHaveCSS("color", "rgb(0, 96, 160)");
    for (const [width, size] of [
      [1280, "56px"],
      [375, "45px"],
      [320, "40px"],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(value).toHaveCSS("font-size", size);
      await expect(value).toHaveCSS("font-variant-numeric", "lining-nums tabular-nums");
      await expect(label).toHaveCSS("font-size", "14px");
      await expect(label).toHaveCSS("font-weight", "400");
    }
    await page.addStyleTag({ content: ".beauty-stat-value { --beauty-stat-size: 40px; }" });
    await expect(value).toHaveCSS("font-size", "40px");
  }
});

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

test("input and textarea placeholders follow the muted token within their scope", async ({
  page,
}) => {
  for (const entry of ["classless", "prose"]) {
    await page.goto(`/examples/${entry}.html`);
    await page.addStyleTag({ content: ":root, .beauty { --beauty-muted: #123456; }" });
    await page.locator(entry === "prose" ? "#prose" : "main").evaluate((container) => {
      container.insertAdjacentHTML(
        "beforeend",
        `<input id="hint-input" placeholder="Your name"><textarea id="hint-textarea" placeholder="Your message"></textarea>`,
      );
      document
        .querySelector("#escape")
        .insertAdjacentHTML("beforeend", `<input id="escape-hint" placeholder="Independent hint">`);
      if (container.classList.contains("beauty"))
        document.body.insertAdjacentHTML(
          "beforeend",
          `<input id="outside-hint" placeholder="Outside hint">`,
        );
    });
    const placeholder = (selector) =>
      page.locator(selector).evaluate((node) => {
        const style = getComputedStyle(node, "::placeholder");
        return { color: style.color, opacity: style.opacity };
      });
    for (const selector of ["#hint-input", "#hint-textarea"]) {
      expect(await placeholder(selector)).toEqual({ color: "rgb(18, 52, 86)", opacity: "1" });
    }
    const independent = entry === "prose" ? ["#escape-hint", "#outside-hint"] : ["#escape-hint"];
    const withBeauty = await Promise.all(independent.map(placeholder));
    await page.evaluate(() => {
      document.querySelector('link[rel="stylesheet"]').disabled = true;
    });
    expect(await Promise.all(independent.map(placeholder))).toEqual(withBeauty);
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
