
import { useState, useEffect } from "react";
import { Calendar, Award, BookOpen, UserRound } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatisticsOverview from "@/components/admin/dashboard/StatisticsOverview";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserRegistrations } from "@/services/workshopService";
import { fetchUserCertificates } from "@/services/certificateService";

const SubscriberDashboard = () => {
  const { user, userProfile } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const registrationsData = await fetchUserRegistrations(user.id);
        setRegistrations(registrationsData);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const stats = [
    {
      title: "الورش المسجلة",
      value: registrations.length,
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-blue-100",
      bgClass: "text-blue-500",
    },
    {
      title: "الشهادات",
      value: "6",
      icon: <Award className="h-5 w-5" />,
      color: "bg-green-100",
      bgClass: "text-green-500",
    },
    {
      title: "الدروس المكتملة",
      value: "8/6",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-100",
      bgClass: "text-purple-500",
    },
    {
      title: "الملف الشخصي",
      value: "مكتمل",
      icon: <UserRound className="h-5 w-5" />,
      color: "bg-orange-100",
      bgClass: "text-orange-500",
    },
  ];

  const quickActions = [
    {
      id: "workshops",
      title: "الورش",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-500",
      onClick: () => {},
    },
    {
      id: "certificates",
      title: "الشهادات",
      icon: <Award className="h-6 w-6" />,
      color: "bg-green-100 text-green-500",
      onClick: () => {},
    },
    {
      id: "schedule",
      title: "الجدول",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-500",
      onClick: () => {},
    },
    {
      id: "support",
      title: "الدعم الفني",
      icon: <UserRound className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-500",
      onClick: () => {},
    },
  ];

  return (
    <DashboardLayout title="لوحة التحكم" requireRole="subscriber">
      <div className="space-y-8">
        <StatisticsOverview stats={stats} />
        <QuickActions 
          title="الوصول السريع" 
          actions={quickActions}
        />

        <Card>
          <CardHeader>
            <CardTitle>آخر الورش المسجلة</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.slice(0, 5).map((reg: any) => (
              <div
                key={reg.id}
                className="flex items-center justify-between border-b py-4 last:border-0"
              >
                <div>
                  <h4 className="font-medium">{reg.workshops?.title}</h4>
                  <p className="text-sm text-gray-500">{reg.workshops?.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  عرض التفاصيل
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriberDashboard;
