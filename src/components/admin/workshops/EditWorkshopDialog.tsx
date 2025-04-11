
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <div className="p-6 pb-0">
          <DialogTitle>تعديل الورشة</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل الورشة.
          </DialogDescription>
        </div>
        <ScrollArea className="h-[calc(90vh-120px)] px-6 pb-6">
          <AdminWorkshopForm 
            initialData={workshop}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkshopDialog;
