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
    <Link 
      to={`/workshops/${id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {status === 'قريباً' && (
          <Badge 
            className="absolute top-4 right-4 bg-amber-500"
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
          
          <Button 
            variant="default"
            className={status === 'قريباً' ? 'bg-gray-500 pointer-events-none' : ''}
            disabled={status === 'قريباً'}
            onClick={(e) => {
              e.preventDefault(); // Prevent card click when clicking the button
              if (status !== 'قريباً') {
                window.location.href = `/workshops/${id}`;
              }
            }}
          >
            سجل الآن
          </Button>
        </div>
      </div>
    </Link>
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
