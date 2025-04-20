
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dxgscdegcjhejmqcvajc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Z3NjZGVnY2poZWptcWN2YWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODc4NzYsImV4cCI6MjA1OTk2Mzg3Nn0.iW0Gev-EYC_cGWdNT1F-7QRdDn-fjIi7VG0R6EQiw8g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage,
    }
  }
);

// Add redirect configuration to the auth callbacks
const authCallbacks = {
  onAuthStateChange: (event: string) => {
    if (event === 'SIGNED_IN') {
      // Get the current URL
      const currentUrl = window.location.href;
      
      // Determine whether we're in localhost or production
      const redirectUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/auth/callback'
        : 'https://wirashna.com/auth/callback';
        
      // Set the redirect URL in the supabase auth configuration
      supabase.auth.setSession({
        refresh_token: '',
        access_token: '',
      });
    }
  }
};

// Subscribe to auth changes
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange(authCallbacks.onAuthStateChange);
}
