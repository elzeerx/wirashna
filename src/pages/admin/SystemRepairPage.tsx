
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TapApiChecker from "@/components/admin/payment/TapApiChecker";
import WorkshopRepairTool from "@/components/admin/workshops/WorkshopRepairTool";

const SystemRepairPage = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">أدوات إصلاح النظام</h1>
          <p className="text-muted-foreground">
            استخدم هذه الأدوات لإصلاح مشاكل النظام وتحديث البيانات
          </p>
        </div>
        
        <Tabs defaultValue="workshops">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workshops">إصلاح الورش</TabsTrigger>
            <TabsTrigger value="payments">إصلاح نظام الدفع</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workshops" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إصلاح بيانات الورش</CardTitle>
                <CardDescription>
                  إصلاح مشاكل بيانات الورش وتحديث عدد المقاعد والتسجيلات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkshopRepairTool />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="mt-4 space-y-6">
            <TapApiChecker />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default SystemRepairPage;
