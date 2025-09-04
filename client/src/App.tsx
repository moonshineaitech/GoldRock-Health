import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Training from "@/pages/training";
import Game from "@/pages/game";
import AIGenerator from "@/pages/ai-generator";
import Achievements from "@/pages/achievements";
import Premium from "@/pages/premium";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/training" component={Training} />
      <Route path="/ai-generator" component={AIGenerator} />
      <Route path="/game" component={Game} />
      <Route path="/game/:id" component={Game} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/premium" component={Premium} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
