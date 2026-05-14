import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove SSR body rendered by the Vite middleware for bot crawlers.
// This fires synchronously before React renders so there is no flash.
document.getElementById("ssr-content")?.remove();

createRoot(document.getElementById("root")!).render(<App />);
