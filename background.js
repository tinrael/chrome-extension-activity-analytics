import { addEvent } from "./database.js";

chrome.idle.setDetectionInterval(15);

chrome.idle.onStateChanged.addListener((newState) => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          topic: "idle-state",
          idleState: newState,
        });
      }
    }
  });
});

chrome.runtime.onMessage.addListener((message) => {
  addEvent(message).then(() => {
    console.log(message);
  });
});
