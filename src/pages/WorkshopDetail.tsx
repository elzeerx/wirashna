
import { useParams, useNavigate } from "react-router-dom";
import { Target, UserRound, Award, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopGallery from "@/components/workshop/WorkshopGallery";
import WorkshopSidebar from "@/components/workshop/WorkshopSidebar";
import CollapsibleSection from "@/components/workshop/CollapsibleSection";
import InstructorCard from "@/components/workshop/InstructorCard";
import RelatedWorkshops from "@/components/workshop/RelatedWorkshops";
import MobileRegistration from "@/components/workshop/MobileRegistration";
import WorkshopNotFound from "@/components/workshop/WorkshopNotFound";
import WorkshopDescription from "@/components/workshop/WorkshopDescription";
import BackToWorkshopsLink from "@/components/workshop/BackToWorkshopsLink";
import { fetchWorkshopById, fetchWorkshops } from "@/services/workshopService";
import { useToast } from "@/hooks/use-toast";
import { Workshop } from "@/types/supabase";
import { workshopObjectives, targetAudience } from "@/data/workshopSections";

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [relatedWorkshops, setRelatedWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadWorkshopData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch workshop details
        const workshopData = await fetchWorkshopById(id);
        
        if (!workshopData) {
          return navigate("/workshops");
        }
        
        // Ensure workshop cover_image and gallery are properly formatted
        const formattedWorkshop = {
          ...workshopData,
          cover_image: workshopData.cover_image && typeof workshopData.cover_image === 'string' && workshopData.cover_image !== '{}' ? workshopData.cover_image : '',
          gallery: Array.isArray(workshopData.gallery) ? workshopData.gallery.filter(img => img && typeof img === 'string' && img !== '{}') : []
        };
        
        setWorkshop(formattedWorkshop);
        
        // Fetch all workshops for related workshops
        const allWorkshops = await fetchWorkshops();
        
        // Filter related workshops (not including current workshop)
        const related = allWorkshops
          .filter(w => w.id !== id)
          .filter(w => w.venue === workshopData.venue || Math.random() > 0.5)
          .slice(0, 3);
        
        setRelatedWorkshops(related);
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
    return <WorkshopNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <BackToWorkshopsLink />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
              
              <WorkshopGallery 
                mainImage={workshop.cover_image || ""} 
                gallery={workshop.gallery || []} 
                title={workshop.title} 
              />
              
              <WorkshopDescription description={workshop.long_description || workshop.short_description} />

              <CollapsibleSection 
                title="أهداف الورشة"
                items={workshopObjectives}
                icon={<Target size={20} />}
              />

              <CollapsibleSection 
                title="لمن تناسب الورشة"
                items={targetAudience}
                icon={<UserRound size={20} />}
              />

              <CollapsibleSection 
                title="متطلبات الورشة"
                items={workshop.requirements || []}
                icon={<BookOpen size={20} />}
              />

              <CollapsibleSection 
                title="مميزات الورشة"
                items={workshop.benefits || []}
                icon={<Award size={20} />}
              />
              
              <InstructorCard 
                name={workshop.instructor} 
                bio={workshop.instructor_bio || ""} 
                image={workshop.instructor_image || ""}
              />

              {/* Move MobileRegistration component to after all the workshop details */}
              <MobileRegistration workshopId={workshop.id} />
            </div>
            
            <div className="lg:col-span-1">
              <WorkshopSidebar 
                date={workshop.date}
                time={workshop.time}
                venue={workshop.venue}
                location={workshop.location}
                availableSeats={workshop.available_seats}
                totalSeats={workshop.total_seats}
                price={workshop.price}
                workshopId={workshop.id}
              />
            </div>
          </div>

          <RelatedWorkshops workshops={relatedWorkshops} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
