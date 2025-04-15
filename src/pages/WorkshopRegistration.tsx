import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/workshop/RegistrationForm";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Workshop } from "@/types/supabase";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const WorkshopRegistration = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
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
        const retry = params.get('retry');
        
        // Set retry flag if present
        if (retry === 'true') {
          setIsRetry(true);
        }
        
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-6">
        <div className="wirashna-container">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="ml-2" />
            عودة
          </Button>

          {selectedWorkshop && (
            <div className="max-w-5xl mx-auto">
              {/* Workshop Image and Details */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-8">
                <img 
                  src={selectedWorkshop.cover_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"} 
                  alt={selectedWorkshop.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{selectedWorkshop.title}</h1>
                    {selectedWorkshop.available_seats > 0 && (
                      <Badge className="bg-emerald-500">متاح</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>تاريخ البدء: {selectedWorkshop.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>المدة: {selectedWorkshop.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span>المقاعد المتبقية: {selectedWorkshop.available_seats} من {selectedWorkshop.total_seats}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              {!user ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <RegistrationForm 
                    workshopId={selectedWorkshop.id}
                    userEmail={user.email || ""}
                    workshopPrice={selectedWorkshop.price || 0}
                    isRetry={isRetry}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkshopRegistration;
