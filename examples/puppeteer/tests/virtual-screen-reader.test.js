async function injectVirtualScreenReader() {
  await page.addScriptTag({
    url: "https://unpkg.com/@guidepup/virtual-screen-reader",
    type: "module",
  });

  await page.addScriptTag({
    content: `import { virtual } from "https://unpkg.com/@guidepup/virtual-screen-reader"; window.virtual = virtual;`,
    type: "module",
  });
}

async function startVirtualScreenReader() {
  await page.evaluate(async () => {
    await window.virtual.start({
      container: document.body,
    });
  });
}

async function navigateToEndOfDocument() {
  await page.evaluate(async () => {
    while ((await window.virtual.lastSpokenPhrase()) !== "end of document") {
      await window.virtual.next();
    }
  });
}

async function getSpokenPhraseLog() {
  return await page.evaluate(async () => {
    return await window.virtual.spokenPhraseLog();
  });
}

async function stopVirtualScreenReader() {
  await page.evaluate(async () => {
    await window.virtual.stop();
  });
}

describe("Virtual Screen Reader", () => {
  test("should match expected screen reader output for https://guidepup.dev/", async () => {
    await page.goto("https://guidepup.dev");

    await injectVirtualScreenReader();
    await startVirtualScreenReader();

    try {
      await navigateToEndOfDocument();

      const spokenPhraseLog = await getSpokenPhraseLog();
      expect(spokenPhraseLog).toMatchSnapshot();
    } finally {
      await stopVirtualScreenReader();
    }
  });
});
