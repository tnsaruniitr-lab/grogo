import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Hub from "@/pages/hub";
import Admin from "@/pages/admin";
import Dashboard from "@/pages/dashboard";
import Mockups from "@/pages/mockups";
import Demo from "@/pages/demo";
import DemoDashboard from "@/pages/demo-dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Hub} />
      <Route path="/admin" component={Admin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mockups" component={Mockups} />
      <Route path="/demo/:slug/dashboard" component={DemoDashboard} />
      <Route path="/demo/:slug" component={Demo} />
      <Route path="/:vertical/:slug/dashboard" component={DemoDashboard} />
      <Route path="/:vertical/:slug" component={Demo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Fade out the SSR overlay after React's first paint so users see a smooth
  // SSR → V3Hero transition instead of a jarring snap or blank flash.
  // The #ssr-content div is position:fixed z-index:9999 (injected by Express),
  // so V3Hero is always rendered underneath it from the very first React paint.
  // On non-SSR pages (Hub, admin etc.) getElementById returns null — no-op.
  useEffect(() => {
    const el = document.getElementById("ssr-content");
    if (!el) return;
    el.style.transition = "opacity 0.4s ease";
    el.style.opacity = "0";
    const t = setTimeout(() => el.remove(), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
