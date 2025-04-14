
import { supabase } from "@/integrations/supabase/client";
import { cleanupFailedRegistrations, recalculateWorkshopSeats } from "@/services/workshops";

/**
 * Utility function to repair workshop data and registrations
 * Can be called from admin pages or console
 */
export const repairWorkshopData = async (workshopId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}> => {
  try {
    console.log(`Starting repair process for workshop ${workshopId}`);
    
    // Step 1: Clean up failed registrations
    await cleanupFailedRegistrations(workshopId);
    console.log("Cleanup of failed registrations completed");
    
    // Step 2: Recalculate available seats
    await recalculateWorkshopSeats(workshopId);
    console.log("Seat recalculation completed");
    
    // Step 3: Get summary of current workshop state
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('title, total_seats, available_seats')
      .eq('id', workshopId)
      .single();
    
    if (workshopError) {
      return {
        success: false,
        message: "Repair completed but failed to fetch updated workshop data",
        error: workshopError
      };
    }
    
    // Step 4: Get count of valid registrations
    const { count, error: countError } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('status', 'confirmed')
      .eq('payment_status', 'paid');
    
    if (countError) {
      return {
        success: false,
        message: "Repair completed but failed to count confirmed registrations",
        error: countError
      };
    }
    
    return {
      success: true,
      message: "Workshop data repaired successfully",
      data: {
        workshop,
        confirmedRegistrations: count || 0
      }
    };
  } catch (error) {
    console.error("Error repairing workshop data:", error);
    return {
      success: false,
      message: "Failed to repair workshop data",
      error
    };
  }
};

/**
 * Repair all workshops in the database
 */
export const repairAllWorkshops = async (): Promise<{
  success: boolean;
  message: string;
  results?: any[];
  error?: any;
}> => {
  try {
    // Get all workshop IDs
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('id, title');
    
    if (error) {
      return {
        success: false,
        message: "Failed to fetch workshops",
        error
      };
    }
    
    if (!workshops || workshops.length === 0) {
      return {
        success: true,
        message: "No workshops found to repair",
        results: []
      };
    }
    
    console.log(`Found ${workshops.length} workshops to repair`);
    
    // Repair each workshop
    const results = await Promise.all(
      workshops.map(async (workshop) => {
        const result = await repairWorkshopData(workshop.id);
        return {
          id: workshop.id,
          title: workshop.title,
          ...result
        };
      })
    );
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: true,
      message: `Repaired ${successCount} of ${workshops.length} workshops`,
      results
    };
  } catch (error) {
    console.error("Error repairing all workshops:", error);
    return {
      success: false,
      message: "Failed to repair all workshops",
      error
    };
  }
};
