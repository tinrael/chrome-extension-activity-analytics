const SCHEMA_VERSION = 1;

if (!sessionStorage.getItem("sessionId")) {
  sessionStorage.setItem("sessionId", crypto.randomUUID());
}

const sessionId = sessionStorage.getItem("sessionId");

chrome.runtime.sendMessage({
  v: SCHEMA_VERSION,
  sid: sessionId,
  ts: Date.now(),
  type: "page_view",
  page: { url: location.href, title: document.title },
});

document.addEventListener("DOMContentLoaded", () => {
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
});
