
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Workshop } from "@/types/supabase";

export interface WorkshopCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  image: string;
}

// This component receives props in a different format than the Supabase Workshop type
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
  // Default image fallback if no image is provided
  const imageUrl = image && typeof image === 'string' && image !== '{}' && !image.includes('{}')
    ? image 
    : "https://images.unsplash.com/photo-1519389950473-47ba0277781c";
  
  return (
    <div className="wirashna-card group overflow-hidden flex flex-col h-full">
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <img
          src={imageUrl}
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
      
      <div className="mt-auto">
        <Link to={`/workshops/${id}`} className="wirashna-btn-primary block text-center">
          سجل الآن
        </Link>
      </div>
    </div>
  );
};

// Helper to convert from Supabase Workshop type to WorkshopCardProps
export const workshopToCardProps = (workshop: Workshop): WorkshopCardProps => {
  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.short_description,
    date: workshop.date,
    time: workshop.time,
    venue: workshop.venue,
    availableSeats: workshop.available_seats,
    image: workshop.cover_image && typeof workshop.cover_image === 'string' && workshop.cover_image !== '{}'
      ? workshop.cover_image 
      : "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  };
};

export default WorkshopCard;
