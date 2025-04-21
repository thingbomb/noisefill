const DB_NAME = "noisefill-audio";
const DB_VERSION = 1;
const STORE_NAME = "audio-data";

const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "soundscapeId" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

const fetchAudioAsDataURL = async (audioUrl) => {
  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch audio: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting audio to data URL:", error);
    throw error;
  }
};

export const saveAudioToIndexedDB = async (soundscapeId, audioUrl) => {
  try {
    if (!soundscapeId) {
      console.warn("Cannot save audio: No soundscape ID provided");
      return;
    }

    const dataUrl = await fetchAudioAsDataURL(audioUrl);

    const db = await initializeDB();

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      soundscapeId,
      dataUrl,
      originalUrl: audioUrl,
      savedAt: new Date().toISOString(),
    };

    const request = store.put(data);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Audio data URL saved for soundscape ID: ${soundscapeId}`);
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error saving audio data URL:", event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB operation failed:", error);
    throw error;
  }
};

export const getAudioFromIndexedDB = async (soundscapeId) => {
  try {
    const db = await initializeDB();

    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(soundscapeId);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result.dataUrl);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        console.error("Error retrieving audio data URL:", event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB operation failed:", error);
    return null;
  }
};

export const deleteAudioFromIndexedDB = async (soundscapeId) => {
  try {
    const db = await initializeDB();

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(soundscapeId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Error deleting audio entry:", event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB delete operation failed:", error);
    return false;
  }
};

export const clearAllAudioFromIndexedDB = async () => {
  try {
    const db = await initializeDB();

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error("Error clearing audio entries:", event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB clear operation failed:", error);
    return false;
  }
};
