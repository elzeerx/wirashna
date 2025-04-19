
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/database";
import { fetchWorkshops } from "@/services/workshops";
import { supabase } from "@/integrations/supabase/client";
import SkeletonLoader from "@/components/ui/skeleton-loader";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import {
  BarChart3,
  Users,
  CalendarDays,
  DollarSign,
  UserPlus,
  Plus,
  FileText,
  AlertTriangle,
  CreditCard,
  PencilRuler
} from "lucide-react";

// Lazy load components
const StatisticsOverview = lazy(() => import("@/components/admin/dashboard/StatisticsOverview"));
const RecentActivities = lazy(() => import("@/components/admin/dashboard/RecentActivities"));
const QuickActions = lazy(() => import("@/components/admin/dashboard/QuickActions"));

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  icon: string;
}

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch workshops
        const workshopsData = await fetchWorkshops();
        setWorkshops(workshopsData);

        // Fetch recent activities
        const { data: activitiesData, error } = await supabase
          .rpc('dashboard_recent_activity');

        if (error) {
          throw error;
        }

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات لوحة التحكم. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin && !isLoading) {
      navigate("/");
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <AdminDashboardLayout isLoading={true} />
    );
  }

  // Calculate statistics from workshops
  const totalWorkshops = workshops.length;
  const totalParticipants = workshops.reduce((sum, workshop) => 
    sum + (workshop.total_seats - workshop.available_seats), 0);
  const totalRevenue = workshops.reduce((sum, workshop) => 
    sum + (workshop.price * (workshop.total_seats - workshop.available_seats)), 0);
  const completionRate = workshops.length > 0 
    ? Math.round((totalParticipants / workshops.reduce((sum, w) => sum + w.total_seats, 0)) * 100) 
    : 0;

  // Quick actions data
  const quickActions = [
    {
      id: '1',
      title: 'تقارير النظام',
      icon: <AlertTriangle size={24} />,
      color: 'bg-red-100 text-red-600',
      onClick: () => navigate('/admin/system-repair')
    },
    {
      id: '2',
      title: 'تقرير المبيعات',
      icon: <FileText size={24} />,
      color: 'bg-amber-100 text-amber-600',
      onClick: () => navigate('/admin')
    },
    {
      id: '3',
      title: 'إضافة مشترك',
      icon: <UserPlus size={24} />,
      color: 'bg-green-100 text-green-600',
      onClick: () => navigate('/admin/users')
    },
    {
      id: '4',
      title: 'إضافة ورشة جديدة',
      icon: <Plus size={24} />,
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/admin/workshops/create')
    }
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">القائمة الرئيسية</h2>
          <p className="text-gray-500">مرحباً بك في لوحة التحكم</p>
        </div>

        <Suspense fallback={<SkeletonLoader count={4} className="h-24" />}>
          <StatisticsOverview 
            stats={[
              { 
                title: 'إجمالي الورش',
                value: totalWorkshops,
                icon: <CalendarDays className="text-white" />,
                color: 'bg-blue-500',
                bgClass: 'bg-blue-100'
              },
              { 
                title: 'المشتركين النشطين',
                value: totalParticipants,
                icon: <Users className="text-white" />,
                color: 'bg-green-500',
                bgClass: 'bg-green-100'
              },
              { 
                title: 'إجمالي المبيعات',
                value: `${totalRevenue.toFixed(0)} د.ك`,
                icon: <DollarSign className="text-white" />,
                color: 'bg-amber-500',
                bgClass: 'bg-amber-100'
              },
              { 
                title: 'معدل الإكتمال',
                value: `${completionRate}%`,
                icon: <BarChart3 className="text-white" />,
                color: 'bg-purple-500',
                bgClass: 'bg-purple-100'
              }
            ]}
          />
        </Suspense>

        <Suspense fallback={<SkeletonLoader count={1} className="h-48" />}>
          <QuickActions title="إجراءات سريعة" actions={quickActions} />
        </Suspense>

        <Suspense fallback={<SkeletonLoader count={1} className="h-64" />}>
          <RecentActivities 
            title="النشاطات الأخيرة" 
            activities={activities.map(activity => ({
              ...activity,
              icon: getLucideIcon(activity.icon)
            }))} 
            onViewAll={() => navigate('/admin')} 
          />
        </Suspense>
      </div>
    </AdminDashboardLayout>
  );
};

// Helper function to map icon names to Lucide components
const getLucideIcon = (iconName: string) => {
  const icons = {
    'user-plus': <UserPlus className="text-green-500" />,
    'credit-card': <CreditCard className="text-blue-500" />,
    'edit': <PencilRuler className="text-amber-500" />
  };
  return icons[iconName as keyof typeof icons] || <Users className="text-gray-500" />;
};

export default AdminDashboardPage;
