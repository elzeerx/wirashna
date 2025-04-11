
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types/supabase";
import { AuthContextType } from "./AuthTypes";
import { 
  fetchUserProfile, 
  signInOperation, 
  signUpOperation, 
  signInWithGoogleOperation, 
  signOutOperation 
} from "./authOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'supervisor' | 'subscriber' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check if user is admin after auth state changes
        if (newSession?.user) {
          setTimeout(() => {
            loadUserProfile(newSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsSupervisor(false);
          setUserRole(null);
          setUserProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        loadUserProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const profileData = await fetchUserProfile(userId);
    setUserProfile(profileData.userProfile);
    setIsAdmin(profileData.isAdmin);
    setIsSupervisor(profileData.isSupervisor);
    setUserRole(profileData.userRole);
  };

  const signIn = async (email: string, password: string) => {
    await signInOperation(email, password, toast, setIsLoading);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await signUpOperation(email, password, name, toast, setIsLoading);
  };

  const signInWithGoogle = async () => {
    await signInWithGoogleOperation(toast, setIsLoading);
  };

  const signOut = async () => {
    await signOutOperation(toast, setIsLoading);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAdmin,
        isSupervisor,
        userRole,
        userProfile,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
