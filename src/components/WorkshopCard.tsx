
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";

interface WorkshopCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  image: string;
}

const WorkshopCard = ({
  id,
  title,
  description,
  date,
  time,
  venue,
  availableSeats,
  image,
}: WorkshopCardProps) => {
  return (
    <div className="wirashna-card group overflow-hidden">
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={16} className="ml-2" />
        <span className="text-sm">{date} | {time}</span>
      </div>
      
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin size={16} className="ml-2" />
        <span className="text-sm">{venue}</span>
      </div>
      
      <div className="flex items-center text-gray-600 mb-4">
        <Users size={16} className="ml-2" />
        <span className="text-sm">{availableSeats} مقعد متبقي</span>
      </div>
      
      <Link to={`/workshops/${id}`} className="wirashna-btn-primary block text-center">
        سجل الآن
      </Link>
    </div>
  );
};

export default WorkshopCard;
