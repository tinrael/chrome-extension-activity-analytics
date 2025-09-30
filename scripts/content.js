const SCHEMA_VERSION = 1;

if (!sessionStorage.getItem("sessionId")) {
  sessionStorage.setItem("sessionId", crypto.randomUUID());
}

const sessionId = sessionStorage.getItem("sessionId");

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({
    v: SCHEMA_VERSION,
    sid: sessionId,
    ts: Date.now(),
    type: "page_view",
    page: { url: location.href, title: document.title },
  });

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
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "visibility_change",
      visibilityState: document.visibilityState,
      page: { url: location.href, title: document.title },
    });
  });

  window.addEventListener("focus", () => {
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "focus_gain",
      page: { url: location.href, title: document.title },
    });
  });

  window.addEventListener("blur", () => {
    chrome.runtime.sendMessage({
      v: SCHEMA_VERSION,
      sid: sessionId,
      ts: Date.now(),
      type: "focus_lost",
      page: { url: location.href, title: document.title },
    });
  });
});
