
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  requireRole?: 'admin' | 'supervisor' | 'subscriber';
}

const DashboardLayout = ({ children, title, requireRole }: DashboardLayoutProps) => {
  const { isLoading, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not loading and either not logged in or doesn't have the required role
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (requireRole && userRole !== requireRole) {
        // Redirect based on their actual role
        if (userRole === 'admin') {
          navigate("/admin");
        } else if (userRole === 'supervisor') {
          navigate("/supervisor");
        } else {
          navigate("/dashboard");
        }
      }
    }
  }, [isLoading, user, userRole, requireRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12 flex justify-center items-center">
            <div className="wirashna-loader"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <DashboardSidebar />
      
      <main className="flex-grow pt-24 pr-16 md:pr-64 transition-all duration-300">
        <div className="wirashna-container py-8">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
