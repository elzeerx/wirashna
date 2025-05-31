
import { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import AdminWorkshopList from "@/components/admin/workshops/AdminWorkshopList";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import { useLoadingState } from "@/hooks/useLoadingState";
import { EnhancedBentoGrid } from "@/components/ui/enhanced-bento-grid";
import AnalyticsBentoCard from "@/components/admin/analytics/AnalyticsBentoCard";
import { Users, Calendar, TrendingUp, DollarSign, Play, Clock } from "lucide-react";

const AdminWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
  const { isLoading, wrapAsync } = useLoadingState({
    errorMessage: "حدث خطأ أثناء تحميل الورش. الرجاء المحاولة مرة أخرى."
  });

  const loadWorkshops = async () => {
    wrapAsync(async () => {
      const data = await fetchWorkshops();
      setWorkshops(data);
    });
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const handleWorkshopsUpdated = (updatedWorkshops: Workshop[]) => {
    setWorkshops(updatedWorkshops);
  };

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
  };

  // Calculate analytics
  const totalWorkshops = workshops.length;
  const activeWorkshops = workshops.filter(w => !w.registration_closed).length;
  const totalSeats = workshops.reduce((sum, w) => sum + w.total_seats, 0);
  const availableSeats = workshops.reduce((sum, w) => sum + w.available_seats, 0);
  const occupancyRate = totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0;
  const totalRevenue = workshops.reduce((sum, w) => sum + (w.price * (w.total_seats - w.available_seats)), 0);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الورش</h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة شاملة للورش والتسجيلات مع تحليلات مفصلة
          </p>
        </div>

        {/* Analytics Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
          <EnhancedBentoGrid variant="admin">
            <AnalyticsBentoCard
              title="إجمالي الورش"
              value={totalWorkshops}
              change={{ value: 12, period: "الشهر الماضي" }}
              icon={Calendar}
              gradient="analytics"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="الورش النشطة"
              value={activeWorkshops}
              change={{ value: 8, period: "الأسبوع الماضي" }}
              icon={Play}
              gradient="live"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="معدل الإشغال"
              value={`${occupancyRate}%`}
              change={{ value: 15, period: "الشهر الماضي" }}
              icon={TrendingUp}
              gradient="success"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="إجمالي المتدربين"
              value={totalSeats - availableSeats}
              change={{ value: 25, period: "الشهر الماضي" }}
              icon={Users}
              gradient="ai"
              size="small"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="الإيرادات المحققة"
              value={`${totalRevenue.toFixed(2)} د.ك`}
              change={{ value: 18, period: "الشهر الماضي" }}
              icon={DollarSign}
              gradient="marketing"
              size="medium"
              loading={isLoading}
            />
            
            <AnalyticsBentoCard
              title="متوسط مدة الورشة"
              value="2.5 ساعة"
              icon={Clock}
              gradient="content"
              size="small"
              loading={isLoading}
            />
          </EnhancedBentoGrid>
        </div>

        {/* Workshops Management */}
        <div>
          <h2 className="text-xl font-semibold mb-4">إدارة الورش</h2>
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="wirashna-loader"></div>
            </div>
          ) : (
            <AdminWorkshopList 
              workshops={workshops} 
              onWorkshopsUpdated={handleWorkshopsUpdated}
              onWorkshopSelect={handleWorkshopSelect}
            />
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminWorkshopsPage;
