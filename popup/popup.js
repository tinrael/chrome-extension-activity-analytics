import { getAllEvents, clearAllEvents } from "../database.js";

document.getElementById("download-json").addEventListener("click", async () => {
  try {
    const events = await getAllEvents();
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: "application/json",
    });
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = `events.json`;
    a.click();
    URL.revokeObjectURL(objectURL);
  } catch (error) {
    console.error(error);
  }
});

document
  .getElementById("delete-all-data")
  .addEventListener("click", async () => {
    try {
      await clearAllEvents();
      alert("All data deleted successfully.");
    } catch (error) {
      console.error(error);
    }
  });
