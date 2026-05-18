import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Hub from "@/pages/hub";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import Dashboard from "@/pages/dashboard";
import Mockups from "@/pages/mockups";
import Demo from "@/pages/demo";
import DemoDashboard from "@/pages/demo-dashboard";
import { LoginGate } from "@/components/login-gate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        // Never retry on 401 — fire event to trigger login gate instead
        const status = (error as { status?: number })?.status;
        if (status === 401) {
          window.dispatchEvent(new CustomEvent("api:unauthorized", { detail: { status: 401 } }));
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public demo pages — no login required */}
      <Route path="/demo/:slug/dashboard" component={DemoDashboard} />
      <Route path="/demo/:slug" component={Demo} />
      <Route path="/:vertical/:slug/dashboard" component={DemoDashboard} />
      <Route path="/:vertical/:slug" component={Demo} />

      {/* Admin / internal pages — login required */}
      <Route path="/">
        <LoginGate>
          <Switch>
            <Route path="/admin" component={Admin} />
            <Route path="/settings" component={Settings} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/mockups" component={Mockups} />
            <Route path="/" component={Hub} />
            <Route component={NotFound} />
          </Switch>
        </LoginGate>
      </Route>
    </Switch>
  );
}

function App() {
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
