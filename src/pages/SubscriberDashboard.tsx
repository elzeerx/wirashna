
import { useState, useEffect } from "react";
import { Calendar, Award, BookOpen, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations } from "@/services/workshopService";
import { fetchUserCertificates } from "@/services/certificateService";
import { WorkshopRegistration, WorkshopCertificate } from "@/types/supabase";

const SubscriberDashboard = () => {
  const { user, userProfile } = useAuth();
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [certificates, setCertificates] = useState<WorkshopCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [registrationsData, certificatesData] = await Promise.all([
          fetchUserRegistrations(user.id),
          fetchUserCertificates(user.id)
        ]);
        
        setRegistrations(registrationsData);
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Function to get recommended workshops based on user's history
  // This would be more sophisticated in a real app using AI
  const getRecommendedWorkshops = () => {
    return [
      {
        id: "1",
        title: "تطوير تطبيقات الويب",
        date: "١٥ مايو ٢٠٢٥",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2888&auto=format&fit=crop"
      },
      {
        id: "2",
        title: "تصميم واجهات المستخدم",
        date: "٢٠ مايو ٢٠٢٥",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2940&auto=format&fit=crop"
      }
    ];
  };

  const recommendedWorkshops = getRecommendedWorkshops();

  return (
    <DashboardLayout title="لوحة التحكم" requireRole="subscriber">
      <div className="mb-8">
        <h2 className="text-xl mb-4">مرحباً {userProfile?.full_name || user?.email}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatisticsCard
            title="الورش المسجلة"
            value={registrations.length}
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatisticsCard
            title="الشهادات"
            value={certificates.length}
            icon={<Award className="h-4 w-4" />}
          />
          <StatisticsCard
            title="المواد التعليمية"
            value="23"
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatisticsCard
            title="الملف الشخصي"
            value="مكتمل"
            icon={<UserRound className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الورش القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="wirashna-loader"></div>
              </div>
            ) : registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.slice(0, 3).map((registration: any) => (
                  <div key={registration.id} className="flex items-center p-3 border rounded-md">
                    <div className="ml-3">
                      <span className="text-sm text-gray-500">
                        {registration.workshops?.date}
                      </span>
                      <h3 className="font-medium">
                        {registration.workshops?.title}
                      </h3>
                    </div>
                    <Link 
                      to={`/workshops/${registration.workshop_id}`}
                      className="mr-auto text-sm text-wirashna-accent hover:underline"
                    >
                      التفاصيل
                    </Link>
                  </div>
                ))}
                
                <div className="text-center pt-2">
                  <Link 
                    to="/dashboard/workshops"
                    className="text-sm text-wirashna-accent hover:underline"
                  >
                    عرض كل الورش المسجلة
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                لم تقم بالتسجيل في أي ورش بعد
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ورش مقترحة لك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedWorkshops.map((workshop) => (
                <div key={workshop.id} className="flex items-center p-3 border rounded-md">
                  <div className="h-12 w-12 rounded-md overflow-hidden ml-3">
                    <img 
                      src={workshop.image} 
                      alt={workshop.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{workshop.date}</span>
                    <h3 className="font-medium">{workshop.title}</h3>
                  </div>
                  <Link 
                    to={`/workshops/${workshop.id}`}
                    className="mr-auto text-sm text-wirashna-accent hover:underline"
                  >
                    التفاصيل
                  </Link>
                </div>
              ))}
              
              <div className="text-center pt-2">
                <Link 
                  to="/workshops"
                  className="text-sm text-wirashna-accent hover:underline"
                >
                  عرض كل الورش المتاحة
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriberDashboard;
