import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotifierContext = createContext(null);

export function useNotifier() {
  return useContext(NotifierContext);
}

export default function NotifierProvider({ children }) {
  const [state, setState] = useState({ open: false, msg: "", severity: "info" });

  const show = (msg, severity = "info") => setState({ open: true, msg, severity });
  const close = () => setState(s => ({ ...s, open: false }));

  return (
    <NotifierContext.Provider value={{ show }}>
      {children}
      <Snackbar open={state.open} autoHideDuration={3500} onClose={close} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={state.severity} onClose={close} sx={{ width: "100%" }}>{state.msg}</Alert>
      </Snackbar>
    </NotifierContext.Provider>
  );
}
