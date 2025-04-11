
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>تعديل الورشة</DialogTitle>
        <DialogDescription>
          قم بتعديل تفاصيل الورشة.
        </DialogDescription>
        <AdminWorkshopForm 
          initialData={workshop}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkshopDialog;
