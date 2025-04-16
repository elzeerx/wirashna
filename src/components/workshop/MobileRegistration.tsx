import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWorkshopById } from "@/services/workshops";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MobileRegistrationProps = {
  workshopId: string;
};

const MobileRegistration = ({ workshopId }: MobileRegistrationProps) => {
  const [workshop, setWorkshop] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        const workshopData = await fetchWorkshopById(workshopId);
        if (workshopData) {
          setWorkshop(workshopData);
        }
      } catch (error) {
        console.error("Error fetching workshop details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkshopDetails();
  }, [workshopId]);
  
  const isSoldOut = workshop?.available_seats !== null && workshop?.available_seats <= 0;

  if (!isMobile || isLoading || !workshop) {
    return null;
  }

  const uniqueDays = workshop.dates 
    ? new Set(workshop.dates.map((d: any) => d.date)).size
    : 1;
    
  const workshopDuration = uniqueDays > 1 
    ? `${uniqueDays} أيام` 
    : "يوم واحد";

  return (
    <div className="lg:hidden">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">تفاصيل الورشة</h3>
          
          <div className="flex items-center mb-4">
            <Calendar size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">المواعيد ({workshopDuration})</p>
              {workshop.dates?.map((date: any, index: number) => (
                <Badge key={index} variant="secondary" className="block text-right mt-2">
                  {date.date} - {date.displayTime}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <Clock size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">الوقت</p>
              <p className="text-gray-600">{workshop.time}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <MapPin size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">المكان</p>
              <p className="text-gray-600">{workshop.venue}</p>
              <p className="text-gray-600 text-sm">{workshop.location}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <Users size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">المقاعد المتاحة</p>
              <p className={`text-gray-600 ${workshop.available_seats <= 5 ? 'text-red-500 font-bold' : ''}`}>
                {workshop.available_seats} / {workshop.total_seats}
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="font-medium">السعر</p>
            <p className="text-lg font-bold text-wirashna-accent">
              {typeof workshop.price === 'number' ? `${workshop.price.toFixed(2)} د.ك` : workshop.price}
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
          {isSoldOut ? (
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
