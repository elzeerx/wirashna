import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import SkeletonLoader from "@/components/ui/skeleton-loader";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import {
  BarChart3,
  Users,
  CalendarDays,
  DollarSign,
  AlertTriangle,
  FileText,
  UserPlus,
  Plus,
  PencilRuler
} from "lucide-react";
import { Card } from "@/components/ui/card";

// Lazy load components
const StatisticsOverview = lazy(() => import("@/components/admin/dashboard/StatisticsOverview"));
const RecentActivities = lazy(() => import("@/components/admin/dashboard/RecentActivities"));
const QuickActions = lazy(() => import("@/components/admin/dashboard/QuickActions"));

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error loading workshops:", error);
        toast({
          title: "خطأ في تحميل الورش",
          description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshops();
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

  // Mock data for recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'registration',
      title: 'تسجيل مشترك جديد',
      description: 'محمد أحمد - ورشة تطوير المحتوى',
      time: 'قبل 5 دقائق',
      icon: <Users className="text-green-500" />
    },
    {
      id: '2',
      type: 'payment',
      title: 'دفع جديد',
      description: '299 د.ك - ورشة التسويق الرقمي',
      time: 'قبل 15 دقيقة',
      icon: <DollarSign className="text-blue-500" />
    },
    {
      id: '3',
      type: 'content',
      title: 'تحديث محتوى',
      description: 'تم تحديث محتوى ورشة تحليل البيانات',
      time: 'قبل ساعة',
      icon: <PencilRuler className="text-amber-500" />
    }
  ];

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
      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
          <h2 className="text-2xl font-bold mb-4">القائمة الرئيسية</h2>
          <p className="text-gray-500 mb-4">مرحباً بك في لوحة التحكم</p>
        </div>

        <Suspense fallback={<SkeletonLoader count={4} className="h-24" />}>
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
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
          </div>
        </Suspense>

        <Suspense fallback={<SkeletonLoader count={1} className="h-48" />}>
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
            <QuickActions 
              title="إجراءات سريعة" 
              actions={quickActions} 
            />
          </div>
        </Suspense>

        <Suspense fallback={<SkeletonLoader count={1} className="h-64" />}>
          <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
            <RecentActivities 
              title="النشاطات الأخيرة" 
              activities={recentActivities} 
              onViewAll={() => navigate('/admin')} 
            />
          </div>
        </Suspense>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
