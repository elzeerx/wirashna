import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingPage from "@/pages/LoadingPage";

// Home and public routes
const HomePage = lazy(() => import("@/pages/Index"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const WorkshopsPage = lazy(() => import("@/pages/Workshops"));
const WorkshopDetailsPage = lazy(() => import("@/pages/WorkshopDetail"));
const WorkshopRegistration = lazy(() => import("@/pages/WorkshopRegistration"));
const PaymentCallback = lazy(() => import("@/pages/PaymentCallback"));
const AboutPage = lazy(() => import("@/pages/About"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const PageNotFound = lazy(() => import("@/pages/NotFound"));

// Admin routes
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminWorkshopsPage = lazy(() => import("@/pages/admin/AdminWorkshopsPage"));
const CreateWorkshopPage = lazy(() => import("@/pages/admin/CreateWorkshopPage"));
const EditWorkshopPage = lazy(() => import("@/pages/admin/EditWorkshopPage"));
const SystemRepairPage = lazy(() => import("@/pages/admin/SystemRepairPage"));
const AdminSubscribersPage = lazy(() => import("@/pages/admin/AdminSubscribersPage"));
const AdminPaymentsPage = lazy(() => import("@/pages/admin/AdminPaymentsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

// Subscriber routes
const SubscriberWorkshops = lazy(() => import("@/pages/SubscriberWorkshops"));
const SubscriberCertificates = lazy(() => import("@/pages/SubscriberCertificates"));
const SubscriberMaterials = lazy(() => import("@/pages/SubscriberMaterials"));

function App() {
  const { isAdmin, isSupervisor } = useAuth();

  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/workshops/:id" element={<WorkshopDetailsPage />} />
          <Route path="/workshop-registration" element={<WorkshopRegistration />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/workshops" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <AdminWorkshopsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/workshops/create" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <CreateWorkshopPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/workshops/edit/:id" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <EditWorkshopPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/system-repair" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <SystemRepairPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/subscribers" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <AdminSubscribersPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <AdminPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute condition={isAdmin || isSupervisor}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Subscriber routes */}
          <Route 
            path="/dashboard/workshops" 
            element={
              <ProtectedRoute>
                <SubscriberWorkshops />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard/certificates" 
            element={
              <ProtectedRoute>
                <SubscriberCertificates />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard/materials" 
            element={
              <ProtectedRoute>
                <SubscriberMaterials />
              </ProtectedRoute>
            }
          />
          
          {/* User dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {isAdmin || isSupervisor ? <Navigate to="/admin" replace /> : 
                 <Navigate to="/dashboard/workshops" replace />}
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
