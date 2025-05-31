
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BentoCard } from "./ui/bento-grid";
import { Play, Users, Award, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-[700px] bg-gradient-to-br from-[#3B49DF] via-[#512b81] to-[#2D3BBA] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="wirashna-container relative min-h-[700px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">خبير معتمد في التسويق الرقمي والذكاء الاصطناعي</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                تعلم مع
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  إلزير
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                <span className="font-semibold">15+ سنة</span> من الخبرة في التسويق الرقمي والذكاء الاصطناعي
                <br />
                مؤسس Recipe Group ومدرب أكثر من <span className="font-semibold">500 متخصص</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/workshops">
                <Button size="lg" className="bg-white text-[#3B49DF] hover:bg-white/90 font-semibold">
                  <Play className="w-5 h-5 ml-2" />
                  استكشف الورش
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                  تعرف على إلزير
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/70">متدرب</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-white/70">ورشة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-sm text-white/70">سنة خبرة</div>
              </div>
            </div>
          </div>

          {/* Right Content - Bento Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <BentoCard size="small" gradient="ai" className="text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <h3 className="font-bold">ورش الذكاء الاصطناعي</h3>
                  <p className="text-sm text-gray-600">ChatGPT، Midjourney، والمزيد</p>
                </div>
              </BentoCard>

              <BentoCard size="small" gradient="marketing" className="text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold">التسويق الرقمي</h3>
                  <p className="text-sm text-gray-600">استراتيجيات متقدمة</p>
                </div>
              </BentoCard>
            </div>

            <BentoCard size="wide" gradient="content" className="text-center">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">ورش تفاعلية مباشرة</h3>
                <p className="text-gray-600">تعلم بطريقة عملية مع إمكانية التفاعل المباشر</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>جدولة مرنة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span>بث مباشر</span>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Recipe Group Affiliation */}
            <BentoCard size="wide" gradient="default" className="text-center bg-white/95 backdrop-blur-sm">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Recipe Group</h4>
                <p className="text-sm text-gray-600">الشركة الرائدة في التسويق الرقمي والاستشارات</p>
                <div className="text-xs text-gray-500">شريك معتمد لأكبر الشركات في المنطقة</div>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
