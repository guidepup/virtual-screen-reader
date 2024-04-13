 

function setupAriaAtomic(element = "div") {
  document.body.innerHTML = `
  <h2>aria-atomic=false</h2>
  <p>Passes if only "what has changed" is conveyed.</p>

  <div id="target-1" aria-live="assertive" aria-atomic="false">
    <span>Announce</span>
  </div>

  <button id="trigger-1" onclick="testOne()">Test aria-atomic false</button>

  <h2>aria-atomic=true</h2>
  <p>Passes if only "Announce entire region" is conveyed.</p>

  <div id="target-2" aria-live="assertive" aria-atomic="true">
    <span>Announce</span>
  </div>

  <button id="trigger-2" onclick="testTwo()">Test aria-atomic true</button>
`;

  function testOne() {
    const liveRegion = document.querySelector("#target-1");
    const el = document.createElement(element);
    el.textContent = "what has changed";
    liveRegion.appendChild(el);
  }

  function testTwo() {
    const liveRegion = document.querySelector("#target-2");
    const el = document.createElement(element);
    el.textContent = "entire region";
    liveRegion.appendChild(el);
  }

  document.querySelector("#trigger-1").onclick = testOne;
  document.querySelector("#trigger-2").onclick = testTwo;

  return () => {
    document.body.innerHTML = "";
  };
}

module.exports = { setupAriaAtomic };
