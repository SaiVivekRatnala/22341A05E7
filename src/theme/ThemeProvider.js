import React from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const light = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0b72ff" },
    background: { default: "#f5f7fb" },
  },
});

const dark = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#0b1020" },
  },
});

export default function ThemeProvider({ children, mode = "light" }) {
  const theme = mode === "dark" ? dark : light;
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
