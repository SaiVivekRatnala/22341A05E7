import Logger from "../logging/LoggingMiddleware";

const STORAGE_KEY = "tinylink:urls";

/*
Entry shape:
{
  shortcode,
  originalUrl,
  createdAt, // ISO
  validUntil, // ISO
  clicks: [ { ts, source, location } ],
  meta: { custom: true/false, validityMinutes: number }
}
*/

function _readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function _writeAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default {
  getAll: () => _readAll(),
  getByShortcode: (code) => _readAll().find(x => x.shortcode === code) || null,
  exists: (code) => !!_readAll().find(x => x.shortcode === code),
  save: (entry) => {
    const all = _readAll();
    all.push(entry);
    _writeAll(all);
    Logger.log("url.saved", { shortcode: entry.shortcode, createdAt: entry.createdAt });
  },
  addClick: (shortcode, clickObj) => {
    const all = _readAll();
    const idx = all.findIndex(x => x.shortcode === shortcode);
    if (idx === -1) return null;
    all[idx].clicks = all[idx].clicks || [];
    all[idx].clicks.push(clickObj);
    _writeAll(all);
    Logger.log("url.clicked", { shortcode, newTotal: all[idx].clicks.length });
    return all[idx];
  },
  delete: (shortcode) => {
    const all = _readAll().filter(x => x.shortcode !== shortcode);
    _writeAll(all);
    Logger.log("url.deleted", { shortcode });
  },
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    Logger.log("storage.cleared", {});
  }
};
