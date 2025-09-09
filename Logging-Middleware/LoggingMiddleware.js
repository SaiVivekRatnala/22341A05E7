// logging middleware (required) — writes structured events to localStorage key 'tinylink:logs'
const STORAGE_KEY = "tinylink:logs";

function _readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function _writeAll(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // silent fail (no console usage)
  }
}

export default {
  log: (eventName, payload = {}) => {
    try {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        ts: new Date().toISOString(),
        event: eventName,
        payload
      };
      const all = _readAll();
      all.push(entry);
      _writeAll(all);
    } catch {
      // silent
    }
  },

  getLogs: () => _readAll(),

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
