
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopCard from "@/components/WorkshopCard";
import { Search } from "lucide-react";

// Mock workshop data - same as in WorkshopShowcase
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

const Workshops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  
  const venues = [...new Set(workshops.map(workshop => workshop.venue))];
  
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = selectedVenue === "" || workshop.venue === selectedVenue;
    
    return matchesSearch && matchesVenue;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <h1 className="text-3xl font-bold mb-8">استعرض الورش</h1>
          
          <div className="bg-wirashna-secondary p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="ابحث عن ورشة عمل..."
                  className="w-full py-2 px-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                >
                  <option value="">جميع المواقع</option>
                  {venues.map((venue, index) => (
                    <option key={index} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="wirashna-btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedVenue("");
                }}
              >
                إعادة تعيين الفلتر
              </button>
            </div>
          </div>
          
          {filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} {...workshop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">لا توجد ورش عمل تطابق معايير البحث الخاصة بك.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workshops;
