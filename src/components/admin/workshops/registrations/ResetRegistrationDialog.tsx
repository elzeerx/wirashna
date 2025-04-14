
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

interface ResetRegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  registration: WorkshopRegistration | null;
  onReset: () => Promise<boolean>;
}

const ResetRegistrationDialog = ({
  isOpen,
  onOpenChange,
  registration,
  onReset
}: ResetRegistrationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Reset submission state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleResetConfirmation = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!registration || isSubmitting) return false;
    
    setIsSubmitting(true);
    try {
      const success = await onReset();
      if (success) {
        // Let the parent component control dialog state
        return success;
      }
      return false;
    } catch (error) {
      console.error("Error in reset confirmation:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة ضبط التسجيل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>إعادة ضبط التسجيل</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء سيقوم بتغيير حالة تسجيل المشارك إلى "ملغي" وحالة الدفع إلى "فشل"، مما يسمح له بإعادة التسجيل في الورشة مرة أخرى.
            هل أنت متأكد من المتابعة؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleResetConfirmation}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري إعادة الضبط..." : "تأكيد"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetRegistrationDialog;
