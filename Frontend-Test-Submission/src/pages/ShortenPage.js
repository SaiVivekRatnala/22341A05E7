import React from "react";
import {
  Box, Grid, TextField, Button, Card, CardContent, Typography, IconButton, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import storage from "../storage/urlStorage";
import Logger from "../logging/LoggingMiddleware";
import { generateUnique, validateCustom } from "../utils/shortcode";

const DEFAULT_VALID_MINUTES = 30;

function isValidUrl(u) {
  try {
    const p = new URL(u);
    return p.protocol === "http:" || p.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ShortenPage() {
  // allow up to 5 URL entries
  const [rows, setRows] = React.useState([
    { longUrl: "", shortcode: "", validity: "" }
  ]);
  const [errors, setErrors] = React.useState([]);
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    Logger.log("shorten.page_view", { ts: new Date().toISOString(), rowsCount: rows.length });
  }, [rows.length]);

  const addRow = () => {
    if (rows.length >= 5) return;
    setRows([...rows, { longUrl: "", shortcode: "", validity: "" }]);
    Logger.log("shorten.row_added", { newCount: rows.length + 1 });
  };
  const removeRow = (i) => {
    const copy = rows.slice();
    copy.splice(i, 1);
    setRows(copy);
    Logger.log("shorten.row_removed", { newCount: copy.length });
  };
  const updateRow = (i, field, val) => {
    const copy = rows.slice();
    copy[i] = { ...copy[i], [field]: val };
    setRows(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    setResults([]);
    const errs = [];
    const created = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.longUrl || !r.longUrl.trim()) {
        errs.push({ idx: i, msg: "Original URL is required." });
        continue;
      }
      if (!isValidUrl(r.longUrl.trim())) {
        errs.push({ idx: i, msg: "Malformed URL. Must begin with http:// or https://" });
        continue;
      }
      let minutes = parseInt(r.validity, 10);
      if (isNaN(minutes) || minutes <= 0) minutes = DEFAULT_VALID_MINUTES;

      let finalCode = null;
      if (r.shortcode && r.shortcode.trim()) {
        const v = validateCustom(r.shortcode);
        if (!v.ok) {
          errs.push({ idx: i, msg: "Shortcode invalid: 4–12 chars, letters/numbers/-/_ only." });
          continue;
        }
        if (storage.exists(v.value) || created.find(cr => cr.shortcode === v.value)) {
          errs.push({ idx: i, msg: `Shortcode '${v.value}' already in use.` });
          continue;
        }
        finalCode = v.value;
      } else {
        finalCode = generateUnique((c) => storage.exists(c) || created.find(cr => cr.shortcode === c));
      }

      const createdAt = new Date().toISOString();
      const validUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      const entry = {
        shortcode: finalCode,
        originalUrl: r.longUrl.trim(),
        createdAt,
        validUntil,
        clicks: [],
        meta: { custom: !!(r.shortcode && r.shortcode.trim()), validityMinutes: minutes }
      };

      storage.save(entry);
      created.push(entry);
      Logger.log("shorten.created_batch_item", { idx: i, shortcode: finalCode, originalUrl: entry.originalUrl, validityMinutes: minutes });
    }

    if (errs.length > 0) {
      setErrors(errs);
    }
    if (created.length > 0) {
      const res = created.map(c => ({ shortcode: c.shortcode, shortUrl: `${window.location.origin}/${c.shortcode}`, validUntil: c.validUntil }));
      setResults(res);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Shorten URLs (up to 5 at once)</Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {rows.map((r, i) => (
              <Grid item xs={12} key={i}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Entry {i + 1}</Typography>
                    <Stack direction="row" spacing={1}>
                      {rows.length > 1 && (
                        <IconButton size="small" onClick={() => removeRow(i)} aria-label="remove">
                          <RemoveIcon />
                        </IconButton>
                      )}
                      {i === rows.length - 1 && rows.length < 5 && (
                        <IconButton size="small" onClick={addRow} aria-label="add">
                          <AddIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Original URL"
                        fullWidth
                        value={r.longUrl}
                        onChange={(e) => updateRow(i, "longUrl", e.target.value)}
                        placeholder="https://example.com/very/long/path"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Custom shortcode (optional)"
                        fullWidth
                        value={r.shortcode}
                        onChange={(e) => updateRow(i, "shortcode", e.target.value)}
                        placeholder="e.g. my-link"
                        helperText="4–12 chars; letters, numbers, - and _"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Validity (minutes, optional)"
                        fullWidth
                        value={r.validity}
                        onChange={(e) => updateRow(i, "validity", e.target.value)}
                        placeholder={`${DEFAULT_VALID_MINUTES}`}
                        type="number"
                        inputProps={{ min: 1 }}
                        helperText={`Defaults to ${DEFAULT_VALID_MINUTES} minutes`}
                      />
                    </Grid>
                    {errors.filter(er => er.idx === i).map((er, k) => (
                      <Grid item xs={12} key={k}>
                        <Typography color="error" variant="body2">{er.msg}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" type="submit">Create Short Links</Button>
            <Button variant="outlined" onClick={() => { setRows([{ longUrl: "", shortcode: "", validity: "" }]); setErrors([]); setResults([]); Logger.log("shorten.form_cleared", {}); }}>Clear</Button>
          </Box>
        </Box>

        {results.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Results</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {results.map((r, i) => (
                <Grid key={i} item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <Typography><strong>Short URL:</strong> <a href={r.shortUrl}>{r.shortUrl}</a></Typography>
                    <Typography variant="body2">Expiry: {new Date(r.validUntil).toLocaleString()}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
