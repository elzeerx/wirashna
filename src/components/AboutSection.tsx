
import { BookOpen, Users, Award, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="wirashna-section bg-wirashna-secondary">
      <div className="wirashna-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">لماذا ورشنا؟</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نقدم ورش عمل عملية وحصرية تركز على التطبيق العملي والتدريب المباشر في مجالات صناعة المحتوى والذكاء الاصطناعي
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm border border-wirashna-secondary">
            <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full mb-4">
              <BookOpen size={24} className="text-wirashna-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">تعلم عملي</h3>
            <p className="text-gray-600">
              نركز على الجانب العملي والتطبيقي أكثر من النظري، مما يضمن اكتساب المهارات بشكل فعال وسريع
            </p>
          </div>
          
          <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm border border-wirashna-secondary">
            <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full mb-4">
              <Users size={24} className="text-wirashna-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">مدربون محترفون</h3>
            <p className="text-gray-600">
              يقدم الورش نخبة من المدربين المحترفين ذوي الخبرة العملية في مجالات صناعة المحتوى والذكاء الاصطناعي
            </p>
          </div>
          
          <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm border border-wirashna-secondary">
            <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full mb-4">
              <Award size={24} className="text-wirashna-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">مجموعات صغيرة</h3>
            <p className="text-gray-600">
              نحرص على أن تكون المجموعات صغيرة لضمان التفاعل الأمثل والاستفادة القصوى لكل مشارك
            </p>
          </div>
          
          <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-sm border border-wirashna-secondary">
            <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full mb-4">
              <Clock size={24} className="text-wirashna-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">محتوى محدث باستمرار</h3>
            <p className="text-gray-600">
              نواكب أحدث التطورات في مجال الذكاء الاصطناعي وصناعة المحتوى، ونحدث محتوى ورشنا باستمرار
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
