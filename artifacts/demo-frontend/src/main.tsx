import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Remove SSR preview after React's first paint so the dark hero stays visible
// during the branding fetch — prevents a white flash on the demo pages.
requestAnimationFrame(() =>
  requestAnimationFrame(() =>
    document.getElementById("ssr-content")?.remove()
  )
);
