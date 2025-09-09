import React from "react";
import { Button } from "@mui/material";
import storage from "../storage/urlStorage";
import Logger from "../logging/LoggingMiddleware";
import { useNotifier } from "./Notifier";

export function ExportButton() {
  const notifier = useNotifier();
  const handle = () => {
    const data = { urls: storage.getAll(), logs: Logger.getLogs() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tinylink-export-${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notifier.show("Exported JSON");
  };
  return <Button variant="outlined" onClick={handle}>Export JSON</Button>;
}

export function ImportButton() {
  const notifier = useNotifier();
  const fileRef = React.useRef();
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const obj = JSON.parse(text);
      if (Array.isArray(obj.urls)) localStorage.setItem("tinylink:urls", JSON.stringify(obj.urls));
      if (Array.isArray(obj.logs)) localStorage.setItem("tinylink:logs", JSON.stringify(obj.logs));
      notifier.show("Imported JSON successfully", "success");
      window.location.reload(); // reload to reflect data
    } catch {
      notifier.show("Invalid JSON file", "error");
    }
  };
  return (
    <>
      <input accept="application/json" type="file" style={{ display: "none" }} ref={fileRef} onChange={handleFile} />
      <Button variant="outlined" onClick={() => fileRef.current.click()}>Import JSON</Button>
    </>
  );
}
