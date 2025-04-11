
import { useParams } from "react-router-dom";
import { Target, UserRound, Award, BookOpen } from "lucide-react";
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
import { workshops } from "@/data/workshops";
import { workshopObjectives, targetAudience } from "@/data/workshopSections";

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const workshop = workshops.find(w => w.id === id);
  
  const relatedWorkshops = workshop 
    ? workshops
        .filter(w => w.id !== workshop.id)
        .filter(w => w.venue === workshop.venue || Math.random() > 0.5)
        .slice(0, 3)
    : [];
  
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
                mainImage={workshop.image} 
                gallery={workshop.gallery} 
                title={workshop.title} 
              />
              
              <WorkshopDescription description={workshop.longDescription} />

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
                bio={workshop.instructorBio} 
              />

              <MobileRegistration />
            </div>
            
            <div className="lg:col-span-1">
              <WorkshopSidebar 
                date={workshop.date}
                time={workshop.time}
                venue={workshop.venue}
                location={workshop.location}
                availableSeats={workshop.availableSeats}
                totalSeats={workshop.totalSeats}
                price={workshop.price}
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
