import { supabase } from "@/integrations/supabase/client";
import { WorkshopRegistration } from "@/types/supabase";

export const registerForWorkshop = async (registration: Omit<WorkshopRegistration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status' | 'payment_id' | 'admin_notes'>): Promise<WorkshopRegistration> => {
  try {
    // First check if this user already has a registration for this workshop
    const { data: existingRegistration, error: checkError } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', registration.user_id)
      .eq('workshop_id', registration.workshop_id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing workshop registration:", checkError);
      throw checkError;
    }

    // If there's an existing registration with a failed or unpaid payment status,
    // or the registration was canceled, update it to allow re-registration
    if (existingRegistration && 
        (existingRegistration.status === 'canceled' || 
         ['failed', 'unpaid', 'processing'].includes(existingRegistration.payment_status))) {
      
      const { data, error } = await supabase
        .from('workshop_registrations')
        .update({
          full_name: registration.full_name,
          email: registration.email,
          phone: registration.phone,
          notes: registration.notes,
          status: 'pending',
          payment_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRegistration.id)
        .select()
        .single();

      if (error) throw error;
      return data as WorkshopRegistration;
    }
    
    // If there's an existing registration in a completed state, throw a duplicate error
    if (existingRegistration && existingRegistration.payment_status === 'paid') {
      console.log("Found existing paid registration with payment status:", existingRegistration.payment_status);
      const duplicateError = new Error("لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى");
      duplicateError.name = "DuplicateRegistrationError";
      throw duplicateError;
    }
    
    // Create a new registration if no existing one was found
    console.log("Creating new registration for workshop:", registration.workshop_id, "and user:", registration.user_id);
    const registrationData = {
      ...registration,
      status: 'pending' as const,
      payment_status: 'processing' as const
    };

    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error("Error registering for workshop:", error);
      
      if (error.message && error.message.includes("duplicate key value violates unique constraint")) {
        const duplicateError = new Error("لقد قمت بالتسجيل في هذه الورشة مسبقاً ولا يمكن التسجيل مرة أخرى");
        duplicateError.name = "DuplicateRegistrationError";
        throw duplicateError;
      }
      
      throw error;
    }

    return data as WorkshopRegistration;
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

export * from './registrationManagement';
export * from './registrationStatus';
export * from './registrationSeats';
