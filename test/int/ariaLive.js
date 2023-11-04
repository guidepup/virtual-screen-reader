/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { default: userEvent } = require("@testing-library/user-event");

function setupAriaLive() {
  document.body.innerHTML = `
  <h2>aria-live=off</h2>
  <div id="target-1" aria-live="off"></div>
  <button id="trigger-1">Test aria-live off</button>
  <p id="target-1b" contenteditable="true" tabindex="0" aria-live="off">Existing Content</p>
  <button id="trigger-1b">Test aria-live off</button>

  <h2>aria-live=polite</h2>
  <div id="target-2" aria-live="polite"></div>
  <button id="trigger-2">Test aria-live polite</button>
  <p id="target-2b" contenteditable="true" tabindex="0" aria-live="polite">Existing Content</p>
  <button id="trigger-2b">Test aria-live polite</button>

  <h2>aria-live=assertive</h2>
  <div id="target-3" aria-live="assertive"></div>
  <button id="trigger-3">Test aria-live assertive</button>
  <p id="target-3b" contenteditable="true" tabindex="0" aria-live="assertive">Existing Content</p>
  <button id="trigger-3b">Test aria-live assertive</button>

  <div aria-live="polite" id="first-announcement-text"></div>
  <div aria-live="polite" id="second-announcement-text"></div>

  <!-- -->

  <button id="trigger-fully-defined">Test fully defined</button>
  <div id="target-fully-defined" aria-live="polite" aria-relevant="additions text" aria-atomic="false"></div>
  `;

  const firstAnnouncement =
    "The assertive announcement should interrupt or follow this first announcement.";
  const secondAnnouncement =
    "This second announcement should either be skipped or come after the assertive announcement. Polite announcements will always follow the first two.";
  const firstAnnouncementDiv = document.querySelector(
    "#first-announcement-text"
  );
  const secondAnnouncementDiv = document.querySelector(
    "#second-announcement-text"
  );

  function announce(liveRegion, text) {
    firstAnnouncementDiv.textContent = firstAnnouncement;

    setTimeout(function () {
      secondAnnouncementDiv.textContent = secondAnnouncement;

      setTimeout(function () {
        liveRegion.textContent = text;
        firstAnnouncementDiv.textContent = ""; // clear so that the announcement will happen again
        secondAnnouncementDiv.textContent = ""; // clear so that the announcement will happen again
      }, 10);
    }, 10);
  }

  function testOne() {
    const liveRegion = document.querySelector("#target-1");
    liveRegion.textContent = "I am now populated aria-live=off";
  }

  async function testOneB() {
    const textarea = document.querySelector("#target-1b");
    await userEvent.click(textarea);
    await userEvent.keyboard(" updated aria-live=off");
  }

  function testTwo() {
    announce(
      document.querySelector("#target-2"),
      "I am now populated aria-live=polite"
    );
  }

  async function testTwoB() {
    const textarea = document.querySelector("#target-2b");
    await userEvent.click(textarea);
    await userEvent.keyboard(" updated aria-live=polite");
  }

  function testThree() {
    announce(
      document.querySelector("#target-3"),
      "I am now populated aria-live=assertive"
    );
  }

  async function testThreeB() {
    const textarea = document.querySelector("#target-3b");
    await userEvent.click(textarea);
    await userEvent.keyboard(" updated aria-live=assertive");
  }

  async function testFullyDefined() {
    const liveRegion = document.querySelector("#target-fully-defined");
    liveRegion.textContent = "I am now populated";
  }

  document.querySelector("#trigger-1").onclick = testOne;
  document.querySelector("#trigger-1b").onclick = testOneB;
  document.querySelector("#trigger-2").onclick = testTwo;
  document.querySelector("#trigger-2b").onclick = testTwoB;
  document.querySelector("#trigger-3").onclick = testThree;
  document.querySelector("#trigger-3b").onclick = testThreeB;

  document.querySelector("#trigger-fully-defined").onclick = testFullyDefined;

  return () => {
    document.body.innerHTML = "";
  };
}

module.exports = { setupAriaLive };
