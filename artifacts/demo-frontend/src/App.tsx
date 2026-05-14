import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Hub from "@/pages/hub";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Mockups from "@/pages/mockups";
import Demo from "@/pages/demo";
import DemoDashboard from "@/pages/demo-dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Hub} />
      <Route path="/admin">
        <Redirect to="/" />
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mockups" component={Mockups} />
      <Route path="/demo/:slug/dashboard" component={DemoDashboard} />
      <Route path="/demo/dosteli" component={Home} />
      <Route path="/demo/:slug" component={Demo} />
      <Route path="/dosteli" component={Home} />
      <Route component={NotFound} />
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
