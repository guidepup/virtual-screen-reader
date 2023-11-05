/* eslint-disable no-undef */

function test(index) {
  const liveRegion = document.querySelector(`#target-${index}`);
  const span = document.createElement("span");

  span.textContent = "DOM was added";

  liveRegion.appendChild(span);
  liveRegion.removeChild(liveRegion.querySelector("[data-remove]"));
  liveRegion.querySelector("[data-change]").textContent = "Content changed";
}

function setupAriaRelevant() {
  document.body.innerHTML = `<div id="content"></div>`;

  ["additions", "removals", "text", "all", "additions text"].forEach(function (
    attr,
    index
  ) {
    const content = document.querySelector("#content");
    const div = document.createElement("div");

    div.innerHTML = `
      <h2>aria-relevant=${attr}</h2>
      <div id="target-${index}" aria-live="assertive" aria-relevant="${attr}">
        <span data-remove>DOM was removed</span>
        <span data-change></span>
      </div>
      <button id="trigger-${index}">Test aria-relevant ${attr}</button>
    `;

    content.appendChild(div);
    document.querySelector(`#trigger-${index}`).onclick = () => test(index);
  });

  return () => {
    document.body.innerHTML = "";
  };
}

module.exports = { setupAriaRelevant };
