
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If the user is already logged in, redirect to the home page
  // or to the page they were trying to access
  const from = location.state?.from?.pathname || "/";
  
  if (user) {
    navigate(from, { replace: true });
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        await signIn(formState.email, formState.password);
        navigate(from, { replace: true });
      } else {
        if (!formState.name) {
          setError("الرجاء إدخال الاسم الكامل");
          return;
        }
        await signUp(formState.email, formState.password, formState.name);
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
    }
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
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <Label htmlFor="name" className="block font-medium mb-1">الاسم الكامل</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required={!isLogin}
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <Label htmlFor="email" className="block font-medium mb-1">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="password" className="block font-medium mb-1">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      value={formState.password}
                      onChange={handleChange}
                      className="w-full pr-10"
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
                
                <Button 
                  type="submit" 
                  className="w-full mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>جاري التحميل...</span>
                  ) : isLogin ? (
                    <span>تسجيل الدخول</span>
                  ) : (
                    <span>إنشاء حساب</span>
                  )}
                </Button>
                
                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="link"
                    className="text-wirashna-accent"
                    onClick={toggleView}
                  >
                    {isLogin ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب بالفعل؟ تسجيل الدخول"}
                  </Button>
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
