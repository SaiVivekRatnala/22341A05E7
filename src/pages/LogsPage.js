import React from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import Logger from "../logging/LoggingMiddleware";

export default function LogsPage() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => setRows(Logger.getLogs()), []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Event Logs</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>All events emitted by the app's LoggingMiddleware.</Typography>
        <Button variant="outlined" sx={{ mb:1 }} onClick={() => { Logger.clear(); setRows([]); }}>Clear Logs</Button>
        {rows.length === 0 ? (
          <Typography>No logs yet.</Typography>
        ) : (
          <Table size="small">
            <TableHead><TableRow><TableCell>TS</TableCell><TableCell>Event</TableCell><TableCell>Payload</TableCell></TableRow></TableHead>
            <TableBody>
              {rows.slice().reverse().map(r => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.ts).toLocaleString()}</TableCell>
                  <TableCell>{r.event}</TableCell>
                  <TableCell style={{ maxWidth: 600, overflow:'hidden', textOverflow:'ellipsis' }}>{JSON.stringify(r.payload)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
