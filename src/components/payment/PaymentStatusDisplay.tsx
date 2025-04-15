
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PaymentStatusDisplayProps {
  isVerifying: boolean;
  paymentStatus: string | null;
  verificationAttempts: number;
  workshopId: string | null;
  onRedirectToHome: () => void;
  onTryAgain: () => void;
}

const PaymentStatusDisplay = ({
  isVerifying,
  paymentStatus,
  verificationAttempts,
  workshopId,
  onRedirectToHome,
  onTryAgain
}: PaymentStatusDisplayProps) => {
  if (isVerifying) {
    return (
      <div className="text-center">
        <div className="wirashna-loader mx-auto mb-4"></div>
        <h2 className="text-xl font-bold mb-2">جاري التحقق من عملية الدفع</h2>
        <p className="text-gray-600 mb-8">
          يرجى الانتظار بينما نتحقق من حالة الدفع...
          {verificationAttempts > 0 && ` (محاولة ${verificationAttempts})`}
        </p>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">تمت عملية الدفع بنجاح</h2>
        <p className="text-gray-600 mb-8">
          تم تأكيد تسجيلك في الورشة بنجاح. شكراً لك!
        </p>
        <Button onClick={onRedirectToHome} className="wirashna-btn-primary">
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">
        {paymentStatus === "failed" ? "فشلت عملية الدفع" : "خطأ في التحقق من الدفع"}
      </h2>
      <p className="text-gray-600 mb-8">
        {paymentStatus === "failed"
          ? "لم تكتمل عملية الدفع بنجاح. يمكنك إعادة المحاولة بالضغط على الزر أدناه."
          : "حدث خطأ أثناء التحقق من حالة الدفع. يمكنك إعادة المحاولة."}
      </p>
      
      <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
        <AlertTitle className="font-bold text-amber-800">هام</AlertTitle>
        <AlertDescription>
          لن يتم خصم أي مبلغ من حسابك في حالة فشل العملية. يمكنك إعادة محاولة الدفع بأمان.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onTryAgain} className="wirashna-btn-primary flex items-center gap-2">
          <RefreshCw size={18} />
          إعادة المحاولة
        </Button>
        <Button onClick={onRedirectToHome} variant="outline">
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusDisplay;
