
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
      // The hash fragment contains session tokens that Supabase needs to process
      const { error } = await supabase.auth.getSession();
      
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
      
      // Redirect to home page or dashboard
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في منصة ورشنا",
      });
      navigate('/');
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
