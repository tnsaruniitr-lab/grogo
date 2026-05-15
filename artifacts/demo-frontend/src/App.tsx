import { useLayoutEffect } from "react";
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
  // Remove the SSR shell synchronously after React renders but before the
  // browser paints. useLayoutEffect fires at exactly that point, ensuring the
  // user sees V3Hero on the very first paint — no blank flash, no SSR → React
  // jump. On non-SSR pages (Hub, admin etc.) getElementById returns null, safe.
  useLayoutEffect(() => {
    document.getElementById("ssr-content")?.remove();
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
