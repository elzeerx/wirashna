
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <h1 className="text-3xl font-bold mb-8">عن ورشنا</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-gray-700 mb-4">
                ورشنا هي منصة متخصصة في تقديم ورش عمل حضورية في مجال صناعة المحتوى والذكاء الاصطناعي في الكويت ودول الخليج. تم تأسيس المنصة بهدف سد الفجوة بين التعليم النظري والتطبيق العملي، وتمكين المهتمين من اكتساب المهارات العملية التي يحتاجونها.
              </p>
              
              <p className="text-gray-700 mb-4">
                نؤمن بأن التعلم الحقيقي يأتي من التجربة المباشرة والتفاعل الشخصي، لذلك نركز على تقديم ورش عمل حصرية وجهاً لوجه، حيث يمكن للمشاركين التفاعل مع المدربين وزملائهم بشكل مباشر.
              </p>
              
              <p className="text-gray-700">
                تغطي ورشنا مجموعة واسعة من المواضيع، بما في ذلك استخدام تقنيات الذكاء الاصطناعي في إنشاء المحتوى، وكتابة السيناريو، وتصميم الجرافيك، وإنتاج الفيديو، وغيرها من المجالات الإبداعية.
              </p>
            </div>
            
            <div className="relative h-80 md:h-auto rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                alt="Workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="bg-wirashna-secondary p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold mb-6">رؤيتنا</h2>
            
            <p className="text-gray-700 mb-4">
              نطمح إلى أن نكون المنصة الرائدة في تقديم ورش العمل المتخصصة في مجال صناعة المحتوى والذكاء الاصطناعي في منطقة الخليج العربي، وأن نساهم في تطوير المهارات الإبداعية والتقنية للأفراد والمؤسسات في المنطقة.
            </p>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">انضم إلى إحدى ورشنا</h2>
            
            <Link to="/workshops" className="wirashna-btn-primary inline-flex items-center">
              <span>استعرض الورش المتاحة</span>
              <ArrowLeft size={18} className="mr-2" />
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
