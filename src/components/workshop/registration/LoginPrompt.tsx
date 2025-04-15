
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPrompt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
      <p className="mb-6 text-lg">
        يرجى تسجيل الدخول أو إنشاء حساب للتسجيل في الورشة
      </p>
      <Button 
        onClick={handleRedirectToLogin}
        className="wirashna-btn-primary inline-flex items-center gap-2"
      >
        <LogIn size={18} />
        تسجيل الدخول
      </Button>
    </div>
  );
};

export default LoginPrompt;
