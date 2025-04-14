
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";

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
          <div className="max-w-md mx-auto">
            <AuthCard />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
