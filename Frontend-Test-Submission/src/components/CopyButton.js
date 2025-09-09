import React from "react";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import { useNotifier } from "./Notifier";

export default function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);
  const notifier = useNotifier();

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      notifier.show("Copied to clipboard", "success");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      notifier.show("Failed to copy", "error");
    }
  };

  return (
    <IconButton size="small" onClick={handle} aria-label="copy short url">
      {copied ? <DoneIcon /> : <ContentCopyIcon />}
    </IconButton>
  );
}
