// src/pages/ShortenPage.js
import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Grid } from "@mui/material";
import storage from "../storage/urlStorage";
import Logger from "../logging/LoggingMiddleware";
import { generateUnique, validateCustom } from "../utils/shortcode";

/*
  ShortenPage:
  - allows up to 5 rows
  - client-side validation
  - simple user-facing messages
*/

const DEFAULT_VALIDITY_MINUTES = 30;
const MAX_ROWS = 5;

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ShortenPage() {
  // rows: array of { longUrl, shortcode, validity }
  const [rows, setRows] = useState([{ longUrl: "", shortcode: "", validity: "" }]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  function addRow() {
    if (rows.length >= MAX_ROWS) return;
    setRows([...rows, { longUrl: "", shortcode: "", validity: "" }]);
  }

  function removeRow(index) {
    const copy = rows.slice();
    copy.splice(index, 1);
    setRows(copy);
  }

  function updateRow(index, field, value) {
    const copy = rows.slice();
    copy[index] = { ...copy[index], [field]: value };
    setRows(copy);
  }

  function handleCreate(e) {
    e.preventDefault();
    const newErrors = [];
    const created = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const url = (r.longUrl || "").trim();
      if (!url) {
        newErrors.push({ i, msg: "Original URL is required." });
        continue;
      }
      if (!isValidUrl(url)) {
        newErrors.push({ i, msg: "URL must start with http:// or https://." });
        continue;
      }

      // validity
      let minutes = parseInt(r.validity, 10);
      if (!Number.isFinite(minutes) || minutes <= 0) minutes = DEFAULT_VALIDITY_MINUTES;

      // shortcode handling
      let code = "";
      if (r.shortcode && r.shortcode.trim()) {
        const valid = validateCustom(r.shortcode);
        if (!valid.ok) {
          newErrors.push({ i, msg: "Shortcode invalid (4-12 chars, letters/numbers/-/_)." });
          continue;
        }
        if (storage.exists(valid.value) || created.some(c => c.shortcode === valid.value)) {
          newErrors.push({ i, msg: `Shortcode '${valid.value}' already used.` });
          continue;
        }
        code = valid.value;
      } else {
        code = generateUnique(c => storage.exists(c) || created.some(x => x.shortcode === c));
      }

      const item = {
        shortcode: code,
        originalUrl: url,
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + minutes * 60000).toISOString(),
        clicks: [],
        meta: { custom: !!(r.shortcode && r.shortcode.trim()), validityMinutes: minutes }
      };

      storage.save(item);
      Logger.log("shorten.created", { shortcode: code, originalUrl: url, validityMinutes: minutes });
      created.push(item);
    }

    setErrors(newErrors);
    setResults(created.map(c => ({ shortUrl: `${window.location.origin}/${c.shortcode}`, validUntil: c.validUntil })));
    if (newErrors.length === 0) {
      // reset rows to single empty row after success
      setRows([{ longUrl: "", shortcode: "", validity: "" }]);
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Create short links (up to 5)</Typography>

        <form onSubmit={handleCreate}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {rows.map((r, idx) => (
              <Grid item xs={12} key={idx}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Original URL"
                      fullWidth
                      value={r.longUrl}
                      onChange={(e) => updateRow(idx, "longUrl", e.target.value)}
                      placeholder="https://example.com/path"
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Shortcode (optional)"
                      fullWidth
                      value={r.shortcode}
                      onChange={(e) => updateRow(idx, "shortcode", e.target.value)}
                      placeholder="my-link"
                      helperText="4–12 chars"
                    />
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Validity (minutes)"
                      fullWidth
                      value={r.validity}
                      onChange={(e) => updateRow(idx, "validity", e.target.value)}
                      type="number"
                      inputProps={{ min: 1 }}
                      placeholder={`${DEFAULT_VALIDITY_MINUTES}`}
                    />
                  </Grid>

                  {/* show row-level errors */}
                  {errors.filter(er => er.i === idx).map((er, k) => (
                    <Grid item xs={12} key={k}>
                      <Typography color="error" variant="body2">{er.msg}</Typography>
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    {rows.length > 1 && (
                      <Button variant="text" color="error" onClick={() => removeRow(idx)}>Remove</Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button onClick={addRow} disabled={rows.length >= MAX_ROWS}>Add another URL</Button>
              <Button type="submit" variant="contained" sx={{ ml: 2 }}>Create</Button>
            </Grid>
          </Grid>
        </form>

        {results.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="h6">Created</Typography>
            {results.map((r, i) => (
              <div key={i}>
                <a href={r.shortUrl} target="_blank" rel="noreferrer">{r.shortUrl}</a>
                <div style={{ fontSize: 12 }}>Expires: {new Date(r.validUntil).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
