
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkshopList from "@/components/workshops/WorkshopList";
import { useWorkshopRegistrations } from "@/hooks/useWorkshopRegistrations";

const SubscriberWorkshops = () => {
  const { isLoading, upcomingWorkshops, pastWorkshops, hasCertificate } = useWorkshopRegistrations();

  return (
    <DashboardLayout title="الورش المسجلة" requireRole="subscriber">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="wirashna-loader"></div>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">الورش القادمة</TabsTrigger>
            <TabsTrigger value="past">الورش السابقة</TabsTrigger>
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
      )}
    </DashboardLayout>
  );
};

export default SubscriberWorkshops;
