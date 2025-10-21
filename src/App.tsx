import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DatacomPage from "./pages/DatacomPage";
import EximPage from "./pages/EximPage";
import IncubationPage from "./pages/IncubationPage";
import ProjectsPage from "./pages/ProjectsPage";
import NotFound from "./pages/NotFound";
import Footer from "./components/ui/footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/datacom" element={<DatacomPage />} />
              <Route path="/exim" element={<EximPage />} />
              <Route path="/incubation" element={<IncubationPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
