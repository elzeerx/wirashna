
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadWorkshopData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const workshopData = await fetchWorkshopById(id);
        
        if (!workshopData) {
          return navigate("/workshops");
        }
        
        setWorkshop(workshopData);
      } catch (error) {
        console.error("Error loading workshop:", error);
        toast({
          title: "خطأ في تحميل الورشة",
          description: "حدث خطأ أثناء تحميل بيانات الورشة. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkshopData();
  }, [id, navigate, toast]);

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

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">الورشة غير موجودة</h1>
        <Button onClick={() => navigate("/workshops")}>العودة للورش</Button>
      </div>
    );
  }

  const isAvailable = workshop.available_seats > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          <img 
            src={workshop.cover_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"} 
            alt={workshop.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
            <div className="wirashna-container h-full flex flex-col justify-end pb-12">
              {isAvailable && (
                <Badge className="mb-4 bg-emerald-500 self-start">متاح للتسجيل</Badge>
              )}
              <h1 className="text-4xl font-bold text-white mb-2">{workshop.title}</h1>
              <p className="text-gray-200 text-lg">{workshop.short_description}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="wirashna-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">نظرة عامة</h2>
                <p className="text-gray-700 leading-relaxed">{workshop.long_description || workshop.short_description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">المدرب</h2>
                <div className="bg-gray-50 rounded-lg p-6 flex items-center space-x-6 space-x-reverse">
                  <div className="flex-shrink-0">
                    <img 
                      src={workshop.instructor_image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(workshop.instructor)} 
                      alt={workshop.instructor} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">د. {workshop.instructor}</h3>
                    <p className="text-gray-600">{workshop.instructor_bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">{workshop.price} د.ك</p>
                  <p className="text-gray-600">شامل المواد التدريبية والشهادة</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-emerald-500" />
                    <span>12 ساعة تدريبية مكثفة</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-emerald-500" />
                    <span>شهادة معتمدة</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <CheckCircle2 className="text-emerald-500" />
                    <span>مواد تدريبية رقمية</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-primary" />
                      <span>تاريخ البدء</span>
                    </div>
                    <span className="font-medium">{workshop.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary" />
                      <span>المدة</span>
                    </div>
                    <span className="font-medium">12 ساعة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary" />
                      <span>المقاعد المتبقية</span>
                    </div>
                    <span className={workshop.available_seats <= 5 ? "font-bold text-red-500" : "font-medium"}>
                      {workshop.available_seats}
                    </span>
                  </div>
                </div>

                {isAvailable ? (
                  <Button 
                    onClick={() => navigate(`/workshop-registration?id=${workshop.id}`)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    سجل الآن
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    نفذت التذاكر
                  </Button>
                )}
                
                {workshop.available_seats <= 5 && workshop.available_seats > 0 && (
                  <p className="text-center text-sm text-red-500 mt-2">
                    المقاعد محدودة - {workshop.available_seats} مقاعد متبقية
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
