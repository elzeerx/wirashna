
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { Provider } from '@supabase/supabase-js';

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

// Configure proper auth callback redirection
const getRedirectUrl = () => {
  // Always use the current window location for constructing the redirect URL
  // This ensures it works in all environments (local, production, preview)
  const protocol = window.location.protocol;
  const host = window.location.host;
  
  return `${protocol}//${host}/auth/callback`;
};

// Set up auth state change listener
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in, configured redirect URL:', getRedirectUrl());
    }
  });
}

// Configure auth settings for OAuth providers
export const getOAuthConfig = () => {
  return {
    provider: 'google' as Provider,
    options: {
      redirectTo: getRedirectUrl()
    }
  };
};
