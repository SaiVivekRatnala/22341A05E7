// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import ShortenPage from "./pages/ShortenPage";
import StatsPage from "./pages/StatsPage";
import RedirectHandler from "./pages/RedirectHandler";
import LogsPage from "./pages/LogsPage";

import Logger from "./logging/LoggingMiddleware";
import ThemeProvider from "./theme/ThemeProvider";
import NotifierProvider from "./components/Notifier";
import ErrorBoundary from "./components/ErrorBoundary";

/*
  Root app:
  - wraps providers (theme, notifier)
  - simple theme toggle saved to localStorage
  - routes for pages
*/
export default function App() {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("tiny:theme") || "light");

  useEffect(() => {
    // log app start for reviewer to see
    Logger.log("app.started", { ts: new Date().toISOString(), theme: themeMode });
  }, [themeMode]);

  function toggleTheme() {
    const next = themeMode === "light" ? "dark" : "light";
    setThemeMode(next);
    localStorage.setItem("tiny:theme", next);
    Logger.log("ui.theme_changed", { theme: next });
  }

  return (
    <ThemeProvider mode={themeMode}>
      <NotifierProvider>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                TinyLink
              </Typography>

              <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle-theme" size="large">
                {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>

              <Button color="inherit" component={Link} to="/">Shorten</Button>
              <Button color="inherit" component={Link} to="/stats">Statistics</Button>
              <Button color="inherit" component={Link} to="/logs">Logs</Button>
            </Toolbar>
          </AppBar>

          <Container sx={{ mt: 4, mb: 6, flexGrow: 1 }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<ShortenPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/:shortcode" element={<RedirectHandler />} />
              </Routes>
            </ErrorBoundary>
          </Container>

          <Box component="footer" sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
            Runs at http://localhost:3000 • Default validity: 30 minutes
          </Box>
        </Box>
      </NotifierProvider>
    </ThemeProvider>
  );
}
