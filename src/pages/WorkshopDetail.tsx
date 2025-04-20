
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchWorkshopById } from "@/services/workshops";
import WorkshopSidebar from "@/components/workshop/WorkshopSidebar";
import WorkshopDetailsSection from "@/components/workshop/WorkshopDetailsSection";
import WorkshopDescription from "@/components/workshop/WorkshopDescription";
import WorkshopGallery from "@/components/workshop/WorkshopGallery";
import InstructorCard from "@/components/workshop/InstructorCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLoadingState } from "@/hooks/useLoadingState";
import { Workshop } from "@/types/supabase";
import { WorkshopDate } from "@/types/workshop";
import { formatTimeWithPeriod } from "@/utils/dateUtils";

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, wrapAsync } = useLoadingState({
    errorMessage: "حدث خطأ أثناء تحميل بيانات الورشة. الرجاء المحاولة مرة أخرى."
  });
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    if (!id) return;

    wrapAsync(async () => {
      const workshopData = await fetchWorkshopById(id);
      
      if (!workshopData) {
        return navigate("/workshops");
      }
      
      setWorkshop(workshopData);
    });
  }, [id, navigate, wrapAsync]);

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

  // تحديد مواعيد الورشة - إما من حقل dates أو من البيانات الأساسية
  const workshopDates: WorkshopDate[] = workshop.dates && Array.isArray(workshop.dates) 
    ? (workshop.dates as unknown as WorkshopDate[])
    : [{
        date: workshop.date,
        time: workshop.time,
        endTime: workshop.end_time || "", 
        displayTime: formatTimeWithPeriod(workshop.time),
      }];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ErrorBoundary>
        <main className="flex-grow">
          <WorkshopGallery
            mainImage={workshop.cover_image}
            gallery={workshop.gallery || []}
            title={workshop.title}
          />

          <div className="wirashna-container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <WorkshopDescription description={workshop.long_description || workshop.short_description} />
                <WorkshopDetailsSection
                  objectives={workshop.objectives}
                  benefits={workshop.benefits}
                  requirements={workshop.requirements}
                  targetAudience={workshop.target_audience}
                />
                <InstructorCard
                  name={workshop.instructor}
                  bio={workshop.instructor_bio || ""}
                  image={workshop.instructor_image}
                />
              </div>
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
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
