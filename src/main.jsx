import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "@fontsource-variable/inter";
import audioRef from "./audioRef"; // Import global audioRef

function Main() {
  return (
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <audio id="player" ref={audioRef} loop />
      {/* 100% privacy-first analytics */}
      <script
        async
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
