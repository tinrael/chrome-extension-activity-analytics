import { addEvent } from "./database";

const SCHEMA_VERSION = 1;

if (!sessionStorage.getItem("sessionId")) {
  sessionStorage.setItem("sessionId", crypto.randomUUID());
}

const sessionId = sessionStorage.getItem("sessionId");

chrome.runtime.onMessage.addListener((message) => {
  const event = { v: SCHEMA_VERSION, sid: sessionId, ...message };
  addEvent(event).then(() => {
    console.log(event);
  });
});
