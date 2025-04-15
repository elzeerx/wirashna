import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWorkshopById } from "@/services/workshops";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import WorkshopSidebar from "@/components/workshop/WorkshopSidebar";
import WorkshopDetailsSection from "@/components/workshop/WorkshopDetailsSection";
import WorkshopDescription from "@/components/workshop/WorkshopDescription";
import WorkshopGallery from "@/components/workshop/WorkshopGallery";
import InstructorCard from "@/components/workshop/InstructorCard";
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
        <WorkshopGallery
          mainImage={workshop.cover_image}
          gallery={workshop.gallery || []}
          title={workshop.title}
        />

        {/* Content Section */}
        <div className="wirashna-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <WorkshopDescription description={workshop.long_description || workshop.short_description} />

              {/* Workshop Details */}
              <WorkshopDetailsSection
                objectives={workshop.objectives}
                benefits={workshop.benefits}
                requirements={workshop.requirements}
                targetAudience={workshop.target_audience}
              />

              {/* Instructor */}
              <InstructorCard
                name={workshop.instructor}
                bio={workshop.instructor_bio || ""}
                image={workshop.instructor_image}
              />
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
