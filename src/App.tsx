
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Workshops from "./pages/Workshops";
import WorkshopDetail from "./pages/WorkshopDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CreateWorkshopPage from "./pages/admin/CreateWorkshopPage";
import WorkshopRegistration from "./pages/WorkshopRegistration";
import PaymentCallback from "./pages/PaymentCallback";
import SubscriberDashboard from "./pages/SubscriberDashboard";
import SubscriberWorkshops from "./pages/SubscriberWorkshops";
import SubscriberCertificates from "./pages/SubscriberCertificates";
import SubscriberMaterials from "./pages/SubscriberMaterials";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import DynamicPage from "./pages/DynamicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/workshops/:id" element={<WorkshopDetail />} />
              <Route path="/workshop-registration" element={<WorkshopRegistration />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/workshops/create" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateWorkshopPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUserManagement />
                </ProtectedRoute>
              } />
              
              {/* Supervisor Routes */}
              <Route path="/supervisor" element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              } />
              
              {/* Subscriber Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['subscriber']}>
                  <SubscriberDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/workshops" element={
                <ProtectedRoute allowedRoles={['subscriber']}>
                  <SubscriberWorkshops />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/certificates" element={
                <ProtectedRoute allowedRoles={['subscriber']}>
                  <SubscriberCertificates />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/materials" element={
                <ProtectedRoute allowedRoles={['subscriber']}>
                  <SubscriberMaterials />
                </ProtectedRoute>
              } />
              
              {/* Dynamic Pages */}
              <Route path="/:path" element={<DynamicPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
