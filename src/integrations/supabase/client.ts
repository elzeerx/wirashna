
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

// Configure proper auth callback redirection
const getRedirectUrl = () => {
  const currentHost = window.location.hostname;
  
  // Check if we're in development or production
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}/auth/callback`;
  } else {
    // For production environments - adapt if you have a custom domain
    return `${window.location.protocol}//${window.location.host}/auth/callback`;
  }
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
    provider: 'google',
    options: {
      redirectTo: getRedirectUrl()
    }
  };
};
