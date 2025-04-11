
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/workshop/RegistrationForm";
import { workshops } from "@/data/workshops";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const WorkshopRegistration = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Get workshop ID from URL params
    const params = new URLSearchParams(location.search);
    const workshopId = params.get('id');
    
    if (workshopId) {
      const workshop = workshops.find(w => w.id === workshopId);
      if (workshop) {
        setSelectedWorkshop(workshop);
      }
    }
  }, [location]);

  const handleRedirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="wirashna-card">
              <h1 className="text-2xl font-bold mb-6 text-center">
                تسجيل في ورشة
                {selectedWorkshop && ` "${selectedWorkshop.title}"`}
              </h1>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="mb-6 text-lg">
                    يرجى تسجيل الدخول أو إنشاء حساب للتسجيل في الورشة
                  </p>
                  <Button 
                    onClick={handleRedirectToLogin}
                    className="wirashna-btn-primary inline-flex items-center gap-2"
                  >
                    <LogIn size={18} />
                    تسجيل الدخول
                  </Button>
                </div>
              ) : (
                <RegistrationForm 
                  workshopId={selectedWorkshop?.id}
                  userEmail={user.email || ""}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopRegistration;
