
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWorkshopById } from "@/services/workshopService";
import { useIsMobile } from "@/hooks/use-mobile";

type MobileRegistrationProps = {
  workshopId: string;
};

const MobileRegistration = ({ workshopId }: MobileRegistrationProps) => {
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const workshop = await fetchWorkshopById(workshopId);
        if (workshop) {
          setAvailableSeats(workshop.available_seats);
        }
      } catch (error) {
        console.error("Error fetching workshop availability:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAvailability();
  }, [workshopId]);
  
  const isSoldOut = availableSeats !== null && availableSeats <= 0;

  if (!isMobile) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
          {isLoading ? (
            <Button disabled className="w-full bg-gray-300">
              جاري التحميل...
            </Button>
          ) : isSoldOut ? (
            <Button disabled className="w-full bg-gray-400">
              نفذت التذاكر
            </Button>
          ) : (
            <Button asChild className="w-full wirashna-btn-primary">
              <Link to={`/workshop-registration?id=${workshopId}`}>سجّل الآن</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileRegistration;
