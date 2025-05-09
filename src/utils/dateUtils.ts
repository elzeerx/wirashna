
import { addHours, format } from "date-fns";

export const formatTimeWithPeriod = (time: string): string => {
  if (!time) return "";
  
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    // Configure Arabic locale with proper formatting
    return date.toLocaleTimeString('ar-EG', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // Return original time if there's an error
  }
};

export const calculateEndTime = (startTime: string, durationHours: number): Date => {
  if (!startTime) {
    console.error("Invalid start time:", startTime);
    return new Date();
  }
  
  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return addHours(date, durationHours);
  } catch (error) {
    console.error("Error calculating end time:", error, startTime, durationHours);
    return new Date();
  }
};

export const calculateDurationHours = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = (startHours * 60) + startMinutes;
    const endTotalMinutes = (endHours * 60) + endMinutes;
    
    // Calculate duration in hours (convert minutes to decimal hours)
    return parseFloat(((endTotalMinutes - startTotalMinutes) / 60).toFixed(1));
  } catch (error) {
    console.error("Error calculating duration:", error);
    return 0;
  }
};

// Add the missing formatDate export
export const formatDate = format;
