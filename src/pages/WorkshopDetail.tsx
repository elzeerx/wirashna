
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import WorkshopSidebar from "@/components/workshop/WorkshopSidebar";
import WorkshopDetailsSection from "@/components/workshop/WorkshopDetailsSection";
import { WorkshopDate } from "@/types/workshop";

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

  // Convert workshop dates to WorkshopDate format
  const workshopDates: WorkshopDate[] = [{
    date: workshop.date,
    time: workshop.time,
    endTime: "", // This should be calculated or fetched from the database
    displayTime: workshop.time, // This should be formatted properly
  }];

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
              {workshop.available_seats > 0 && (
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
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">نظرة عامة</h2>
                <p className="text-gray-700 leading-relaxed">
                  {workshop.long_description || workshop.short_description}
                </p>
              </div>

              {/* Workshop Details */}
              <WorkshopDetailsSection
                objectives={workshop.objectives}
                benefits={workshop.benefits}
                requirements={workshop.requirements}
                targetAudience={workshop.target_audience}
              />

              {/* Instructor */}
              <div>
                <h2 className="text-2xl font-bold mb-4">المدرب</h2>
                <div className="bg-gray-50 rounded-lg p-6 flex items-center space-x-6 space-x-reverse">
                  <div className="flex-shrink-0">
                    <img 
                      src={workshop.instructor_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(workshop.instructor)}`} 
                      alt={workshop.instructor} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{workshop.instructor}</h3>
                    <p className="text-gray-600">{workshop.instructor_bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <WorkshopSidebar
                dates={workshopDates}
                venue={workshop.venue}
                location={workshop.location}
                availableSeats={workshop.available_seats}
                totalSeats={workshop.total_seats}
                price={workshop.price}
                workshopId={workshop.id}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
