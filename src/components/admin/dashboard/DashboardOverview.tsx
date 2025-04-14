
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, Users, Calendar, DollarSign, BarChart2, Plus } from "lucide-react";
import { Workshop } from "@/types/supabase";
import { Link } from "react-router-dom";
import { useMemoizedWorkshops } from "@/hooks/useMemoizedWorkshops";
import StatisticsCard from "@/components/dashboard/StatisticsCard";
import SkeletonLoader from "@/components/ui/skeleton-loader";

interface DashboardOverviewProps {
  workshops: Workshop[];
  onNavigate?: (tab: string) => void;
  isLoading?: boolean;
}

const DashboardOverview = memo(({ workshops, onNavigate, isLoading = false }: DashboardOverviewProps) => {
  const { statistics, nextWorkshops } = useMemoizedWorkshops(workshops);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const { totalWorkshops, confirmedParticipants, confirmedRevenue } = statistics;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">لوحة المعلومات</h2>
        <Button asChild className="flex items-center gap-2">
          <Link to="/admin/workshops/create">
            <Plus size={16} />
            ورشة جديدة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCard
          title="إجمالي الورش"
          value={totalWorkshops}
          icon={<Calendar className="h-4 w-4" />}
          description="ورشة مسجلة في النظام"
        />
        <StatisticsCard
          title="عدد المشاركين"
          value={confirmedParticipants}
          icon={<Users className="h-4 w-4" />}
          description="مشارك في جميع الورش"
        />
        <StatisticsCard
          title="الإيرادات"
          value={`${confirmedRevenue} د.ك`}
          icon={<DollarSign className="h-4 w-4" />}
          description="إجمالي الإيرادات من الورش"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">الورش القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            {nextWorkshops.length > 0 ? (
              <div className="space-y-4">
                {nextWorkshops.map((workshop) => (
                  <div key={workshop.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{workshop.title}</p>
                      <p className="text-sm text-muted-foreground">{workshop.date} | {workshop.time}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onNavigate && onNavigate('workshops')}>
                      عرض التفاصيل
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => onNavigate && onNavigate('workshops')}
                >
                  عرض جميع الورش
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">لا توجد ورش قادمة</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  asChild
                >
                  <Link to="/admin/workshops/create">
                    إضافة ورشة جديدة
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">الإحصاءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">نسبة الحجوزات</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-wirashna-accent h-2.5 rounded-full"
                      style={{
                        width: `${workshops.length > 0 
                          ? Math.floor((confirmedParticipants / (workshops.reduce((sum, w) => sum + w.total_seats, 0))) * 100) 
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  {workshops.length > 0 
                    ? Math.floor((confirmedParticipants / (workshops.reduce((sum, w) => sum + w.total_seats, 0))) * 100) 
                    : 0}%
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate && onNavigate('settings')}
                >
                  إعدادات الموقع
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

DashboardOverview.displayName = 'DashboardOverview';

// Import Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

export default DashboardOverview;
