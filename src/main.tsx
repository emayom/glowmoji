import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./reset.css";

import App from "./App.tsx";

import AnimatedCursor from "./components/animated-cursor.tsx";
import shadowStyles from "./styles/shadow.module.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <AnimatedCursor className={shadowStyles.glow} />
  </StrictMode>
);
