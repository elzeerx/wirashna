
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Target, UserRound, Award, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopGallery from "@/components/workshop/WorkshopGallery";
import WorkshopSidebar from "@/components/workshop/WorkshopSidebar";
import CollapsibleSection from "@/components/workshop/CollapsibleSection";
import InstructorCard from "@/components/workshop/InstructorCard";
import RelatedWorkshops from "@/components/workshop/RelatedWorkshops";
import MobileRegistration from "@/components/workshop/MobileRegistration";

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
    ],
    schedule: [
      { time: "٥:٠٠ - ٥:٣٠", activity: "تسجيل الحضور والترحيب" },
      { time: "٥:٣٠ - ٦:٣٠", activity: "مقدمة عن الذكاء الاصطناعي وتطبيقاته" },
      { time: "٦:٣٠ - ٧:٠٠", activity: "استراحة" },
      { time: "٧:٠٠ - ٨:٣٠", activity: "تطبيقات عملية على استخدام أدوات الذكاء الاصطناعي" },
      { time: "٨:٣٠ - ٩:٠٠", activity: "أسئلة ونقاش" }
    ],
    requirements: [
      "جهاز كمبيوتر محمول",
      "اتصال بالإنترنت",
      "حساب على منصات الذكاء الاصطناعي المجانية (سيتم تزويدكم بالتفاصيل قبل الورشة)"
    ],
    benefits: [
      "فهم أساسيات الذكاء الاصطناعي وتطبيقاته",
      "التعرف على أحدث التقنيات والأدوات في المجال",
      "تطبيق عملي للمهارات المكتسبة",
      "شهادة حضور معتمدة",
      "فرصة للتواصل مع المهتمين والخبراء في المجال"
    ]
  },
  {
    id: "2",
    title: "إنشاء محتوى إبداعي مع الذكاء الاصطناعي",
    description: "ورشة عمل متقدمة حول كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء محتوى متميز",
    longDescription: "ورشة عمل متقدمة تركز على كيفية استخدام أدوات الذكاء الاصطناعي المختلفة لإنشاء محتوى إبداعي متميز. ستتعلم كيفية استخدام تقنيات الذكاء الاصطناعي في كتابة النصوص، وإنشاء الصور، وتحرير الفيديو. هذه الورشة مخصصة للأشخاص الذين لديهم معرفة أساسية بالذكاء الاصطناعي ويرغبون في تطوير مهاراتهم في استخدامه لإنشاء محتوى إبداعي.",
    date: "٢٠ مايو ٢٠٢٤",
    time: "٣:٠٠ مساءًا",
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
    date: "٢٥ مايو ٢٠٢٤",
    time: "٥:٠٠ مساءًا",
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
    longDescription: "في هذه الورشة، ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك. س����ستكشف كيفية استخدام نماذج اللغة المتقدمة لتوليد أفكار للقصص، وتطوير الشخصيات، وكتابة الحوار. ستتعلم أيضًا كيفية تحرير وتنقيح النصوص التي تم إنشاؤها بواسطة الذكاء الاصطناعي لجعلها أكثر إبداعًا وأصالة.",
    date: "٣٠ مايو ٢٠٢٤",
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
  const navigate = useNavigate();
  
  const workshop = workshops.find(w => w.id === id);
  
  const relatedWorkshops = workshop 
    ? workshops
        .filter(w => w.id !== workshop.id)
        .filter(w => w.venue === workshop.venue || Math.random() > 0.5)
        .slice(0, 3)
    : [];
  
  // Mock data for our new sections
  const workshopObjectives = [
    "فهم الأساسيات والمفاهيم الرئيسية للذكاء الاصطناعي",
    "تعلم كيفية استخدام أدوات الذكاء الاصطناعي في العمل اليومي",
    "اكتساب مهارات تطبيقية في مجال صناعة المحتوى باستخدام الذكاء الاصطناعي",
    "التعرف على أحدث التقنيات والاتجاهات في مجال الذكاء الاصطناعي"
  ];
  
  const targetAudience = [
    "المسوقين الرقميين الذين يرغبون في تحسين استراتيجيات المحتوى",
    "أصحاب الأعمال الصغيرة الذين يسعون لزيادة كفاءة أعمالهم",
    "المصممين والمبدعين الباحثين عن أدوات جديدة لتعزيز إبداعاتهم",
    "المهتمين بالتكنولوجيا والراغبين في استكشاف فرص الذكاء الاصطناعي"
  ];
  
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
              
              <WorkshopGallery 
                mainImage={workshop.image} 
                gallery={workshop.gallery} 
                title={workshop.title} 
              />
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">وصف الورشة</h2>
                <p className="text-gray-700 leading-relaxed">{workshop.longDescription}</p>
              </div>

              <CollapsibleSection 
                title="أهداف الورشة"
                items={workshopObjectives}
                icon={<Target size={20} />}
              />

              <CollapsibleSection 
                title="لمن تناسب الورشة"
                items={targetAudience}
                icon={<UserRound size={20} />}
              />

              <CollapsibleSection 
                title="متطلبات الورشة"
                items={workshop.requirements || []}
                icon={<BookOpen size={20} />}
              />

              <CollapsibleSection 
                title="مميزات الورشة"
                items={workshop.benefits || []}
                icon={<Award size={20} />}
              />
              
              <InstructorCard 
                name={workshop.instructor} 
                bio={workshop.instructorBio} 
              />

              <MobileRegistration />
            </div>
            
            <div className="lg:col-span-1">
              <WorkshopSidebar 
                date={workshop.date}
                time={workshop.time}
                venue={workshop.venue}
                location={workshop.location}
                availableSeats={workshop.availableSeats}
                totalSeats={workshop.totalSeats}
                price={workshop.price}
              />
            </div>
          </div>

          <RelatedWorkshops workshops={relatedWorkshops} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
