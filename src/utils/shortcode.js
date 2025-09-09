const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
function randomBase(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export function generateUnique(storageExistsFn, attempts = 8) {
  for (let i = 0; i < attempts; i++) {
    const len = 5 + Math.floor(i/2); // 5,5,6,6...
    const candidate = randomBase(len);
    if (!storageExistsFn(candidate)) return candidate;
  }
  // fallback
  let f;
  do { f = randomBase(10); } while (storageExistsFn(f));
  return f;
}

export function validateCustom(code) {
  if (!code || typeof code !== "string") return { ok: false, reason: "empty" };
  const trimmed = code.trim();
  if (!/^[A-Za-z0-9\-_]{4,12}$/.test(trimmed)) return { ok: false, reason: "invalid_format" };
  return { ok: true, value: trimmed };
}
