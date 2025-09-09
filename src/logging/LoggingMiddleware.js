// src/logging/LoggingMiddleware.js
// Small, readable logging middleware that writes structured events to localStorage.
//
// API:
//   Logger.log(eventName, payload)
//   Logger.getLogs() -> array
//   Logger.clear()

const STORAGE_KEY = "tinylink:logs";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    // fail silently but return an array so caller won't crash
    return [];
  }
}

function writeAll(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // ignore write errors in UI
  }
}

const Logger = {
  log: function (eventName, payload = {}) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: new Date().toISOString(),
      event: eventName,
      payload,
    };
    const all = readAll();
    all.push(entry);
    writeAll(all);
  },

  getLogs: function () {
    return readAll();
  },

  clear: function () {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default Logger;
