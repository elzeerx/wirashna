
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
import MobileRegistration from "@/components/workshop/MobileRegistration";
import { useLoadingState } from "@/hooks/useLoadingState";
import { Workshop } from "@/types/supabase";
import { WorkshopDate } from "@/types/workshop";
import { formatTimeWithPeriod } from "@/utils/dateUtils";
import { EnhancedBentoGrid, EnhancedBentoCard } from "@/components/ui/enhanced-bento-grid";
import { Users, Calendar, Clock, MapPin, Star, Award } from "lucide-react";

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
          <div className="wirashna-container py-12">
            <EnhancedBentoGrid variant="workshop">
              {[...Array(6)].map((_, index) => (
                <EnhancedBentoCard key={index} size="medium" loading={true} />
              ))}
            </EnhancedBentoGrid>
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

  const occupancyRate = workshop.total_seats > 0 
    ? Math.round(((workshop.total_seats - workshop.available_seats) / workshop.total_seats) * 100) 
    : 0;

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
            {/* Workshop Quick Info */}
            <EnhancedBentoGrid variant="workshop" className="mb-8">
              <EnhancedBentoCard size="small" gradient="ai">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">المشاركين</div>
                    <div className="font-bold">{workshop.total_seats - workshop.available_seats}/{workshop.total_seats}</div>
                  </div>
                </div>
              </EnhancedBentoCard>

              <EnhancedBentoCard size="small" gradient="marketing">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">التاريخ</div>
                    <div className="font-bold">{workshop.date}</div>
                  </div>
                </div>
              </EnhancedBentoCard>

              <EnhancedBentoCard size="small" gradient="content">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">الوقت</div>
                    <div className="font-bold">{workshop.time}</div>
                  </div>
                </div>
              </EnhancedBentoCard>

              <EnhancedBentoCard size="small" gradient="success">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">المكان</div>
                    <div className="font-bold text-sm">{workshop.venue}</div>
                  </div>
                </div>
              </EnhancedBentoCard>

              <EnhancedBentoCard size="medium" gradient="live">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{occupancyRate}%</div>
                  <div className="text-sm font-medium">معدل الإشغال</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {workshop.available_seats} مقعد متبقي
                  </div>
                </div>
              </EnhancedBentoCard>

              <EnhancedBentoCard size="small" gradient="warning">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">السعر</div>
                    <div className="font-bold text-lg">{workshop.price} د.ك</div>
                  </div>
                </div>
              </EnhancedBentoCard>
            </EnhancedBentoGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <EnhancedBentoCard size="featured" gradient="default">
                  <WorkshopDescription description={workshop.long_description || workshop.short_description} />
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="featured" gradient="default">
                  <WorkshopDetailsSection
                    objectives={workshop.objectives}
                    benefits={workshop.benefits}
                    requirements={workshop.requirements}
                    targetAudience={workshop.target_audience}
                  />
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="featured" gradient="ai">
                  <InstructorCard
                    name={workshop.instructor}
                    bio={workshop.instructor_bio || ""}
                    image={workshop.instructor_image}
                  />
                </EnhancedBentoCard>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <EnhancedBentoCard size="large" gradient="default">
                    <WorkshopSidebar
                      dates={workshopDates}
                      venue={workshop.venue}
                      location={workshop.location}
                      availableSeats={workshop.available_seats}
                      totalSeats={workshop.total_seats}
                      price={workshop.price}
                      workshopId={workshop.id}
                    />
                  </EnhancedBentoCard>
                </div>
              </div>
            </div>

            {/* Mobile Registration Component */}
            <div className="mt-12 lg:hidden">
              <MobileRegistration
                workshopId={workshop.id}
                dates={workshopDates}
                venue={workshop.venue}
                location={workshop.location}
                availableSeats={workshop.available_seats}
                totalSeats={workshop.total_seats}
                price={workshop.price}
              />
            </div>
          </div>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
