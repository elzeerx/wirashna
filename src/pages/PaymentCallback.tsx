
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import PaymentStatusDisplay from "@/components/payment/PaymentStatusDisplay";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tapId = queryParams.get("tap_id");
  const status = queryParams.get("status");
  const workshopId = queryParams.get("workshop_id");

  const { isVerifying, paymentStatus, verificationAttempts } = usePaymentVerification({
    tapId,
    status,
    workshopId
  });

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

  return (
    <MainLayout>
      <div className="wirashna-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="wirashna-card p-8">
            <PaymentStatusDisplay
              isVerifying={isVerifying}
              paymentStatus={paymentStatus}
              verificationAttempts={verificationAttempts}
              workshopId={workshopId}
              onRedirectToHome={handleRedirectToHome}
              onTryAgain={handleTryAgain}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentCallback;
