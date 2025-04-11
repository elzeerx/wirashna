
import { useState } from "react";
import WorkshopCard from "./WorkshopCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Mock workshop data
const workshops = [
  {
    id: "1",
    title: "الذكاء الاصطناعي للمبتدئين",
    description: "تعلم أساسيات الذكاء الاصطناعي وكيفية استخدامه في صناعة المحتوى بشكل عملي",
    date: "١٥ مايو ٢٠٢٥",
    time: "٥:٠٠ مساءًا",
    venue: "الكويت",
    availableSeats: 12,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: "2",
    title: "إنشاء محتوى إبداعي مع الذكاء الاصطناعي",
    description: "ورشة عمل متقدمة حول كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء محتوى متميز",
    date: "٢٠ مايو ٢٠٢٥",
    time: "٤:٠٠ مساءًا",
    venue: "دبي",
    availableSeats: 8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "3",
    title: "تصميم الجرافيك باستخدام الذكاء الاصطناعي",
    description: "تعلم كيفية إنشاء تصاميم جرافيك احترافية باستخدام أحدث أدوات الذكاء الاصطناعي",
    date: "٢٥ مايو ٢٠٢٥",
    time: "٦:٠٠ مساءًا",
    venue: "الرياض",
    availableSeats: 15,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: "4",
    title: "كتابة السيناريو المدعومة بالذكاء الاصطناعي",
    description: "اكتشف كيفية استخدام الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك",
    date: "٣٠ مايو ٢٠٢٥",
    time: "٥:٣٠ مساءًا",
    venue: "الدوحة",
    availableSeats: 10,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
  }
];

const WorkshopShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const workshopsPerPage = 3;
  const totalPages = Math.ceil(workshops.length / workshopsPerPage);
  
  const displayedWorkshops = workshops.slice(
    currentPage * workshopsPerPage,
    (currentPage + 1) * workshopsPerPage
  );
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="wirashna-section bg-wirashna-primary">
      <div className="wirashna-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">الورش القادمة</h2>
          
          <div className="flex space-x-2 space-x-reverse">
            <button 
              onClick={prevPage}
              className="p-2 rounded-full bg-wirashna-secondary hover:bg-wirashna-accent hover:text-white transition-colors"
              aria-label="Previous page"
            >
              <ArrowRight size={20} />
            </button>
            
            <button 
              onClick={nextPage}
              className="p-2 rounded-full bg-wirashna-secondary hover:bg-wirashna-accent hover:text-white transition-colors"
              aria-label="Next page"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} {...workshop} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkshopShowcase;
