
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkshopSidebarProps {
  date: string;
  time: string;
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string | number;
  workshopId: string;
}

const WorkshopSidebar = ({
  date,
  time,
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

  // تفاصيل الورشة دائمًا تأتي أولًا
  const workshopDetails = (
    <>
      <h3 className="text-xl font-bold mb-4">تفاصيل الورشة</h3>
      
      <div className="flex items-center mb-4">
        <Calendar size={18} className="ml-3 text-wirashna-accent" />
        <div>
          <p className="font-medium">التاريخ</p>
          <p className="text-gray-600">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <Clock size={18} className="ml-3 text-wirashna-accent" />
        <div>
          <p className="font-medium">الوقت</p>
          <p className="text-gray-600">{time}</p>
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
      
      <div className="mb-6">
        <p className="font-medium">السعر</p>
        <p className="text-lg font-bold text-wirashna-accent">{formattedPrice}</p>
      </div>
    </>
  );

  // قسم التسجيل دائمًا يأتي بعد تفاصيل الورشة
  const registrationSection = (
    <>
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
    </>
  );

  return (
    <div className="wirashna-card sticky top-24">
      {/* تفاصيل الورشة دائمًا تأتي أولًا */}
      {workshopDetails}
      
      {/* قسم التسجيل يظهر فقط في حالة الشاشة الكبيرة */}
      <div className={isMobile ? "hidden" : "block"}>
        {registrationSection}
      </div>
    </div>
  );
};

export default WorkshopSidebar;
