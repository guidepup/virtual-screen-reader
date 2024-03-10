import { expect, Page, test } from "@playwright/test";

async function injectVirtualScreenReader({ page }: { page: Page }) {
  await page.addScriptTag({
    url: "https://unpkg.com/@guidepup/virtual-screen-reader",
    type: "module",
  });

  await page.addScriptTag({
    content: `import { virtual } from "https://unpkg.com/@guidepup/virtual-screen-reader"; window.virtual = virtual;`,
    type: "module",
  });
}

async function startVirtualScreenReader({
  headless,
  page,
}: {
  headless: boolean;
  page: Page;
}) {
  await page.evaluate(async (headless) => {
    // @ts-ignore
    await window.virtual.start({
      container: document.body,
      displayCursor: !headless,
    });
  }, headless);
}

async function navigateToEndOfDocument({ page }: { page: Page }) {
  await page.evaluate(async () => {
    // @ts-ignore
    while ((await window.virtual.lastSpokenPhrase()) !== "end of document") {
      // @ts-ignore
      await window.virtual.next();
    }
  });
}

async function getSpokenPhraseLog({ page }: { page: Page }) {
  const spokenPhraseLog = await page.evaluate(async () => {
    // @ts-ignore
    return await window.virtual.spokenPhraseLog();
  });

  return JSON.stringify(spokenPhraseLog, undefined, 2);
}

async function stopVirtualScreenReader({ page }: { page: Page }) {
  await page.evaluate(async () => {
    // @ts-ignore
    await window.virtual.stop();
  });
}

test("should match expected screen reader output for https://guidepup.dev/", async ({
  page,
}, testInfo) => {
  const headless = testInfo.project.use.headless ?? true;

  await page.goto("https://guidepup.dev/");

  await injectVirtualScreenReader({ page });
  await startVirtualScreenReader({ page, headless });

  try {
    await navigateToEndOfDocument({ page });

    const spokenPhraseLog = await getSpokenPhraseLog({ page });
    expect(spokenPhraseLog).toMatchSnapshot();
  } finally {
    await stopVirtualScreenReader({ page });
  }
});
