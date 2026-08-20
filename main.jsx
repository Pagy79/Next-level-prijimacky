import React from "react";
import ReactDOM from "react-dom/client";
import App from "./QuizPrototype.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Ve vývoji SW vypni — jinak localhost drží starý bundle (např. raketu místo kompasu).
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if (window.caches?.keys) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registrace selhala:", err);
    });
  });
}
