
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, Settings, Layout, FileEdit, Layers, 
  PanelLeft, LayoutGrid, Database, Users, Palette 
} from "lucide-react";
import { Workshop } from "@/types/supabase";
import { fetchWorkshops } from "@/services/workshopService";
import AdminWorkshopList from "@/components/admin/workshops/AdminWorkshopList";
import SiteManager from "@/components/admin/site/SiteManager";
import PageBuilder from "@/components/admin/site/PageBuilder";
import SiteSettings from "@/components/admin/site/SiteSettings";

const AdminDashboardPage = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
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

  if (isLoading) {
    return (
      <AdminDashboardLayout isLoading={true} />
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-600">أهلاً بك في لوحة التحكم الرئيسية، يمكنك إدارة الموقع بالكامل من هنا</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden md:inline">لوحة التحكم</span>
          </TabsTrigger>
          <TabsTrigger value="workshops" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden md:inline">الورش</span>
          </TabsTrigger>
          <TabsTrigger value="site-manager" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden md:inline">إدارة الصفحات</span>
          </TabsTrigger>
          <TabsTrigger value="page-builder" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            <span className="hidden md:inline">منشئ الصفحات</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">الإعدادات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-wirashna-accent" />
                  الورش
                </CardTitle>
                <CardDescription>إدارة ورش العمل والفعاليات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{workshops.length}</div>
                <Button onClick={() => setActiveTab("workshops")} variant="outline" className="w-full">
                  إدارة الورش
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Layout className="mr-2 h-5 w-5 text-wirashna-accent" />
                  الصفحات
                </CardTitle>
                <CardDescription>إدارة وتحرير صفحات الموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">6</div>
                <Button onClick={() => setActiveTab("site-manager")} variant="outline" className="w-full">
                  إدارة الصفحات
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-wirashna-accent" />
                  المستخدمين
                </CardTitle>
                <CardDescription>إدارة المستخدمين والصلاحيات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">32</div>
                <Button onClick={() => navigate("/admin/users")} variant="outline" className="w-full">
                  إدارة المستخدمين
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الورش الجديدة</CardTitle>
                <CardDescription>آخر الورش المضافة</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-4">
                    {workshops.slice(0, 5).map((workshop) => (
                      <div key={workshop.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">{workshop.title}</div>
                          <div className="text-sm text-gray-500">{workshop.date}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/workshops/${workshop.id}`)}
                        >
                          عرض
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الإحصائيات العامة</CardTitle>
                <CardDescription>معلومات عامة عن الموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">عدد الزيارات الشهرية</span>
                    <span className="font-bold">4,287</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">معدل التفاعل</span>
                    <span className="font-bold">76%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">متوسط وقت التصفح</span>
                    <span className="font-bold">2:45 دقيقة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التسجيلات الجديدة</span>
                    <span className="font-bold">87</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">معدل الحجز</span>
                    <span className="font-bold">62%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workshops">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إدارة الورش</CardTitle>
              <CardDescription>إضافة، تعديل، وحذف ورش العمل</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminWorkshopList 
                workshops={workshops} 
                onWorkshopsUpdated={setWorkshops} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site-manager">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إدارة الصفحات</CardTitle>
              <CardDescription>إدارة صفحات الموقع وهيكله</CardDescription>
            </CardHeader>
            <CardContent>
              <SiteManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-builder">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">منشئ الصفحات</CardTitle>
              <CardDescription>إنشاء وتحرير صفحات الموقع بالسحب والإفلات</CardDescription>
            </CardHeader>
            <CardContent>
              <PageBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إعدادات الموقع</CardTitle>
              <CardDescription>تخصيص وتكوين إعدادات الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <SiteSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;
