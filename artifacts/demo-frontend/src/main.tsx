import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Keep the SSR body visible until React paints its first frame so there
// is no blank flash between server HTML and the hydrated React tree.
// When window.__INITIAL_DATA__ is set, demo.tsx initialises state
// synchronously, so React's first render matches the server content and
// the crossfade is imperceptible.
const ssrContent = document.getElementById("ssr-content");

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => ssrContent?.remove());
