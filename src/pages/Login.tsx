
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedBentoGrid, EnhancedBentoCard } from "@/components/ui/enhanced-bento-grid";
import { Users, Calendar, Award, Zap } from "lucide-react";

const Login = () => {
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
            {/* Login Form */}
            <div className="order-2 lg:order-1">
              <EnhancedBentoCard size="large" gradient="default" className="max-w-md mx-auto">
                <AuthCard />
              </EnhancedBentoCard>
            </div>
            
            {/* Platform Benefits */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-center lg:text-right">
                <h1 className="text-3xl font-bold mb-4 gradient-text">انضم إلى ورشنا</h1>
                <p className="text-lg text-gray-600">
                  اكتسب مهارات جديدة في التسويق الرقمي والذكاء الاصطناعي مع خبراء المجال
                </p>
              </div>
              
              <EnhancedBentoGrid variant="dashboard">
                <EnhancedBentoCard size="small" gradient="ai">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-purple-100 w-fit mx-auto mb-3">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold mb-2">تعلم تفاعلي</h3>
                    <p className="text-sm text-gray-600">ورش عمل مباشرة مع إمكانية التفاعل والأسئلة</p>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="small" gradient="marketing">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-blue-100 w-fit mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold mb-2">خبراء معتمدون</h3>
                    <p className="text-sm text-gray-600">تعلم من أفضل الخبراء في المجال</p>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="medium" gradient="content">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-orange-100 w-fit mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold mb-2">جدولة مرنة</h3>
                    <p className="text-sm text-gray-600">اختر الأوقات التي تناسبك مع إمكانية الوصول للتسجيلات</p>
                  </div>
                </EnhancedBentoCard>
                
                <EnhancedBentoCard size="small" gradient="success">
                  <div className="text-center">
                    <div className="p-3 rounded-lg bg-green-100 w-fit mx-auto mb-3">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold mb-2">شهادات معتمدة</h3>
                    <p className="text-sm text-gray-600">احصل على شهادات إتمام معتمدة</p>
                  </div>
                </EnhancedBentoCard>
              </EnhancedBentoGrid>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
