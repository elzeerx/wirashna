
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, Users, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock workshop data
const workshops = [
  {
    id: "1",
    title: "الذكاء الاصطناعي للمبتدئين",
    description: "تعلم أساسيات الذكاء الاصطناعي وكيفية استخدامه في صناعة المحتوى بشكل عملي",
    longDescription: "تهدف هذه الورشة إلى تقديم المفاهيم الأساسية للذكاء الاصطناعي وتطبيقاته في مجال صناعة المحتوى. ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي المختلفة لتعزيز إنتاجية العمل الإبداعي، وكيفية الاستفادة من هذه التقنيات في تطوير محتوى متميز. الورشة مصممة للمبتدئين ولا تتطلب أي خبرة سابقة في مجال الذكاء الاصطناعي.",
    date: "١٥ مايو ٢٠٢٥",
    time: "٥:٠٠ مساءًا",
    venue: "الكويت",
    location: "فندق الشيراتون، قاعة الفردوس، الطابق الثاني",
    availableSeats: 12,
    totalSeats: 20,
    price: "١٢٠ دينار كويتي",
    instructor: "أحمد الشمري",
    instructorBio: "خبير في مجال الذكاء الاصطناعي وتطبيقاته في صناعة المحتوى، عمل في العديد من الشركات العالمية وقدم أكثر من ٥٠ ورشة عمل في مختلف دول الخليج.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    gallery: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    ]
  },
  {
    id: "2",
    title: "إنشاء محتوى إبداعي مع الذكاء الاصطناعي",
    description: "ورشة عمل متقدمة حول كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء محتوى متميز",
    longDescription: "ورشة عمل متقدمة تركز على كيفية استخدام أدوات الذكاء الاصطناعي المختلفة لإنشاء محتوى إبداعي متميز. ستتعلم كيفية استخدام تقنيات الذكاء الاصطناعي في كتابة النصوص، وإنشاء الصور، وتحرير الفيديو. هذه الورشة مخصصة للأشخاص الذين لديهم معرفة أساسية بالذكاء الاصطناعي ويرغبون في تطوير مهاراتهم في استخدامه لإنشاء محتوى إبداعي.",
    date: "٢٠ مايو ٢٠٢٥",
    time: "٤:٠٠ مساءًا",
    venue: "دبي",
    location: "فندق العنوان، قاعة المجلس، الطابق الأول",
    availableSeats: 8,
    totalSeats: 15,
    price: "٥٠٠ درهم إماراتي",
    instructor: "سارة العتيبي",
    instructorBio: "خبيرة في مجال صناعة المحتوى الرقمي وتطبيقات الذكاء الاصطناعي، قدمت العديد من الورش التدريبية في مختلف دول الخليج وشمال أفريقيا.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    ]
  },
  {
    id: "3",
    title: "تصميم الجرافيك باستخدام الذكاء الاصطناعي",
    description: "تعلم كيفية إنشاء تصاميم جرافيك احترافية باستخدام أحدث أدوات الذكاء الاصطناعي",
    longDescription: "في هذه الورشة، ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء تصاميم جرافيك احترافية. سنغطي كيفية استخدام أدوات مثل DALL-E وMidjourney لإنشاء صور وتصاميم مبتكرة، وكيفية تحرير هذه التصاميم باستخدام برامج تحرير الصور. هذه الورشة مناسبة للمصممين والمبدعين الذين يرغبون في تعزيز مهاراتهم باستخدام الذكاء الاصطناعي.",
    date: "٢٥ مايو ٢٠٢٥",
    time: "٦:٠٠ مساءًا",
    venue: "الرياض",
    location: "فندق الفيصلية، قاعة المؤتمرات، الطابق الثالث",
    availableSeats: 15,
    totalSeats: 25,
    price: "٥٠٠ ريال سعودي",
    instructor: "محمد القحطاني",
    instructorBio: "مصمم جرافيك محترف مع خبرة أكثر من ١٠ سنوات في مجال التصميم، متخصص في استخدام تقنيات الذكاء الاصطناعي في التصميم الجرافيكي.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    gallery: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    ]
  },
  {
    id: "4",
    title: "كتابة السيناريو المدعومة بالذكاء الاصطناعي",
    description: "اكتشف كيفية استخدام الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك",
    longDescription: "في هذه الورشة، ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك. سنستكشف كيفية استخدام نماذج اللغة المتقدمة لتوليد أفكار للقصص، وتطوير الشخصيات، وكتابة الحوار. ستتعلم أيضًا كيفية تحرير وتنقيح النصوص التي تم إنشاؤها بواسطة الذكاء الاصطناعي لجعلها أكثر إبداعًا وأصالة.",
    date: "٣٠ مايو ٢٠٢٥",
    time: "٥:٣٠ مساءًا",
    venue: "الدوحة",
    location: "مركز قطر للمؤتمرات، قاعة اللؤلؤة، الطابق الثاني",
    availableSeats: 10,
    totalSeats: 20,
    price: "٤٠٠ ريال قطري",
    instructor: "فاطمة الكواري",
    instructorBio: "كاتبة سيناريو وروائية، لديها خبرة واسعة في مجال الكتابة الإبداعية واستخدام تقنيات الذكاء الاصطناعي في تطوير المحتوى.",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    gallery: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    ]
  }
];

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const workshop = workshops.find(w => w.id === id);
  
  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">الورشة غير موجودة</h1>
            <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على الورشة المطلوبة.</p>
            <Link to="/workshops" className="wirashna-btn-primary inline-flex items-center">
              <ArrowRight size={18} className="ml-2" />
              <span>العودة إلى الورش</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="mb-8">
            <Link to="/workshops" className="inline-flex items-center text-wirashna-accent hover:underline">
              <ArrowRight size={18} className="ml-2" />
              <span>العودة إلى الورش</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
              
              <div className="relative h-72 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={workshop.image} 
                  alt={workshop.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {workshop.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="h-24 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-wirashna-accent transition-colors"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">وصف الورشة</h2>
                <p className="text-gray-700 leading-relaxed">{workshop.longDescription}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">المدرب</h2>
                <div className="bg-wirashna-secondary p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">{workshop.instructor}</h3>
                  <p className="text-gray-700">{workshop.instructorBio}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="wirashna-card sticky top-24">
                <h3 className="text-xl font-bold mb-4">تفاصيل الورشة</h3>
                
                <div className="flex items-center mb-4">
                  <Calendar size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">التاريخ</p>
                    <p className="text-gray-600">{workshop.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">الوقت</p>
                    <p className="text-gray-600">{workshop.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <MapPin size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">المكان</p>
                    <p className="text-gray-600">{workshop.venue}</p>
                    <p className="text-gray-600 text-sm">{workshop.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <Users size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">المقاعد المتاحة</p>
                    <p className="text-gray-600">
                      {workshop.availableSeats} / {workshop.totalSeats}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="font-medium">السعر</p>
                  <p className="text-lg font-bold text-wirashna-accent">{workshop.price}</p>
                </div>
                
                <button className="wirashna-btn-primary w-full">
                  سجل الآن
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
              <img 
                src={selectedImage} 
                alt="Workshop image" 
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
