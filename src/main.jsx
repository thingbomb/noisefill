import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "@fontsource-variable/inter";
import * as Sentry from "@sentry/react";
import audioRef from "./audioRef"; // Import global audioRef

Sentry.init({
  dsn: "https://f371e5941dee6d55957cf8ba10b907ed@o4509199122563072.ingest.de.sentry.io/4509199123873872",
});

function Main() {
  return (
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <audio id="player" ref={audioRef} loop />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
