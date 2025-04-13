
import { useAuth } from "@/contexts/AuthContext";
import { 
  UserDetailsForm, 
  PaymentSection, 
  TermsDisclaimer, 
  SubmitButton,
  useRegistrationSubmit 
} from './registration';

type RegistrationFormProps = {
  compact?: boolean;
  workshopId?: string;
  userEmail?: string;
  workshopPrice?: number;
  isRetry?: boolean;
};

const RegistrationForm = ({ 
  compact = false, 
  workshopId, 
  userEmail = "", 
  workshopPrice = 0,
  isRetry = false
}: RegistrationFormProps) => {
  const { user } = useAuth();
  const { isSubmitting, handleSubmit } = useRegistrationSubmit({
    workshopId,
    workshopPrice,
    isRetry
  });
  
  // Prepare default form values
  const defaultValues = {
    fullName: user?.user_metadata?.full_name || "",
    email: userEmail,
    phone: "",
  };

  const submitButton = (
    <>
      <PaymentSection workshopPrice={workshopPrice} />
      
      <SubmitButton isSubmitting={isSubmitting} isRetry={isRetry} />
      
      <TermsDisclaimer />
    </>
  );

  return (
    <>
      {!compact && <h3 className="text-xl font-bold mb-4">{isRetry ? "إكمال عملية الدفع" : "سجل في الورشة"}</h3>}
      
      <UserDetailsForm
        defaultValues={defaultValues}
        readOnlyEmail={!!userEmail}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonContent={submitButton}
      />
    </>
  );
};

export default RegistrationForm;
