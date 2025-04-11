
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
import WorkshopMaterialsManager from "@/components/admin/workshops/WorkshopMaterialsManager";
import { Workshop } from "@/types/supabase";

interface EditWorkshopDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: Workshop | null;
  onSubmit: (data: any) => void;
}

const EditWorkshopDialog = ({ isOpen, onOpenChange, workshop, onSubmit }: EditWorkshopDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <div className="p-6 pb-0">
          <DialogTitle>تعديل الورشة</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل الورشة وإدارة المواد التعليمية.
          </DialogDescription>
        </div>
        
        <Tabs defaultValue="details" className="mt-4">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">تفاصيل الورشة</TabsTrigger>
              <TabsTrigger value="materials">المواد التعليمية</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details">
            <ScrollArea className="h-[calc(90vh-170px)] px-6 pb-6">
              <AdminWorkshopForm 
                initialData={workshop}
                onSubmit={onSubmit}
                onCancel={() => onOpenChange(false)}
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="materials">
            <ScrollArea className="h-[calc(90vh-170px)] px-6 pb-6">
              {workshop && (
                <WorkshopMaterialsManager workshopId={workshop.id} />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkshopDialog;
