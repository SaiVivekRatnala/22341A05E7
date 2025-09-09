import React from "react";
import {
  Card, CardContent, Typography, Grid, Button, Box, Chip, Table, TableRow, TableCell, TableHead, TableBody
} from "@mui/material";
import storage from "../storage/urlStorage";
import Logger from "../logging/LoggingMiddleware";

export default function StatsPage() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => refresh(), []);
  function refresh() {
    const all = storage.getAll().slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    setData(all);
    Logger.log("stats.viewed", { count: all.length });
  }

  function openShort(shortcode) {
    Logger.log("stats.open_short", { shortcode });
    // navigate to client route; RedirectHandler will manage and redirect
    window.location.href = `/${shortcode}`;
  }

  function remove(shortcode) {
    storage.delete(shortcode);
    refresh();
  }

  function isExpired(item) {
    return new Date(item.validUntil) <= new Date();
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Short Links & Analytics</Typography>
        {data.length === 0 && <Typography sx={{ mt: 2 }}>No short links yet.</Typography>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {data.map((it) => (
            <Grid item xs={12} key={it.shortcode}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography><strong>{window.location.origin}/{it.shortcode}</strong></Typography>
                    <Typography variant="body2">Original: <a href={it.originalUrl} target="_blank" rel="noreferrer">{it.originalUrl}</a></Typography>
                    <Typography variant="body2">Created: {new Date(it.createdAt).toLocaleString()}</Typography>
                    <Typography variant="body2">Expires: {new Date(it.validUntil).toLocaleString()}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={`Clicks: ${it.clicks ? it.clicks.length : 0}`} sx={{ mr: 1 }} />
                      <Chip label={isExpired(it) ? "Expired" : "Active"} color={isExpired(it) ? "default" : "primary"} />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button onClick={() => openShort(it.shortcode)} variant="contained" size="small">Open Short URL</Button>
                    <Button onClick={() => remove(it.shortcode)} variant="outlined" color="error" size="small">Delete</Button>
                  </Box>
                </Box>

                {/* Click details table */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Click details</Typography>
                  {(!it.clicks || it.clicks.length === 0) ? (
                    <Typography variant="body2">No clicks recorded yet.</Typography>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Coarse Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {it.clicks.slice().reverse().map((c, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{new Date(c.ts).toLocaleString()}</TableCell>
                            <TableCell style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {c.source}
                            </TableCell>
                            <TableCell>{c.location || "unknown"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => { storage.clearAll(); refresh(); }}>Clear All</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
