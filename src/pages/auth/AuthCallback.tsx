
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      console.log("Auth callback page loaded, processing authentication...");
      
      try {
        // The hash fragment contains session tokens that Supabase needs to process
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: "خطأ في المصادقة",
            description: "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        if (data.session) {
          console.log("Authentication successful, redirecting to home page");
          // Redirect to home page or dashboard
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحبًا بك في منصة ورشنا",
          });
          navigate('/');
        } else {
          console.log("No session found, redirecting to login page");
          navigate('/login');
        }
      } catch (err) {
        console.error("Exception in auth callback:", err);
        toast({
          title: "خطأ غير متوقع",
          description: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="wirashna-loader"></div>
      <p className="mr-4 text-gray-600">جاري تسجيل الدخول...</p>
    </div>
  );
};

export default AuthCallback;
