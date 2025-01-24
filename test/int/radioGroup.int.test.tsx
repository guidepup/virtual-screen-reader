import React from "react";
import { render } from "@testing-library/react";
import { virtual } from "../../src/index.js";

it("should work for sibling radio inputs", async () => {
  const { container } = render(
    <main>
      <fieldset>
        <legend>Example</legend>
        <input type="radio" name="example" id="option1" />
        <label htmlFor="option1">Option 1</label>
        <input type="radio" name="example" id="option2" />
        <label htmlFor="option2">Option 2</label>
      </fieldset>
    </main>
  );

  await virtual.start({ container });

  while ((await virtual.lastSpokenPhrase()) !== "end of main") {
    await virtual.next();
  }

  expect(await virtual.spokenPhraseLog()).toEqual([
    "main",
    "group, Example",
    "Example",
    "radio, Option 1, not checked, position 1, set size 2",
    "Option 1",
    "radio, Option 2, not checked, position 2, set size 2",
    "Option 2",
    "end of group, Example",
    "end of main",
  ]);
  await virtual.stop();
});

it("should work for nested radio inputs", async () => {
  const { container } = render(
    <main>
      <fieldset>
        <legend>Example</legend>
        <div>
          <input type="radio" name="example" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div>
          <input type="radio" name="example" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </fieldset>
    </main>
  );

  await virtual.start({ container });

  while ((await virtual.lastSpokenPhrase()) !== "end of main") {
    await virtual.next();
  }

  expect(await virtual.spokenPhraseLog()).toEqual([
    "main",
    "group, Example",
    "Example",
    "radio, Option 1, not checked, position 1, set size 2",
    "Option 1",
    "radio, Option 2, not checked, position 2, set size 2",
    "Option 2",
    "end of group, Example",
    "end of main",
  ]);
  await virtual.stop();
});

it("should work for radio inputs when some are hidden", async () => {
  const { container } = render(
    <main>
      <fieldset>
        <legend>Example</legend>
        <input type="radio" name="example" id="option1" />
        <label htmlFor="option1">Option 1</label>
        <input aria-hidden={true} type="radio" name="example" id="option2" />
        <label aria-hidden={true} htmlFor="option2">
          Option 2
        </label>
      </fieldset>
    </main>
  );

  await virtual.start({ container });

  while ((await virtual.lastSpokenPhrase()) !== "end of main") {
    await virtual.next();
  }

  expect(await virtual.spokenPhraseLog()).toEqual([
    "main",
    "group, Example",
    "Example",
    "radio, Option 1, not checked, position 1, set size 1",
    "Option 1",
    "end of group, Example",
    "end of main",
  ]);
  await virtual.stop();
});

it("should consider parent forms when group inputs", async () => {
  const { container } = render(
    <main>
      <form name="formA">
        <fieldset>
          <legend>Example A</legend>
          <input type="radio" name="example" id="option1a" />
          <label htmlFor="option1a">Option 1a</label>
          <input type="radio" name="example" id="option2a" />
          <label htmlFor="option2a">Option 2a</label>
        </fieldset>
      </form>
      <form name="formB">
        <fieldset>
          <legend>Example B</legend>
          <input type="radio" name="example" id="option1b" />
          <label htmlFor="option1b">Option 1b</label>
          <input type="radio" name="example" id="option2b" />
          <label htmlFor="option2b">Option 2b</label>
        </fieldset>
      </form>
    </main>
  );

  await virtual.start({ container });

  while ((await virtual.lastSpokenPhrase()) !== "end of main") {
    await virtual.next();
  }

  expect(await virtual.spokenPhraseLog()).toEqual([
    "main",
    "form",
    "group, Example A",
    "Example A",
    "radio, Option 1a, not checked, position 1, set size 2",
    "Option 1a",
    "radio, Option 2a, not checked, position 2, set size 2",
    "Option 2a",
    "end of group, Example A",
    "end of form",
    "form",
    "group, Example B",
    "Example B",
    "radio, Option 1b, not checked, position 1, set size 2",
    "Option 1b",
    "radio, Option 2b, not checked, position 2, set size 2",
    "Option 2b",
    "end of group, Example B",
    "end of form",
    "end of main",
  ]);
  await virtual.stop();
});
