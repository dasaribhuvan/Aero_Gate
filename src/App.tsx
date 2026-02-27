import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import ParticlesBackground from "./components/ParticlesBackground";
import Index from "./pages/Index";
import LiveVerification from "./pages/LiveVerification";
import RegisterPage from "./pages/RegisterPage";
import LogsPage from "./pages/LogsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ParticlesBackground />
        <TopNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/verify" element={<LiveVerification />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
