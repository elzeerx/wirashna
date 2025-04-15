
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Workshop } from "@/types/supabase";

export interface WorkshopCardProps {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    image: string;
  };
  price: number;
  image: string;
  status?: 'قريباً' | 'متاح';
}

const WorkshopCard = ({
  id,
  title,
  description,
  instructor,
  price,
  image,
  status = 'متاح'
}: WorkshopCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {status && (
          <Badge 
            className={`absolute top-4 right-4 ${
              status === 'قريباً' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          >
            {status}
          </Badge>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={instructor.image}
            alt={instructor.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium">{instructor.name}</h4>
            <p className="text-sm text-gray-600">{instructor.title}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {status === 'قريباً' ? (
              <span className="text-amber-500">قريباً</span>
            ) : (
              <span className="text-[#3B49DF] font-bold">{price} د.ك</span>
            )}
          </div>
          
          <Link to={`/workshops/${id}`}>
            <Button 
              variant="default"
              className={status === 'قريباً' ? 'bg-gray-500' : ''}
              disabled={status === 'قريباً'}
            >
              سجل الآن
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const workshopToCardProps = (workshop: Workshop): WorkshopCardProps => ({
  id: workshop.id,
  title: workshop.title,
  description: workshop.short_description,
  instructor: {
    name: workshop.instructor,
    title: "خبير في المجال",
    image: workshop.instructor_image || "/placeholder.svg"
  },
  price: workshop.price,
  image: workshop.cover_image || "/placeholder.svg",
  status: workshop.available_seats > 0 ? 'متاح' : 'قريباً'
});

export default WorkshopCard;
