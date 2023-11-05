import { virtual } from "../..";

describe("Label Priority Replacement", () => {
  afterEach(async () => {
    await virtual.stop();
    document.body.innerHTML = "";
  });

  it("should announce aria-valuetext in preference to aria-valuenow", async () => {
    document.body.innerHTML = `
    <span id="element1">Pandemic Size:</span>
    <span role="progressbar" aria-labelledby="element1" aria-valuemin="1" aria-valuemax="3" aria-valuenow="1" aria-valuetext="small">
      <svg width="300" height="10">
        <rect height="10" width="100" stroke="black" fill="red" />
        <rect height="10" width="200" fill="white" />
      </svg>
    </span>
    `;

    await virtual.start({ container: document.body });
    await virtual.next();
    await virtual.next();

    expect(await virtual.lastSpokenPhrase()).toBe(
      "progressbar, Pandemic Size:, current value small, max value 3, min value 1"
    );

    await virtual.stop();
  });
});
