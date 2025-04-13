
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyTapPayment } from "@/services/payment";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentCallback = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
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

        // If status is already provided and is CAPTURED, we can use it directly
        if (status === "CAPTURED") {
          setPaymentStatus("success");
          toast({
            title: "تمت عملية الدفع بنجاح",
            description: "تم تأكيد تسجيلك في الورشة",
          });
        } else {
          // Verify payment status with the backend
          const result = await verifyTapPayment(tapId);
          
          if (result.success) {
            if (result.status === "CAPTURED") {
              setPaymentStatus("success");
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
          } else {
            setPaymentStatus("error");
            toast({
              title: "خطأ في التحقق من الدفع",
              description: result.error || "حدث خطأ أثناء التحقق من حالة الدفع",
              variant: "destructive",
            });
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
          <p className="text-gray-600 mb-8">يرجى الانتظار بينما نتحقق من حالة الدفع...</p>
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
