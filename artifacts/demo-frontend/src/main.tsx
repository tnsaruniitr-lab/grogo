import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// The SSR shell (#ssr-content) is removed by App's useLayoutEffect, which fires
// synchronously after React renders but before the browser paints — ensuring the
// user sees V3Hero on the very first paint with no blank flash between states.
createRoot(document.getElementById("root")!).render(<App />);
