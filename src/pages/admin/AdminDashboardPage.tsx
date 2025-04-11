
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import AdminWorkshopList from "@/components/admin/workshops/AdminWorkshopList";
import AdminPagesList from "@/components/admin/pages/AdminPagesList";
import SiteSettings from "@/components/admin/settings/SiteSettings";
import PageBuilder from "@/components/admin/builder/PageBuilder";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshopService";

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
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

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setActiveTab("page-builder");
  };

  const handleNewPage = () => {
    setSelectedPageId(null);
    setActiveTab("page-builder");
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
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">لوحة المعلومات</TabsTrigger>
          <TabsTrigger value="workshops">إدارة الورش</TabsTrigger>
          <TabsTrigger value="pages">إدارة الصفحات</TabsTrigger>
          <TabsTrigger value="page-builder">محرر الصفحات</TabsTrigger>
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
          />
        </TabsContent>
        
        <TabsContent value="pages" className="mt-6">
          <AdminPagesList
            onPageSelect={handlePageSelect}
            onNewPage={handleNewPage}
          />
        </TabsContent>
        
        <TabsContent value="page-builder" className="mt-6">
          <PageBuilder pageId={selectedPageId} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SiteSettings />
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
