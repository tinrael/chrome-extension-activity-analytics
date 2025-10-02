const SCHEMA_VERSION = 1;

if (!sessionStorage.getItem("sessionId")) {
  sessionStorage.setItem("sessionId", crypto.randomUUID());
}

const sessionId = sessionStorage.getItem("sessionId");

let isUserActive = true;

let isDocumentVisible = document.visibilityState === "visible";
let hasDocumentFocus = document.hasFocus();

let time = null;

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({
    v: SCHEMA_VERSION,
    sid: sessionId,
    ts: Date.now(),
    type: "page_view",
    page: { url: location.href, title: document.title },
  });

  checkTime();

  document.addEventListener("click", (event) => {
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "click",
      target: {
        tagName: event.target.tagName,
        innerText: event.target.innerText,
      },
      page: { url: location.href, title: document.title },
    });
  });

  document.addEventListener("visibilitychange", () => {
    isDocumentVisible = document.visibilityState === "visible";
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "visibility_change",
      visibilityState: document.visibilityState,
      page: { url: location.href, title: document.title },
    });
    checkTime();
  });

  window.addEventListener("focus", () => {
    hasDocumentFocus = true;
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "focus_gain",
      page: { url: location.href, title: document.title },
    });
    checkTime();
  });

  window.addEventListener("blur", () => {
    hasDocumentFocus = false;
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "focus_lost",
      page: { url: location.href, title: document.title },
    });
    checkTime();
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.topic === "idle-state") {
    isUserActive = message.idleState === "active";
    checkTime();
  }
});

function checkTime() {
  const now = Date.now();
  if (isUserActive && isDocumentVisible && hasDocumentFocus && !time) {
    time = now;
  } else if (
    (!isUserActive || !isDocumentVisible || !hasDocumentFocus) &&
    time
  ) {
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: now,
      type: "active_time_ms",
      duration: now - time,
      page: { url: location.href, title: document.title },
    });
    time = null;
  }
}
