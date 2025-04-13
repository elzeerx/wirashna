
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import AdminWorkshopList from "@/components/admin/workshops/AdminWorkshopList";
import SiteSettings from "@/components/admin/settings/SiteSettings";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";
import WorkshopRegistrationsList from "@/components/admin/workshops/WorkshopRegistrationsList";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshopService";

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

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
    setActiveTab("registrations");
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
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
        
        <TabsContent value="overview" className="mt-6">
          <DashboardOverview 
            workshops={workshops} 
            onNavigate={handleNavigate}
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
            <WorkshopRegistrationsList workshopId={selectedWorkshopId} />
          ) : (
            <p className="text-center py-8 text-gray-500">
              الرجاء اختيار ورشة من قائمة الورش لعرض التسجيلات الخاصة بها
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
