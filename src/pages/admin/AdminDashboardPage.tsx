
import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshops";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonLoader from "@/components/ui/skeleton-loader";

// Lazy load components to reduce initial bundle size
const DashboardOverview = lazy(() => import("@/components/admin/dashboard/DashboardOverview"));
const AdminWorkshopList = lazy(() => import("@/components/admin/workshops/AdminWorkshopList"));
const SiteSettings = lazy(() => import("@/components/admin/settings/SiteSettings"));
const WorkshopRegistrationsList = lazy(() => import("@/components/admin/workshops/registrations").then(
  module => ({ default: module.WorkshopRegistrationsList })
));

// Loading fallback component
const TabContentLoader = () => (
  <div className="p-4">
    <SkeletonLoader count={5} />
  </div>
);

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
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

  // Memoize the selected workshop 
  const selectedWorkshop = useMemo(() => {
    if (!selectedWorkshopId) return null;
    return workshops.find(w => w.id === selectedWorkshopId) || null;
  }, [selectedWorkshopId, workshops]);

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

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
    setActiveTab("registrations");
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const clearSelectedWorkshop = () => {
    setSelectedWorkshopId(null);
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout isLoading={true} />
    );
  }

  return (
    <AdminDashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">لوحة المعلومات</TabsTrigger>
          <TabsTrigger value="workshops">إدارة الورش</TabsTrigger>
          <TabsTrigger value="registrations">التسجيلات</TabsTrigger>
          <TabsTrigger value="settings">إعدادات الموقع</TabsTrigger>
        </TabsList>
        
        <Suspense fallback={<TabContentLoader />}>
          <TabsContent value="overview" className="mt-6">
            <DashboardOverview 
              workshops={workshops} 
              onNavigate={handleNavigate}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="workshops" className="mt-6">
            <AdminWorkshopList 
              workshops={workshops} 
              onWorkshopsUpdated={setWorkshops}
              onWorkshopSelect={handleWorkshopSelect}
            />
          </TabsContent>
          
          <TabsContent value="registrations" className="mt-6">
            {selectedWorkshopId ? (
              <>
                <Breadcrumb className="mb-4">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => clearSelectedWorkshop()}>جميع الورش</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selectedWorkshop?.title || "تسجيلات الورشة"}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <WorkshopRegistrationsList workshopId={selectedWorkshopId} />
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">قائمة الورش</h3>
                  <p className="text-gray-500 mb-4">الرجاء اختيار ورشة من القائمة أدناه لعرض التسجيلات الخاصة بها</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workshops.map(workshop => (
                    <div 
                      key={workshop.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => handleWorkshopSelect(workshop.id)}
                    >
                      <h4 className="font-medium mb-2">{workshop.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{workshop.short_description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>التاريخ: {workshop.date}</span>
                        <span className="text-muted-foreground">اضغط لعرض التسجيلات</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <SiteSettings />
          </TabsContent>
        </Suspense>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
