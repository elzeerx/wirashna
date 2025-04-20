import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { WorkshopDate } from "@/types/workshop";
import { Badge } from "@/components/ui/badge";
import { calculateDurationHours } from "@/utils/dateUtils";

interface WorkshopSidebarProps {
  dates: WorkshopDate[];
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string | number;
  workshopId: string;
}

const WorkshopSidebar = ({
  dates,
  venue,
  location,
  availableSeats,
  totalSeats,
  price,
  workshopId,
}: WorkshopSidebarProps) => {
  const isSoldOut = availableSeats <= 0;
  const formattedPrice = typeof price === 'number' ? `${price.toFixed(2)} د.ك` : price;
  const isMobile = useIsMobile();

  // Calculate number of unique days
  const uniqueDays = new Set(dates.map(date => date.date)).size;
  const workshopDuration = uniqueDays > 1 
    ? `${uniqueDays} أيام` 
    : "يوم واحد";

  return (
    <div className="wirashna-card sticky top-24 lg:block hidden">
      <h3 className="text-xl font-bold mb-4">تفاصيل الورشة</h3>
      
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Calendar size={18} className="mt-1 text-wirashna-accent" />
          <div>
            <p className="font-medium">المواعيد ({workshopDuration})</p>
            <div className="space-y-2 mt-2">
              {dates.map((date, index) => (
                <Badge key={index} variant="secondary" className="block text-right">
                  {date.date} - {date.displayTime}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-1 text-wirashna-accent" />
          <div>
            <p className="font-medium">المكان</p>
            <p className="text-gray-600">{venue}</p>
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Users size={18} className="mt-1 text-wirashna-accent" />
          <div>
            <p className="font-medium">المقاعد المتاحة</p>
            <p className={`text-gray-600 ${availableSeats <= 5 ? 'text-red-500 font-bold' : ''}`}>
              {availableSeats} / {totalSeats}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="font-medium">السعر</p>
          <p className="text-lg font-bold text-wirashna-accent">{formattedPrice}</p>
        </div>
      </div>
      
      {/* قسم التسجيل يظهر فقط في حالة الشاشة الكبيرة */}
      <div className={isMobile ? "hidden" : "block"}>
        <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
        {isSoldOut ? (
          <Button disabled className="w-full bg-gray-400">
            نفذت التذاكر
          </Button>
        ) : (
          <Button asChild className="w-full wirashna-btn-primary">
            <Link to={`/workshop-registration?id=${workshopId}`}>سجّل ��لآن</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkshopSidebar;
