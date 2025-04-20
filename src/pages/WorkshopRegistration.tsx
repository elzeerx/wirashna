
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/workshop/RegistrationForm";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/supabase";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import WorkshopHeader from "@/components/workshop/registration/WorkshopHeader";
import WorkshopPreview from "@/components/workshop/registration/WorkshopPreview";
import LoginPrompt from "@/components/workshop/registration/LoginPrompt";

const WorkshopRegistration = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetry, setIsRetry] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWorkshop = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const workshopId = params.get('id');
        const retry = params.get('retry');
        
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
          }
        } else {
          toast({
            title: "خطأ في الرابط",
            description: "الرجاء تحديد ورشة للتسجيل",
            variant: "destructive",
          });
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
  }, [location, toast]);

  // Check if registration is closed (manual or automatic 24h before start)
  const isRegistrationClosed = (workshop: Workshop) => {
    if (workshop.registration_closed) {
      return true;
    }
    
    // Check if it's less than 24 hours before the workshop starts
    const workshopDate = new Date(`${workshop.date}T${workshop.time}`);
    const now = new Date();
    const timeDiff = workshopDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
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
          <WorkshopHeader />

          {selectedWorkshop && (
            <div className="max-w-5xl mx-auto">
              <WorkshopPreview workshop={selectedWorkshop} />

              {!user ? (
                <LoginPrompt />
              ) : selectedWorkshop && isRegistrationClosed(selectedWorkshop) ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <h3 className="text-xl font-bold mb-4 text-red-600">التسجيل مغلق</h3>
                  <p className="mb-2">
                    عذراً، تم إغلاق التسجيل لهذه الورشة.
                  </p>
                  <p>
                    قد يكون ذلك بسبب اقتراب موعد الورشة أو بقرار من الإدارة.
                  </p>
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

      <Footer />
    </div>
  );
};

export default WorkshopRegistration;
