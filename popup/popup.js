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

document.getElementById("download-csv").addEventListener("click", async () => {
  try {
    const events = await getAllEvents();
    const blob = new Blob([eventsToCSV(events)], {
      type: "text/csv",
    });
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = `events.csv`;
    a.click();
    URL.revokeObjectURL(objectURL);
  } catch (error) {
    console.error(error);
  }
});

function eventsToCSV(events) {
  const set = new Set();
  events.forEach((event) => {
    Object.keys(event).forEach((key) => set.add(key));
  });
  const keys = Array.from(set);
  const records = events.map((event) =>
    keys
      .map((key) => {
        let value = event[key];
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  return [keys.join(","), ...records].join("\n");
}
