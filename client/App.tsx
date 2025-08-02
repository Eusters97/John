import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/EnhancedAuthContext";
import { InvestmentProvider } from "@/contexts/InvestmentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import EnhancedUserDashboard from "./pages/EnhancedUserDashboard";
import TestDashboard from "./pages/TestDashboard";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Promo from "./pages/Promo";
import Offers from "./pages/Offers";
import Education from "./pages/Education";
import InvestmentPlans from "./pages/InvestmentPlans";
import LiveSignals from "./pages/LiveSignals";
import Testimonials from "./pages/Testimonials";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InvestmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/education" element={<Education />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/news" element={<News />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <EnhancedUserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-dashboard"
                element={
                  <ProtectedRoute>
                    <TestDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/eustersmain" element={<AdminLogin />} />
              <Route
                path="/admin-panel"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investment-plans"
                element={
                  <ProtectedRoute>
                    <InvestmentPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/live-signals"
                element={
                  <ProtectedRoute>
                    <LiveSignals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/testimonials"
                element={
                  <ProtectedRoute>
                    <Testimonials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InvestmentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
