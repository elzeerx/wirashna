
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopCard, { workshopToCardProps } from "@/components/WorkshopCard";
import { Search } from "lucide-react";
import { fetchWorkshops } from "@/services/workshopService";
import { Workshop } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error loading workshops:", error);
        toast({
          title: "خطأ في تحميل الورش",
          description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkshops();
  }, [toast]);
  
  const venues = [...new Set(workshops.map(workshop => workshop.venue))];
  
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workshop.short_description.toLowerCase().includes(searchTerm.toLowerCase());
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="wirashna-loader"></div>
            </div>
          ) : filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} {...workshopToCardProps(workshop)} />
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
