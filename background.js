import { addEvent } from "./database.js";

chrome.runtime.onMessage.addListener((message) => {
  addEvent(message).then(() => {
    console.log(message);
  });
});
