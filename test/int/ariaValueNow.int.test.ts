import { virtual } from "../../src";

describe("Label Priority Replacement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("progressbar", () => {
    it("should announce aria-valuenow on progressbar roles as a percentage when no range is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1">
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
        "progressbar, Label, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a percentage when only aria-valuemin is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemin="1">
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
        "progressbar, Label, min value 1, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a percentage when only aria-valuemax is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemax="3">
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
        "progressbar, Label, max value 3, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a percentage when only min is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1" min="1">
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
        "progressbar, Label, min value 1, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a percentage when only max is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1" max="3">
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
        "progressbar, Label, max value 3, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a zero percentage of a positive aria-valuemin - aria-valuemax range", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemin="1" aria-valuemax="3">
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
        "progressbar, Label, max value 3, min value 1, current value 0%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a non-zero percentage of a positive aria-valuemin - aria-valuemax range", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="1" aria-valuemax="3">
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
        "progressbar, Label, max value 3, min value 1, current value 50%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a non-zero percentage rounded to at most 2 decimal places", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="0" aria-valuemax="3">
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
        "progressbar, Label, max value 3, min value 0, current value 66.67%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on progressbar roles as a percentage of a range spanning across 0", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="progressbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="-2" aria-valuemax="3">
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
        "progressbar, Label, max value 3, min value -2, current value 80%"
      );

      await virtual.stop();
    });
  });

  describe("scrollbar", () => {
    it("should announce aria-valuenow on scrollbar roles as a percentage when no range is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1">
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
        "scrollbar, Label, orientated vertically, max value 100, min value 0, current value 1%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a percentage when only aria-valuemin is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemin="1">
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
        "scrollbar, Label, orientated vertically, max value 100, min value 1, current value 0%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a percentage when only aria-valuemax is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemax="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value 0, current value 33.33%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a percentage when only min is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1" min="1">
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
        "scrollbar, Label, orientated vertically, max value 100, min value 1, current value 0%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a percentage when only max is provided", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1" max="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value 0, current value 33.33%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a zero percentage of a positive aria-valuemin - aria-valuemax range", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="1" aria-valuemin="1" aria-valuemax="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value 1, current value 0%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a non-zero percentage of a positive aria-valuemin - aria-valuemax range", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="1" aria-valuemax="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value 1, current value 50%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a non-zero percentage rounded to at most 2 decimal places", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="0" aria-valuemax="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value 0, current value 66.67%"
      );

      await virtual.stop();
    });

    it("should announce aria-valuenow on scrollbar roles as a percentage of a range spanning across 0", async () => {
      document.body.innerHTML = `
      <span id="element1">Label</span>
      <span role="scrollbar" aria-labelledby="element1" aria-valuenow="2" aria-valuemin="-2" aria-valuemax="3">
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
        "scrollbar, Label, orientated vertically, max value 3, min value -2, current value 80%"
      );

      await virtual.stop();
    });
  });
});
