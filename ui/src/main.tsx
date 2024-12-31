import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.scss";
import App from "./App.tsx";
import { fitToViewport } from "./utils/dom.ts";
import { ToastProvider } from "./contexts/ToastContext";

fitToViewport();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Router>
  </StrictMode>
);
