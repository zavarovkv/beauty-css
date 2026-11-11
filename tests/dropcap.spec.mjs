import { test, expect } from "@playwright/test";

for (const entry of ["classless", "prose"]) {
  test(`drop caps preserve text, scope, responsive flow and print (${entry})`, async ({ page }) => {
    await page.goto(`/examples/${entry}.html`);
    const text = "Цель хорошего оформления — помочь читателю войти в историю. ".repeat(5).trim();
    await page.evaluate((text) => {
      const root = document.createElement("div");
      root.className = "beauty";
      root.id = "dropcap-fixture";
      root.innerHTML = `<article class="beauty-dropcap" id="initial"><p>${text}</p><p>Second paragraph.</p></article>
        <article class="beauty-dropcap" id="quoted"><p>“The story begins with a quote.” ${text}</p></article>
        <article class="beauty-dropcap" id="blocked"><blockquote><p>Quotation first.</p></blockquote><p>${text}</p></article>
        <article class="beauty-dropcap" id="note"><p class="beauty-note">A source credit.</p></article>
        <article class="beauty-dropcap" id="escape"><p class="not-beauty">Opted out.</p></article>
        <article class="beauty-dropcap" id="disabled"><p data-typography="off">Literal text.</p></article>`;
      document.body.append(root);
    }, text);
    const initial = page.locator("#initial > p").first();
    const value = (locator) =>
      locator.evaluate((p) => {
        const s = getComputedStyle(p, "::first-letter");
        return (
          s.getPropertyValue("initial-letter") ||
          s.getPropertyValue("-webkit-initial-letter") ||
          "normal"
        );
      });
    const supported = await page.evaluate(
      () => CSS.supports("initial-letter:3") || CSS.supports("-webkit-initial-letter:3"),
    );
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme });
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await value(initial)).toBe(supported ? (width > 768 ? "3" : "2") : "normal");
        await expect(initial).toHaveText(text.trim());
        expect(
          await initial.evaluate((p) => {
            const range = document.createRange();
            range.selectNodeContents(p);
            const selection = getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return selection.toString();
          }),
        ).toBe(text);
        expect(
          await initial.evaluate(
            (p) => getComputedStyle(p, "::first-letter").color === getComputedStyle(p).color,
          ),
        ).toBe(true);
        for (const selector of [
          "#initial > p + p",
          "#blocked p",
          "#note p",
          "#escape p",
          "#disabled p",
        ]) {
          for (const paragraph of await page.locator(selector).all())
            expect(await value(paragraph)).toBe("normal");
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        const first = await initial.boundingBox();
        const next = await page.locator("#initial > p").nth(1).boundingBox();
        expect(next.y).toBeGreaterThanOrEqual(first.y + first.height);
        // Even a one-word opening must reserve the initial's full line count.
        await initial.evaluate((p) => {
          p.textContent = "Цель.";
        });
        if (supported) {
          const short = await initial.evaluate((p) => ({
            height: p.getBoundingClientRect().height,
            leading: parseFloat(getComputedStyle(p).lineHeight),
          }));
          expect(short.height).toBeGreaterThanOrEqual(short.leading * (width > 768 ? 3 : 2) - 1);
        }
        await initial.evaluate((p, text) => {
          p.textContent = text;
        }, text);
        await page.emulateMedia({ media: "print" });
        expect(await value(initial)).toBe("normal");
        await page.emulateMedia({ media: "screen" });
      }
    }
  });
}
