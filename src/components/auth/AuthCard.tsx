
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { AuthSeparator } from "./AuthSeparator";

export const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // If the user is already logged in, redirect to the home page
  if (user) {
    navigate("/", { replace: true });
  }
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Authentication error:", error);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name);
      setIsLogin(true);
    } catch (error: any) {
      console.error("Authentication error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google authentication error:", error);
      setError("حدث خطأ أثناء تسجيل الدخول بواسطة جوجل");
    }
  };

  return (
    <div className="wirashna-card">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
      </h1>
      
      {isLogin ? (
        <LoginForm
          onSubmit={handleSignIn}
          isLoading={isLoading}
          error={error}
          setError={setError}
          toggleView={toggleView}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignUp}
          isLoading={isLoading}
          error={error}
          setError={setError}
          toggleView={toggleView}
        />
      )}
      
      <AuthSeparator />
      
      <GoogleSignInButton
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      />
    </div>
  );
};
