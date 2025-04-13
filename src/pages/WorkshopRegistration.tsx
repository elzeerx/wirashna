
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/workshop/RegistrationForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Workshop } from "@/types/supabase";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";

const WorkshopRegistration = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWorkshop = async () => {
      setIsLoading(true);
      try {
        // Get workshop ID from URL params
        const params = new URLSearchParams(location.search);
        const workshopId = params.get('id');
        
        if (workshopId) {
          const workshop = await fetchWorkshopById(workshopId);
          if (workshop) {
            setSelectedWorkshop(workshop);
          } else {
            toast({
              title: "الورشة غير موجودة",
              description: "لم يتم العثور على الورشة المطلوبة",
              variant: "destructive",
            });
            navigate("/workshops");
          }
        } else {
          toast({
            title: "خطأ في الرابط",
            description: "الرجاء تحديد ورشة للتسجيل",
            variant: "destructive",
          });
          navigate("/workshops");
        }
      } catch (error) {
        console.error("Error fetching workshop:", error);
        toast({
          title: "خطأ في تحميل بيانات الورشة",
          description: "حدث خطأ أثناء تحميل بيانات الورشة. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshop();
  }, [location, navigate, toast]);

  const handleRedirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

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
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="wirashna-card">
              <h1 className="text-2xl font-bold mb-6 text-center">
                تسجيل في ورشة
                {selectedWorkshop && ` "${selectedWorkshop.title}"`}
              </h1>
              
              {selectedWorkshop && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <p className="font-bold text-lg">معلومات الورشة:</p>
                  <p>التاريخ: {selectedWorkshop.date}</p>
                  <p>الوقت: {selectedWorkshop.time}</p>
                  <p>المكان: {selectedWorkshop.venue}</p>
                  <p className="font-bold text-wirashna-accent">
                    السعر: {selectedWorkshop.price} د.ك
                  </p>
                </div>
              )}
              
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
                  workshopPrice={selectedWorkshop?.price || 0}
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
