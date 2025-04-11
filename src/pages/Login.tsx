
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    name: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleView = () => {
    setIsLogin(!isLogin);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard or show error
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="max-w-md mx-auto">
            <div className="wirashna-card">
              <h1 className="text-2xl font-bold mb-6 text-center">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h1>
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block font-medium mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required={!isLogin}
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="block font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block font-medium mb-1">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      value={formState.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 left-0 px-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {isLogin && (
                  <div className="mb-6 text-left">
                    <Link to="/forgot-password" className="text-wirashna-accent hover:underline text-sm">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="wirashna-btn-primary w-full mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>جاري التحميل...</span>
                  ) : isLogin ? (
                    <span>تسجيل الدخول</span>
                  ) : (
                    <span>إنشاء حساب</span>
                  )}
                </button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    className="text-wirashna-accent hover:underline"
                    onClick={toggleView}
                  >
                    {isLogin ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب بالفعل؟ تسجيل الدخول"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
