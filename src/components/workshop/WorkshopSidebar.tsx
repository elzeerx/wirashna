
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import RegistrationForm from "./RegistrationForm";

interface WorkshopSidebarProps {
  date: string;
  time: string;
  venue: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: string;
}

const WorkshopSidebar = ({
  date,
  time,
  venue,
  location,
  availableSeats,
  totalSeats,
  price,
}: WorkshopSidebarProps) => {
  return (
    <div className="wirashna-card sticky top-24">
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
          <p className="text-gray-600">
            {availableSeats} / {totalSeats}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="font-medium">السعر</p>
        <p className="text-lg font-bold text-wirashna-accent">{price}</p>
      </div>
      
      <div className="hidden lg:block">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default WorkshopSidebar;
