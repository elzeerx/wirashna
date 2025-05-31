
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedBentoGrid, EnhancedBentoCard } from "@/components/ui/enhanced-bento-grid";
import { BookOpen, Users, Trophy, Star } from "lucide-react";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Registration Form */}
            <div className="order-2 lg:order-1">
              <EnhancedBentoCard size="large" gradient="default" className="max-w-md mx-auto">
                <AuthCard />
              </EnhancedBentoCard>
            </div>
            
            {/* Success Stories & Stats */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-center lg:text-right">
                <h1 className="text-3xl font-bold mb-4 gradient-text">ابدأ رحلتك التعليمية</h1>
                <p className="text-lg text-gray-600">
                  انضم إلى آلاف المتعلمين الذين طوروا مهاراتهم معنا
                </p>
              </div>
              
              <EnhancedBentoGrid variant="dashboard">
                <EnhancedBentoCard size="medium" gradient="success">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
                    <div className="text-sm font-medium mb-2">متدرب ناجح</div>
                    <p className="text-xs text-gray-600">حققوا أهدافهم المهنية</p>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="small" gradient="ai">
                  <div className="text-center">
                    <div className="p-2 rounded-lg bg-purple-100 w-fit mx-auto mb-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-xl font-bold text-purple-600">50+</div>
                    <div className="text-sm">ورشة متخصصة</div>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="small" gradient="marketing">
                  <div className="text-center">
                    <div className="p-2 rounded-lg bg-blue-100 w-fit mx-auto mb-2">
                      <Trophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-blue-600">95%</div>
                    <div className="text-sm">معدل الرضا</div>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="medium" gradient="content">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-orange-100 w-fit mx-auto mb-3">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold mb-2">تقييمات ممتازة</h3>
                    <p className="text-sm text-gray-600">متوسط تقييم 4.8/5 من المشاركين</p>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="small" gradient="live">
                  <div className="text-center">
                    <div className="p-2 rounded-lg bg-red-100 w-fit mx-auto mb-2">
                      <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-xl font-bold text-red-600">15+</div>
                    <div className="text-sm">سنة خبرة</div>
                  </div>
                </EnhancedBentoCard>
              </EnhancedBentoGrid>
              
              <EnhancedBentoCard size="featured" gradient="analytics" className="text-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">شهادة من أحد المشاركين</h3>
                  <blockquote className="text-gray-600 italic">
                    "ورش ورشنا غيرت مساري المهني بالكامل. تعلمت مهارات الذكاء الاصطناعي العملية وحصلت على ترقية في العمل خلال شهرين فقط!"
                  </blockquote>
                  <div className="text-sm font-medium">
                    - أحمد محمد، مطور تسويق رقمي
                  </div>
                </div>
              </EnhancedBentoCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
