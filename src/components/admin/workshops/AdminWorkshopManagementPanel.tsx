
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import { useWorkshopOperations } from "@/hooks/useWorkshopOperations";
import { Workshop } from "@/types/supabase";
import { WorkshopRegistrationsList } from "./registrations";
import WorkshopRepairTool from "./WorkshopRepairTool";

interface AdminWorkshopManagementPanelProps {
  workshop: Workshop;
  onWorkshopUpdated: (workshops: Workshop[]) => void;
  onClose: () => void;
}

const AdminWorkshopManagementPanel = ({
  workshop,
  onWorkshopUpdated,
  onClose
}: AdminWorkshopManagementPanelProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const { handleUpdate } = useWorkshopOperations({
    onWorkshopsUpdated: onWorkshopUpdated
  });

  const handleWorkshopUpdate = async (data: any) => {
    const success = await handleUpdate(workshop.id, data);
    if (success) {
      onClose();
    }
    return success;
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">تفاصيل الورشة</TabsTrigger>
        <TabsTrigger value="registrations">التسجيلات</TabsTrigger>
        <TabsTrigger value="tools">أدوات الإصلاح</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-4 space-y-4">
        <AdminWorkshopForm
          initialData={workshop}
          onSubmit={handleWorkshopUpdate}
          onCancel={onClose}
        />
      </TabsContent>

      <TabsContent value="registrations" className="mt-4">
        <WorkshopRegistrationsList workshopId={workshop.id} />
      </TabsContent>
      
      <TabsContent value="tools" className="mt-4">
        <WorkshopRepairTool workshopId={workshop.id} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminWorkshopManagementPanel;
