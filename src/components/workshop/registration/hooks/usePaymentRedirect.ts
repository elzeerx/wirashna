
import { UserDetails } from "@/types/payment";
import { createTapPayment } from "@/services/payment";

interface UsePaymentRedirectProps {
  workshopId: string;
  userId: string;
  price: number;
  isRetry: boolean;
}

export const usePaymentRedirect = ({ 
  workshopId, 
  userId, 
  price, 
  isRetry 
}: UsePaymentRedirectProps) => {
  const redirectToPayment = async (userDetails: UserDetails) => {
    console.log("Processing payment for amount:", price);
    const paymentResult = await createTapPayment(
      price,
      workshopId,
      userId,
      userDetails,
      isRetry
    );
    
    if (paymentResult.success && paymentResult.redirect_url) {
      console.log("Payment created successfully, redirecting to:", paymentResult.redirect_url);
      window.location.href = paymentResult.redirect_url;
      return true;
    }
    
    return false;
  };

  return { redirectToPayment };
};
