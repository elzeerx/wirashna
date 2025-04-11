
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workshop } from "@/types/supabase";

interface DeleteWorkshopDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: Workshop | null;
  onDelete: () => void;
}

const DeleteWorkshopDialog = ({ isOpen, onOpenChange, workshop, onDelete }: DeleteWorkshopDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>حذف الورشة</DialogTitle>
        <DialogDescription>
          هل أنت متأكد من أنك تريد حذف الورشة "{workshop?.title}"؟
          <br />
          لا يمكن التراجع عن هذا الإجراء.
        </DialogDescription>
        <div className="flex justify-end space-x-2 space-x-reverse mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            تأكيد الحذف
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorkshopDialog;
