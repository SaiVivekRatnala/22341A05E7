import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import storage from "../storage/urlStorage";
import Logger from "../logging/LoggingMiddleware";

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const [state, setState] = React.useState({ status: "checking", message: "" });

  React.useEffect(() => {
    (async () => {
      if (!shortcode) {
        setState({ status: "error", message: "No shortcode provided."});
        Logger.log("redirect.failed.no_shortcode", {});
        return;
      }
      const entry = storage.getByShortcode(shortcode);
      if (!entry) {
        setState({ status: "notfound", message: "Short link not found."});
        Logger.log("redirect.failed.not_found", { shortcode });
        return;
      }
      const now = new Date();
      if (new Date(entry.validUntil) <= now) {
        setState({ status: "expired", message: "This short link has expired."});
        Logger.log("redirect.failed.expired", { shortcode, validUntil: entry.validUntil });
        return;
      }

      setState({ status: "capturing", message: "Preparing to redirect..." });

      // capture source and coarse location
      const sourceParts = [];
      if (document && document.referrer) sourceParts.push(`ref:${document.referrer}`);
      if (navigator && navigator.userAgent) sourceParts.push(navigator.userAgent);
      const source = sourceParts.join(" | ");

      // obtain coarse location via navigator.geolocation (if allowed). Round to 2 decimals.
      function addClickAndRedirect(locStr) {
        const clickObj = { ts: new Date().toISOString(), source, location: locStr || "unknown" };
        storage.addClick(shortcode, clickObj);
        Logger.log("redirect.success", { shortcode, clickObj });

        // redirect
        setState({ status: "redirecting", message: "Redirecting..." });
        // small delay so user sees state and logging finishes
        setTimeout(() => {
          window.location.href = entry.originalUrl;
        }, 400);
      }

      if (navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === "function") {
        const success = (pos) => {
          const lat = pos.coords.latitude.toFixed(2);
          const lon = pos.coords.longitude.toFixed(2);
          addClickAndRedirect(`${lat},${lon}`);
        };
        const fail = () => {
          addClickAndRedirect("unknown");
        };
        try {
          navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 60000, timeout: 3000 });
        } catch {
          addClickAndRedirect("unknown");
        }
      } else {
        addClickAndRedirect("unknown");
      }
    })();
  }, [shortcode]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Resolving short link: {shortcode}</Typography>
        {state.status === "checking" && <Typography>Checking... <CircularProgress size={18} /></Typography>}
        {state.status === "capturing" && <Typography>{state.message} <CircularProgress size={18} /></Typography>}
        {state.status === "redirecting" && <Typography>{state.message}</Typography>}
        {state.status === "notfound" && (
          <>
            <Typography color="error">{state.message}</Typography>
            <Button component={Link} to="/">Back</Button>
          </>
        )}
        {state.status === "expired" && (
          <>
            <Typography color="error">{state.message}</Typography>
            <Button component={Link} to="/">Back</Button>
          </>
        )}
        {state.status === "error" && (
          <>
            <Typography color="error">{state.message}</Typography>
            <Button component={Link} to="/">Back</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
