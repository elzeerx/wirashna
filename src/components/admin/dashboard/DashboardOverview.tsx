
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workshop } from "@/types/supabase";
import { BarChart, Calendar, Users, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardOverviewProps {
  workshops: Workshop[];
}

const DashboardOverview = ({ workshops }: DashboardOverviewProps) => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Get user count
        const { count: userCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
        
        // Get registrations count
        const { count: regCount } = await supabase
          .from('workshop_registrations')
          .select('*', { count: 'exact', head: true });
        
        setTotalUsers(userCount || 0);
        setTotalRegistrations(regCount || 0);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    
    fetchStatistics();
  }, []);

  const cards = [
    {
      title: "الورش",
      value: workshops.length,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      action: () => navigate("/admin/workshops/create"),
      actionText: "إضافة ورشة جديدة"
    },
    {
      title: "المستخدمين",
      value: totalUsers,
      icon: <Users className="h-6 w-6 text-green-500" />,
      action: () => navigate("/admin/users"),
      actionText: "إدارة المستخدمين"
    },
    {
      title: "التسجيلات",
      value: totalRegistrations,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      action: () => {},
      actionText: "عرض التسجيلات"
    },
    {
      title: "إحصائيات",
      icon: <BarChart className="h-6 w-6 text-orange-500" />,
      action: () => {},
      actionText: "عرض الإحصائيات"
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مرحبًا بك في لوحة التحكم</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              {card.value !== undefined && (
                <p className="text-3xl font-bold mb-3">{card.value}</p>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={card.action}
              >
                {card.actionText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>آخر الورش</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <div className="space-y-4">
              {workshops.slice(0, 5).map((workshop) => (
                <div key={workshop.id} className="flex items-center space-x-4 rtl:space-x-reverse border-b pb-2">
                  <div className="w-12 h-12 rounded-md bg-gray-200 overflow-hidden">
                    {workshop.image && (
                      <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{workshop.title}</h4>
                    <p className="text-sm text-gray-500">{workshop.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>روابط سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2"
                onClick={() => setActiveTab("page-builder")}
              >
                <FileText className="h-4 w-4" />
                إنشاء صفحة جديدة
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2"
                onClick={() => navigate("/admin/workshops/create")}
              >
                <Calendar className="h-4 w-4" />
                إضافة ورشة جديدة
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4" />
                إعدادات الموقع
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2"
                onClick={() => navigate("/")}
              >
                <div className="h-4 w-4" />
                عرض الموقع
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
