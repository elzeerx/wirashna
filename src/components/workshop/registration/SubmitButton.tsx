
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

type SubmitButtonProps = {
  isSubmitting: boolean;
  isRetry: boolean;
};

const SubmitButton = ({ isSubmitting, isRetry }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={isSubmitting}
    >
      <LockKeyhole className="w-4 h-4 ml-2" />
      {isSubmitting 
        ? "جاري التسجيل..." 
        : isRetry 
          ? "متابعة عملية الدفع" 
          : "إتمام الدفع الآمن"}
    </Button>
  );
};

export default SubmitButton;
