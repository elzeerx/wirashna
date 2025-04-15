
import { cleanupFailedRegistrations, recalculateWorkshopSeats } from "@/services/workshops";

export const useRegistrationCleanup = () => {
  const cleanupRegistrations = async (workshopId: string) => {
    try {
      await cleanupFailedRegistrations(workshopId);
    } catch (cleanupError) {
      console.error("Failed to cleanup registrations, but continuing:", cleanupError);
    }
  };

  const handleSeatsRecalculation = async (workshopId: string) => {
    try {
      await recalculateWorkshopSeats(workshopId);
    } catch (recalcError) {
      console.error("Failed to recalculate seats:", recalcError);
    }
  };

  return {
    cleanupRegistrations,
    handleSeatsRecalculation
  };
};
