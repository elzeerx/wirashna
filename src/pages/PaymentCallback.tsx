
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyTapPayment } from "@/services/payment";
import { recalculateWorkshopSeats } from "@/services/workshops"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const PaymentCallback = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract tap_id and other params from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const tapId = queryParams.get("tap_id");
        const status = queryParams.get("status");
        const workshopIdParam = queryParams.get("workshop_id");
        
        if (workshopIdParam) {
          setWorkshopId(workshopIdParam);
        }

        if (!tapId) {
          setPaymentStatus("error");
          toast({
            title: "خطأ في التحقق من الدفع",
            description: "لم يتم العثور على معرف عملية الدفع",
            variant: "destructive",
          });
          return;
        }

        // If status is already provided and is CAPTURED, we can optimize flow
        if (status === "CAPTURED") {
          setPaymentStatus("success");
          
          // Still verify in the background to update the database
          const result = await verifyTapPayment(tapId);
          
          // Make sure seats are recalculated even if status is already known
          if (workshopIdParam) {
            try {
              await recalculateWorkshopSeats(workshopIdParam);
            } catch (error) {
              console.error("Error recalculating seats:", error);
            }
          }
          
          toast({
            title: "تمت عملية الدفع بنجاح",
            description: "تم تأكيد تسجيلك في الورشة",
          });
        } else {
          // Verify payment status with the backend - multiple attempts for reliability
          let maxAttempts = 2;
          let attempts = 0;
          let success = false;
          
          while (!success && attempts < maxAttempts) {
            attempts++;
            setVerificationAttempts(prev => prev + 1);
            console.log(`Verification attempt ${attempts} for payment ${tapId}`);
            
            // Add slight delay between attempts
            if (attempts > 1) {
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            const result = await verifyTapPayment(tapId);
            
            if (result.success) {
              success = true;
              if (result.status === "CAPTURED") {
                setPaymentStatus("success");
                
                // Ensure seats are recalculated
                if (workshopIdParam) {
                  try {
                    await recalculateWorkshopSeats(workshopIdParam);
                  } catch (error) {
                    console.error("Error recalculating seats:", error);
                  }
                }
                
                toast({
                  title: "تمت عملية الدفع بنجاح",
                  description: "تم تأكيد تسجيلك في الورشة",
                });
              } else {
                setPaymentStatus("failed");
                toast({
                  title: "فشلت عملية الدفع",
                  description: "لم يتم اكتمال عملية الدفع بنجاح",
                  variant: "destructive",
                });
              }
            } else if (attempts >= maxAttempts) {
              setPaymentStatus("error");
              toast({
                title: "خطأ في التحقق من الدفع",
                description: result.error || "حدث خطأ أثناء التحقق من حالة الدفع",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("error");
        toast({
          title: "خطأ في التحقق من الدفع",
          description: "حدث خطأ أثناء التحقق من حالة الدفع",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location, toast]);

  const handleRedirectToHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    if (workshopId) {
      navigate(`/workshop-registration?id=${workshopId}&retry=true`);
    } else {
      navigate("/workshops");
    }
  };

  const renderPaymentStatus = () => {
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
          <Button onClick={handleRedirectToHome} className="wirashna-btn-primary">
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
          <Button onClick={handleTryAgain} className="wirashna-btn-primary flex items-center gap-2">
            <RefreshCw size={18} />
            إعادة المحاولة
          </Button>
          <Button onClick={handleRedirectToHome} variant="outline">
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="wirashna-card p-8">
              {renderPaymentStatus()}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCallback;
