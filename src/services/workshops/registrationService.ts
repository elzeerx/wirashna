import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";

export const registerForWorkshop = async (registration: Omit<WorkshopRegistration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status' | 'payment_id' | 'admin_notes'>): Promise<WorkshopRegistration> => {
  try {
    // First check if registration is closed for this workshop
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('id, date, time, registration_closed')
      .eq('id', registration.workshop_id)
      .single();

    if (workshopError) {
      console.error("Error fetching workshop:", workshopError);
      throw workshopError;
    }

    // Check if registration is closed (manually or automatically 24h before start)
    if (workshop) {
      if (workshop.registration_closed) {
        const closedError = new Error("التسجيل مغلق لهذه الورشة");
        closedError.name = "RegistrationClosedError";
        throw closedError;
      }

      // Check if it's less than 24 hours before the workshop starts
      const workshopDate = new Date(`${workshop.date}T${workshop.time}`);
      const now = new Date();
      const timeDiff = workshopDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff <= 24) {
        const closedError = new Error("التسجيل مغلق لاقتراب موعد الورشة");
        closedError.name = "RegistrationClosedError";
        throw closedError;
      }
    }

    // Using upsert pattern to handle potential duplicates
    console.log("Upserting registration for workshop:", registration.workshop_id, "and user:", registration.user_id);

    const registrationData = {
      workshop_id: registration.workshop_id,
      user_id: registration.user_id,
      full_name: registration.full_name,
      email: registration.email,
      phone: registration.phone,
      notes: registration.notes,
      status: 'pending' as const,
      payment_status: 'processing' as const,
      updated_at: new Date().toISOString()
    };

    // Upsert expects an array and doesn't support returning: just select after
    const { error } = await supabase
      .from('workshop_registrations')
      .upsert([registrationData], { 
        onConflict: 'user_id,workshop_id'
      });

    if (error) {
      console.error("Error registering for workshop:", error);
      throw error;
    }

    // Fetch the registration after upsert to return it
    const { data: selected, error: selectError } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', registration.user_id)
      .eq('workshop_id', registration.workshop_id)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    return selected as WorkshopRegistration;
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

export const updateRegistrationStatus = async (id: string, data: Partial<WorkshopRegistration>) => {
  const { data: result, error } = await supabase
    .from('workshop_registrations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result as WorkshopRegistration;
};

export * from './registrationManagement';
export * from './registrationStatus';
export * from './registrationSeats';
