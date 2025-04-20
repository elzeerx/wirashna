
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/supabase";
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast";

// Define the ToastOptions type explicitly
export type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

// Function to fetch user profile
export const fetchUserProfile = async (userId: string): Promise<{
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSupervisor: boolean;
  userRole: 'admin' | 'supervisor' | 'subscriber' | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return {
        userProfile: null,
        isAdmin: false,
        isSupervisor: false,
        userRole: null
      };
    }
    
    // If we have user data
    if (data) {
      // Convert the data to UserProfile type
      const userProfile = data as unknown as UserProfile;
      const isAdmin = userProfile.is_admin || userProfile.role === 'admin';
      const isSupervisor = userProfile.role === 'supervisor';
      const userRole = userProfile.role;
      
      return {
        userProfile,
        isAdmin,
        isSupervisor,
        userRole
      };
    } else {
      return {
        userProfile: null,
        isAdmin: false,
        isSupervisor: false,
        userRole: null
      };
    }
  } catch (error) {
    console.error("Could not fetch user profile:", error);
    return {
      userProfile: null,
      isAdmin: false,
      isSupervisor: false,
      userRole: null
    };
  }
};

// Sign in operation
export const signInOperation = async (
  email: string, 
  password: string,
  toast: (options: ToastOptions) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحبًا بك في منصة ورشنا",
    });
  } catch (error: any) {
    toast({
      title: "خطأ في تسجيل الدخول",
      description: error.message || "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.",
      variant: "destructive",
    });
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// Sign up operation
export const signUpOperation = async (
  email: string, 
  password: string, 
  name: string,
  toast: (options: ToastOptions) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) throw error;
    toast({
      title: "تم إنشاء الحساب بنجاح",
      description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
    });
  } catch (error: any) {
    toast({
      title: "خطأ في إنشاء الحساب",
      description: error.message || "حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.",
      variant: "destructive",
    });
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// Sign in with Google operation
export const signInWithGoogleOperation = async (
  toast: (options: ToastOptions) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
    if (error) throw error;
  } catch (error: any) {
    toast({
      title: "خطأ في تسجيل الدخول بواسطة جوجل",
      description: error.message || "حدث خطأ أثناء تسجيل الدخول بواسطة جوجل. الرجاء المحاولة مرة أخرى.",
      variant: "destructive",
    });
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// Sign out operation
export const signOutOperation = async (
  toast: (options: ToastOptions) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setIsLoading(true);
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "نتمنى رؤيتك مرة أخرى قريبًا",
    });
  } catch (error: any) {
    toast({
      title: "خطأ في تسجيل الخروج",
      description: error.message || "حدث خطأ أثناء تسجيل الخروج. الرجاء المحاولة مرة أخرى.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
