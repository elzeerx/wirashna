
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import AdminDashboard from "./pages/AdminDashboard";
import WorkshopRegistration from "./pages/WorkshopRegistration";
import SubscriberDashboard from "./pages/SubscriberDashboard";
import SubscriberWorkshops from "./pages/SubscriberWorkshops";
import SubscriberCertificates from "./pages/SubscriberCertificates";
import SubscriberMaterials from "./pages/SubscriberMaterials";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
