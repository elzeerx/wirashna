
// Follow the Deno deploy pattern
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Missing environment variables' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('Running close_expired_workshops job');
    
    // Calculate date 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`Closing workshops with dates <= ${tomorrowDateStr}`);
    
    const { data, error } = await supabase
      .from("workshops")
      .update({ registration_closed: true })
      .lte("date", tomorrowDateStr)
      .eq("registration_closed", false);
    
    if (error) {
      console.error('Error closing workshops:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Successfully processed workshops. Rows affected:`, data);
    
    return new Response(
      JSON.stringify({ success: true, affected_rows: data?.length || 0 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
