import { virtual } from "../../src/index.js";

describe("Aria Details", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should handle linked details", async () => {
    document.body.innerHTML = `
    <img src="pythagorean.jpg" alt="Pythagorean Theorem" aria-details="det">
    <details id="det">
      <summary>Example</summary>
      <p>
        The Pythagorean Theorem is a relationship in Euclidean Geometry between the three sides of
        a right triangle, where the square of the hypotenuse is the sum of the squares of the two
        opposing sides.
      </p>
      <p>
        The following drawing illustrates an application of the Pythagorean Theorem when used to
        construct a skateboard ramp.
      </p>
      <object data="skatebd-ramp.svg"  type="image/svg+xml"></object>
      <p>
        In this example you will notice a skateboard with a base and vertical board whose width
        is the width of the ramp. To compute how long the ramp must be, simply calculate the
        base length, square it, sum it with the square of the height of the ramp, and take the
        square root of the sum.
      </p>
    </details>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "image, Pythagorean Theorem, linked details",
    ]);

    await virtual.stop();
  });

  it("should gracefully handle an invalid idRef", async () => {
    document.body.innerHTML = `
    <img src="pythagorean.jpg" alt="Pythagorean Theorem" aria-details="det">
    `;

    await virtual.start({ container: document.body });
    await virtual.next();

    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "image, Pythagorean Theorem",
    ]);

    await virtual.stop();
  });
});
