
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingPage from "@/components/LoadingPage";

// Home and public routes
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const WorkshopsPage = lazy(() => import("@/pages/WorkshopsPage"));
const WorkshopDetailsPage = lazy(() => import("@/pages/WorkshopDetailsPage"));
const WorkshopRegistration = lazy(() => import("@/pages/WorkshopRegistration"));
const PaymentCallback = lazy(() => import("@/pages/PaymentCallback"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));

// Admin routes
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const CreateWorkshopPage = lazy(() => import("@/pages/admin/CreateWorkshopPage"));
const EditWorkshopPage = lazy(() => import("@/pages/admin/EditWorkshopPage"));
const SystemRepairPage = lazy(() => import("@/pages/admin/SystemRepairPage"));

// User dashboard
const SubscriberDashboard = lazy(() => import("@/pages/SubscriberDashboard"));
const SupervisorDashboard = lazy(() => import("@/pages/SupervisorDashboard"));

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
              <ProtectedRoute condition={isAdmin}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/workshops/create" 
            element={
              <ProtectedRoute condition={isAdmin}>
                <CreateWorkshopPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/workshops/edit/:id" 
            element={
              <ProtectedRoute condition={isAdmin}>
                <EditWorkshopPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/system-repair" 
            element={
              <ProtectedRoute condition={isAdmin}>
                <SystemRepairPage />
              </ProtectedRoute>
            }
          />
          
          {/* User dashboard routes */}
          <Route 
            path="/supervisor" 
            element={
              <ProtectedRoute condition={isSupervisor || isAdmin}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {isAdmin ? <Navigate to="/admin" replace /> : 
                 isSupervisor ? <Navigate to="/supervisor" replace /> : 
                 <SubscriberDashboard />}
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
