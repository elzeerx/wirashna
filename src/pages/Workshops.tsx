
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopCard, { workshopToCardProps } from "@/components/WorkshopCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { fetchWorkshops } from "@/services/workshopService";
import { Workshop } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { EnhancedBentoGrid, EnhancedBentoCard } from "@/components/ui/enhanced-bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
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
  const categories = ["ذكاء اصطناعي", "تسويق رقمي", "إنتاج محتوى", "ورش مباشرة"];
  
  const getWorkshopCategory = (title: string) => {
    if (title.includes("ذكاء") || title.includes("AI") || title.includes("ChatGPT")) return "ذكاء اصطناعي";
    if (title.includes("تسويق") || title.includes("Marketing")) return "تسويق رقمي";
    if (title.includes("محتوى") || title.includes("Content")) return "إنتاج محتوى";
    return "ورش مباشرة";
  };
  
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          workshop.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = selectedVenue === "" || workshop.venue === selectedVenue;
    const matchesCategory = selectedCategory === "" || getWorkshopCategory(workshop.title) === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange) {
      const price = workshop.price;
      switch (priceRange) {
        case "free":
          matchesPrice = price === 0;
          break;
        case "low":
          matchesPrice = price > 0 && price <= 50;
          break;
        case "medium":
          matchesPrice = price > 50 && price <= 150;
          break;
        case "high":
          matchesPrice = price > 150;
          break;
      }
    }
    
    return matchesSearch && matchesVenue && matchesCategory && matchesPrice;
  });

  const workshopStats = {
    total: workshops.length,
    ai: workshops.filter(w => getWorkshopCategory(w.title) === "ذكاء اصطناعي").length,
    marketing: workshops.filter(w => getWorkshopCategory(w.title) === "تسويق رقمي").length,
    content: workshops.filter(w => getWorkshopCategory(w.title) === "إنتاج محتوى").length,
    live: workshops.filter(w => getWorkshopCategory(w.title) === "ورش مباشرة").length,
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedVenue("");
    setSelectedCategory("");
    setPriceRange("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">استكشف ورش العمل</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف مجموعة متنوعة من ورش العمل التفاعلية في التسويق الرقمي والذكاء الاصطناعي
            </p>
          </div>

          {/* Statistics Cards */}
          <EnhancedBentoGrid variant="workshop" className="mb-8">
            <EnhancedBentoCard size="small" gradient="ai" interactive>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{workshopStats.ai}</div>
                <div className="text-sm font-medium">ورش الذكاء الاصطناعي</div>
              </div>
            </EnhancedBentoCard>
            
            <EnhancedBentoCard size="small" gradient="marketing" interactive>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{workshopStats.marketing}</div>
                <div className="text-sm font-medium">التسويق الرقمي</div>
              </div>
            </EnhancedBentoCard>
            
            <EnhancedBentoCard size="small" gradient="content" interactive>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{workshopStats.content}</div>
                <div className="text-sm font-medium">إنتاج المحتوى</div>
              </div>
            </EnhancedBentoCard>
            
            <EnhancedBentoCard size="small" gradient="live" interactive>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{workshopStats.live}</div>
                <div className="text-sm font-medium">ورش مباشرة</div>
              </div>
            </EnhancedBentoCard>
          </EnhancedBentoGrid>
          
          {/* Advanced Filters */}
          <EnhancedBentoCard size="featured" gradient="default" className="mb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-wirashna-accent" />
                <h3 className="text-lg font-semibold">فلترة متقدمة</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="ابحث عن ورشة عمل..."
                    className="w-full py-3 px-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                >
                  <option value="">جميع المواقع</option>
                  {venues.map((venue, index) => (
                    <option key={index} value={venue}>{venue}</option>
                  ))}
                </select>
                
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">جميع الفئات</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                
                <select 
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">جميع الأسعار</option>
                  <option value="free">مجاني</option>
                  <option value="low">1-50 د.ك</option>
                  <option value="medium">51-150 د.ك</option>
                  <option value="high">150+ د.ك</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && <Badge variant="secondary">البحث: {searchTerm}</Badge>}
                  {selectedVenue && <Badge variant="secondary">الموقع: {selectedVenue}</Badge>}
                  {selectedCategory && <Badge variant="secondary">الفئة: {selectedCategory}</Badge>}
                  {priceRange && <Badge variant="secondary">السعر: {priceRange}</Badge>}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="w-4 h-4 ml-2" />
                    إعادة ضبط
                  </Button>
                  <Badge variant="default" className="bg-wirashna-accent">
                    {filteredWorkshops.length} ورشة
                  </Badge>
                </div>
              </div>
            </div>
          </EnhancedBentoCard>
          
          {/* Workshops Grid */}
          {isLoading ? (
            <EnhancedBentoGrid variant="workshop">
              {[...Array(6)].map((_, index) => (
                <EnhancedBentoCard key={index} size="medium" loading={true} />
              ))}
            </EnhancedBentoGrid>
          ) : filteredWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} {...workshopToCardProps(workshop)} />
              ))}
            </div>
          ) : (
            <EnhancedBentoCard size="featured" gradient="default" className="text-center">
              <div className="py-12">
                <h3 className="text-xl font-semibold mb-2">لا توجد ورش مطابقة</h3>
                <p className="text-gray-600 mb-4">لا توجد ورش عمل تطابق معايير البحث الخاصة بك.</p>
                <Button onClick={clearFilters} variant="outline">
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            </EnhancedBentoCard>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Workshops;
