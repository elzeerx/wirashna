
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkshopDate } from "@/types/workshop";

type MobileRegistrationProps = {
  workshopId: string;
  dates: WorkshopDate[];
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string | number;
};

const MobileRegistration = ({
  workshopId,
  dates,
  venue,
  location,
  availableSeats,
  totalSeats,
  price
}: MobileRegistrationProps) => {
  const isSoldOut = availableSeats <= 0;
  const formattedPrice = typeof price === 'number' ? `${price.toFixed(2)} د.ك` : price;
  
  // Calculate number of unique days
  const uniqueDays = new Set(dates.map(date => date.date)).size;
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
              {dates.map((date, index) => (
                <Badge key={index} variant="secondary" className="block text-right mt-2">
                  {date.date} - {date.displayTime}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <MapPin size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">المكان</p>
              <p className="text-gray-600">{venue}</p>
              <p className="text-gray-600 text-sm">{location}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <Users size={18} className="ml-3 text-wirashna-accent" />
            <div>
              <p className="font-medium">المقاعد المتاحة</p>
              <p className={`text-gray-600 ${availableSeats <= 5 ? 'text-red-500 font-bold' : ''}`}>
                {availableSeats} / {totalSeats}
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="font-medium">السعر</p>
            <p className="text-lg font-bold text-wirashna-accent">{formattedPrice}</p>
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
