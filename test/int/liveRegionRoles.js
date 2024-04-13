 

function setupLiveRegionRoles() {
  document.body.innerHTML = `
  <h2>role=alert</h2>
  <div id="target-alert" role="alert">Initial Content <span id="target-alert-span"> Empty</span></div>
  <button id="trigger-alert">Test alert role</button>

  <h2>role=alert aria-atomic=false</h2>
  <div id="target-alert-non-atomic" role="alert" aria-atomic="false">Initial Content <span id="target-alert-non-atomic-span"> Empty</span></div>
  <button id="trigger-alert-non-atomic">Test alert role</button>

  <h2>role=log</h2>
  <div id="target-log" role="log">Initial Content <span id="target-log-span"> Empty</span></div>
  <button id="trigger-log">Test log role</button>

  <h2>role=marquee</h2>
  <div id="target-marquee" role="marquee">Initial Content <span id="target-marquee-span"> Empty</span></div>
  <button id="trigger-marquee">Test marquee role</button>

  <h2>role=status</h2>
  <div id="target-status" role="status">Initial Content <span id="target-status-span"> Empty</span></div>
  <button id="trigger-status">Test status role</button>

  <h2>role=status aria-atomic=false</h2>
  <div id="target-status-non-atomic" role="status" aria-atomic="false">Initial Content <span id="target-status-non-atomic-span"> Empty</span></div>
  <button id="trigger-status-non-atomic">Test status role</button>

  <h2>role=timer</h2>
  <div id="target-timer" role="timer">Initial Content <span id="target-timer-span"> Empty</span></div>
  <button id="trigger-timer">Test timer role</button>

  <h2>role=alertdialog</h2>
  <div id="target-alertdialog" role="alertdialog">Initial Content <span id="target-alertdialog-span"> Empty</span></div>
  <button id="trigger-alertdialog">Test alertdialog role</button>

  <h2>role=alertdialog aria-atomic=false</h2>
  <div id="target-alertdialog-non-atomic" role="alertdialog" aria-atomic="false">Initial Content <span id="target-alertdialog-non-atomic-span"> Empty</span></div>
  <button id="trigger-alertdialog-non-atomic">Test alertdialog role</button>
  `;

  function announce(liveRegion, text) {
    liveRegion.textContent = text;
  }

  function testAlert() {
    announce(
      document.querySelector("#target-alert-span"),
      "Populated role=alert"
    );
  }

  function testAlertNonAtomic() {
    announce(
      document.querySelector("#target-alert-non-atomic-span"),
      "Populated role=alert"
    );
  }

  function testLog() {
    announce(document.querySelector("#target-log-span"), "Populated role=log");
  }

  function testMarquee() {
    announce(
      document.querySelector("#target-marquee-span"),
      "Populated role=marquee"
    );
  }

  function testStatus() {
    announce(
      document.querySelector("#target-status-span"),
      "Populated role=status"
    );
  }

  function testStatusNonAtomic() {
    announce(
      document.querySelector("#target-status-non-atomic-span"),
      "Populated role=status"
    );
  }

  function testTimer() {
    announce(
      document.querySelector("#target-timer-span"),
      "Populated role=timer"
    );
  }

  function testAlertdialog() {
    announce(
      document.querySelector("#target-alertdialog-span"),
      "Populated role=alertdialog"
    );
  }

  function testAlertdialogNonAtomic() {
    announce(
      document.querySelector("#target-alertdialog-non-atomic-span"),
      "Populated role=alertdialog"
    );
  }

  document.querySelector("#trigger-alert").onclick = testAlert;
  document.querySelector("#trigger-alert-non-atomic").onclick =
    testAlertNonAtomic;
  document.querySelector("#trigger-log").onclick = testLog;
  document.querySelector("#trigger-marquee").onclick = testMarquee;
  document.querySelector("#trigger-status").onclick = testStatus;
  document.querySelector("#trigger-status-non-atomic").onclick =
    testStatusNonAtomic;
  document.querySelector("#trigger-timer").onclick = testTimer;
  document.querySelector("#trigger-alertdialog").onclick = testAlertdialog;
  document.querySelector("#trigger-alertdialog-non-atomic").onclick =
    testAlertdialogNonAtomic;

  return () => {
    document.body.innerHTML = "";
  };
}

module.exports = { setupLiveRegionRoles };
