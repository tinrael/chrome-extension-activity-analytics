chrome.runtime.sendMessage({
  ts: Date.now(),
  type: "page_view",
  page: { url: location.href, title: document.title },
});

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    chrome.runtime.sendMessage({
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
