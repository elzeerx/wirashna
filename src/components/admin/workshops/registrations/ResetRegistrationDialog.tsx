
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
import { AlertCircle } from "lucide-react";

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
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error resetting registration:", error);
      toast({
        title: "خطأ في إعادة ضبط التسجيل",
        description: "حدث خطأ أثناء إعادة ضبط التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            إعادة ضبط التسجيل
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right space-y-3">
            <p>
              هل أنت متأكد من رغبتك في إعادة ضبط تسجيل <strong>{registration.full_name}</strong>؟
            </p>
            <p className="font-medium">
              هذا سيؤدي إلى:
            </p>
            <ul className="list-disc list-inside rtl:pr-4 ltr:pl-4 space-y-1">
              <li>إلغاء التسجيل الحالي وتحويله إلى <strong>ملغي</strong></li>
              <li>تعيين حالة الدفع إلى <strong>فشل</strong></li>
              <li>السماح للمستخدم بالتسجيل مرة أخرى في الورشة</li>
              <li>استعادة المقعد إلى قائمة المقاعد المتاحة</li>
            </ul>
            <p className="text-amber-600 font-medium mt-3">
              هذا الإجراء لا يمكن التراجع عنه!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResetConfirmation}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري إعادة الضبط..." : "تأكيد إعادة الضبط"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetRegistrationDialog;
