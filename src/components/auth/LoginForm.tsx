
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  toggleView: () => void;
}

export const LoginForm = ({
  onSubmit,
  isLoading,
  error,
  setError,
  toggleView,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await onSubmit(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4">
        <Label htmlFor="email" className="block font-medium mb-1">البريد الإلكتروني</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        ) : (
          <span>تسجيل الدخول</span>
        )}
      </Button>
      
      <div className="text-center mb-4">
        <Button 
          type="button" 
          variant="link"
          className="text-wirashna-accent"
          onClick={toggleView}
        >
          ليس لديك حساب؟ إنشاء حساب جديد
        </Button>
      </div>
    </form>
  );
};
