
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkshopList from "@/components/workshops/WorkshopList";
import { useWorkshopRegistrations } from "@/hooks/useWorkshopRegistrations";
import { EnhancedBentoGrid } from "@/components/ui/enhanced-bento-grid";
import AnalyticsBentoCard from "@/components/admin/analytics/AnalyticsBentoCard";
import { Calendar, Clock, Award, TrendingUp, BookOpen, Users } from "lucide-react";

const SubscriberWorkshops = () => {
  const { isLoading, upcomingWorkshops, pastWorkshops, hasCertificate } = useWorkshopRegistrations();

  const completedWorkshops = pastWorkshops.length;
  const totalHours = pastWorkshops.length * 2.5; // Average 2.5 hours per workshop
  const certificatesEarned = pastWorkshops.filter(w => hasCertificate(w.id)).length;
  const completionRate = completedWorkshops > 0 ? Math.round((certificatesEarned / completedWorkshops) * 100) : 0;

  return (
    <DashboardLayout title="الورش المسجلة" requireRole="subscriber">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Learning Analytics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">إحصائيات التعلم</h2>
            <EnhancedBentoGrid variant="dashboard">
              <AnalyticsBentoCard
                title="الورش القادمة"
                value={upcomingWorkshops.length}
                icon={Calendar}
                gradient="live"
                size="small"
              />
              
              <AnalyticsBentoCard
                title="الورش المكتملة"
                value={completedWorkshops}
                change={{ value: 20, period: "الشهر الماضي" }}
                icon={BookOpen}
                gradient="success"
                size="small"
              />
              
              <AnalyticsBentoCard
                title="ساعات التعلم"
                value={`${totalHours} ساعة`}
                change={{ value: 15, period: "الشهر الماضي" }}
                icon={Clock}
                gradient="ai"
                size="small"
              />
              
              <AnalyticsBentoCard
                title="الشهادات المحصلة"
                value={certificatesEarned}
                icon={Award}
                gradient="marketing"
                size="small"
              />
              
              <AnalyticsBentoCard
                title="معدل الإتمام"
                value={`${completionRate}%`}
                change={{ value: 10, period: "الشهر الماضي" }}
                icon={TrendingUp}
                gradient="content"
                size="medium"
              />
              
              <AnalyticsBentoCard
                title="إجمالي التفاعل"
                value="ممتاز"
                icon={Users}
                gradient="analytics"
                size="small"
              />
            </EnhancedBentoGrid>
          </div>

          {/* Workshop Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">الورش القادمة ({upcomingWorkshops.length})</TabsTrigger>
              <TabsTrigger value="past">الورش السابقة ({pastWorkshops.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <WorkshopList 
                workshops={upcomingWorkshops} 
                type="upcoming"
              />
            </TabsContent>
            
            <TabsContent value="past">
              <WorkshopList 
                workshops={pastWorkshops} 
                type="past"
                hasCertificate={hasCertificate}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubscriberWorkshops;
