
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type MobileRegistrationProps = {
  workshopId: string;
};

const MobileRegistration = ({ workshopId }: MobileRegistrationProps) => {
  return (
    <div className="lg:hidden">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
          <Button asChild className="w-full wirashna-btn-primary">
            <Link to={`/workshop-registration?id=${workshopId}`}>سجّل الآن</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileRegistration;
