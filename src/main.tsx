import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/yeseva-one/400.css";
import "@fontsource/kurale/400.css";
import "@fontsource/marck-script/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
