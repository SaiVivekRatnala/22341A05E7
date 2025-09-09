import React from "react";
import Logger from "../logging/LoggingMiddleware";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(err) { return { hasError: true, error: err }; }
  componentDidCatch(error, info) {
    Logger.log("react.error", { error: error?.toString(), info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <Card sx={{ m:2 }}>
          <CardContent>
            <Typography variant="h6" color="error">Something went wrong</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{String(this.state.error)}</Typography>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
