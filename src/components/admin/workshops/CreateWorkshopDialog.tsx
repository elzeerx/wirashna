
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AdminWorkshopForm from "@/components/admin/AdminWorkshopForm";

interface CreateWorkshopDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const CreateWorkshopDialog = ({ isOpen, onOpenChange, onSubmit }: CreateWorkshopDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>إضافة ورشة جديدة</DialogTitle>
        <DialogDescription>
          أدخل تفاصيل الورشة الجديدة.
        </DialogDescription>
        <AdminWorkshopForm 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkshopDialog;
