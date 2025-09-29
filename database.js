const DATABASE_NAME = "analytics";
const OBJECT_STORE_NAME = "events";

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const IDBOpenDBRequest = indexedDB.open(DATABASE_NAME);
    IDBOpenDBRequest.onupgradeneeded = (IDBVersionChangeEvent) => {
      if (
        !IDBVersionChangeEvent.target.result.objectStoreNames.contains(
          OBJECT_STORE_NAME
        )
      ) {
        IDBVersionChangeEvent.target.result.createObjectStore(
          OBJECT_STORE_NAME,
          { keyPath: "id", autoIncrement: true }
        );
      }
    };
    IDBOpenDBRequest.onsuccess = (event) => resolve(event.target.result);
    IDBOpenDBRequest.onerror = (event) => reject(event.target.error);
  });
}

export async function addEvent(event) {
  const IDBDatabase = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const IDBTransaction = IDBDatabase.transaction(
      OBJECT_STORE_NAME,
      "readwrite"
    );
    IDBTransaction.objectStore(OBJECT_STORE_NAME).add(event);
    IDBTransaction.oncomplete = () => resolve(true);
    IDBTransaction.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllEvents() {
  const IDBDatabase = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const IDBTransaction = IDBDatabase.transaction(
      OBJECT_STORE_NAME,
      "readonly"
    );
    const IDBRequest = IDBTransaction.objectStore(OBJECT_STORE_NAME).getAll();
    IDBRequest.onsuccess = () => resolve(IDBRequest.result);
    IDBRequest.onerror = (event) => reject(event.target.error);
  });
}

export async function clearAllEvents() {
  const IDBDatabase = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const IDBTransaction = IDBDatabase.transaction(
      OBJECT_STORE_NAME,
      "readwrite"
    );
    IDBTransaction.objectStore(OBJECT_STORE_NAME).clear();
    IDBTransaction.oncomplete = () => resolve(true);
    IDBTransaction.onerror = (event) => reject(event.target.error);
  });
}
