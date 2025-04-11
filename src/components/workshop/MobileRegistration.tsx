
import { Card, CardContent } from "@/components/ui/card";
import RegistrationForm from "./RegistrationForm";

const MobileRegistration = () => {
  return (
    <div className="lg:hidden">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileRegistration;
