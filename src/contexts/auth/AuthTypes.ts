
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/supabase";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  userRole: 'admin' | 'supervisor' | 'subscriber' | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};
