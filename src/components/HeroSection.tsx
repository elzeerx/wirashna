
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative h-[80vh] min-h-[500px] w-full mt-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
          alt="Workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="wirashna-container relative h-full flex flex-col justify-center items-start">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            اكتشف قوة التدريب العملي وجهًا لوجه
          </h1>
          
          <p className="text-lg md:text-xl text-white opacity-90 mb-8">
            ورش عمل متخصصة لصناعة المحتوى والذكاء الاصطناعي في الكويت والخليج
          </p>
          
          <Link 
            to="/workshops" 
            className="wirashna-btn-primary flex items-center justify-center w-full md:w-auto"
          >
            <span>استعرض الورش</span>
            <ArrowRight size={18} className="mr-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
