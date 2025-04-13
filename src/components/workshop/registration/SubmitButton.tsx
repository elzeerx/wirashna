
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  isSubmitting: boolean;
  isRetry: boolean;
};

const SubmitButton = ({ isSubmitting, isRetry }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full wirashna-btn-primary"
      disabled={isSubmitting}
    >
      {isSubmitting 
        ? "جاري التسجيل..." 
        : isRetry 
          ? "متابعة عملية الدفع" 
          : "تأكيد التسجيل"}
    </Button>
  );
};

export default SubmitButton;
