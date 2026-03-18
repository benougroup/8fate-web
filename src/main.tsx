import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css";

import { bootServices } from "@services";
import { assertRequiredEnv } from "./config/requiredEnv";
import { assertIndexRegistry } from "./config/indexRegistry";


// Entry point for the web app (bundles into iOS WebView via Vite build)
// Assumes your index.html contains <div id="root"></div>

assertRequiredEnv();
assertIndexRegistry();

const env = import.meta.env;

bootServices({
  baseUrl: env.VITE_API_BASE_URL,
  auth: { redirectUri: env.VITE_AUTH_REDIRECT_URI },
  apiClient: {
    chatPath: env.VITE_CHAT_PATH,
    language: env.VITE_LANG,
  },
});


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
