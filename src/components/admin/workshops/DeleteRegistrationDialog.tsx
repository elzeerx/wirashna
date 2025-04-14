
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

interface DeleteRegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  registration: WorkshopRegistration | null;
  onDelete: () => Promise<boolean>;
}

const DeleteRegistrationDialog = ({
  isOpen,
  onOpenChange,
  registration,
  onDelete
}: DeleteRegistrationDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!registration || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف التسجيل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!registration) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد حذف التسجيل</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد من رغبتك في حذف تسجيل {registration.full_name}؟ 
            هذه العملية لا يمكن التراجع عنها وستؤدي إلى حذف كافة بيانات التسجيل من النظام.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "جاري الحذف..." : "حذف التسجيل"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRegistrationDialog;
