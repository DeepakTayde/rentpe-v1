import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AIAssistant } from "@/components/ai/AIAssistant";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Services from "./pages/Services";
import Maintenance from "./pages/Maintenance";
import Marketplace from "./pages/Marketplace";
import MarketplaceIndex from "./pages/marketplace/Index";
import MarketplaceCategoryListing from "./pages/marketplace/CategoryListing";
import VendorProfile from "./pages/marketplace/VendorProfile";
import VendorRegistration from "./pages/marketplace/VendorRegistration";
import VendorKYC from "./pages/marketplace/VendorKYC";
import Wallet from "./pages/Wallet";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SelectRole from "./pages/SelectRole";
import Profile from "./pages/Profile";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantPayRent from "./pages/tenant/PayRent";
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerAddProperty from "./pages/owner/AddProperty";
import ListProperty from "./pages/owner/ListProperty";
import AgentDashboard from "./pages/agent/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import TechnicianDashboard from "./pages/technician/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotificationSettings from "./pages/NotificationSettings";
import About from "./pages/About";
import HomeServicesIndex from "./pages/home-services/Index";
import CategoryListing from "./pages/home-services/CategoryListing";
import WorkerProfile from "./pages/home-services/WorkerProfile";
import WorkerRegistration from "./pages/home-services/WorkerRegistration";
import WorkerKYC from "./pages/home-services/WorkerKYC";
import EMarket from "./pages/EMarket";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AIAssistant />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/e-market" element={<EMarket />} />
              
              {/* Home Services routes */}
              <Route path="/home-services" element={<HomeServicesIndex />} />
              <Route path="/home-services/category/:categoryId" element={<CategoryListing />} />
              <Route path="/home-services/worker/:workerId" element={<WorkerProfile />} />
              <Route path="/home-services/worker/register" element={<WorkerRegistration />} />
              <Route path="/home-services/worker/kyc" element={<WorkerKYC />} />
              
              {/* Marketplace routes */}
              <Route path="/marketplace" element={<MarketplaceIndex />} />
              <Route path="/marketplace/category/:categoryId" element={<MarketplaceCategoryListing />} />
              <Route path="/marketplace/vendor/:vendorId" element={<VendorProfile />} />
              <Route path="/marketplace/vendor/register" element={<VendorRegistration />} />
              <Route path="/marketplace/vendor/kyc" element={<VendorKYC />} />
              
              {/* Profile and settings routes - any authenticated user */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/notification-settings" element={
                <ProtectedRoute>
                  <NotificationSettings />
                </ProtectedRoute>
              } />
              
              {/* Tenant routes */}
              <Route path="/tenant/dashboard" element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <TenantDashboard />
                </ProtectedRoute>
              } />
              <Route path="/tenant/pay-rent" element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <TenantPayRent />
                </ProtectedRoute>
              } />
              
              {/* Owner routes */}
              <Route path="/owner/dashboard" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/add-property" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerAddProperty />
                </ProtectedRoute>
              } />
              
              {/* Agent routes */}
              <Route path="/agent/dashboard" element={
                <ProtectedRoute allowedRoles={["agent"]}>
                  <AgentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Vendor routes */}
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              
              {/* Technician routes */}
              <Route path="/technician/dashboard" element={
                <ProtectedRoute allowedRoles={["technician"]}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
