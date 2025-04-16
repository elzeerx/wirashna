
import { useState } from "react";
import { format, addDays } from "date-fns";
import { WorkshopDate } from "@/types/workshop";
import { formatTimeWithPeriod, calculateEndTime } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

export const useWorkshopDates = (
  initialDates: WorkshopDate[] = []
) => {
  const [dates, setDates] = useState<WorkshopDate[]>(initialDates);
  const { toast } = useToast();

  const addDate = (tempDate: Date | null, tempTime: string, daysDuration: string, sessionDuration: string) => {
    if (!tempDate || !tempTime) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار التاريخ والوقت",
        variant: "destructive",
      });
      return false;
    }

    const numberOfDays = parseInt(daysDuration);
    const sessionHours = parseInt(sessionDuration);
    const newDates: WorkshopDate[] = [];

    // Generate dates for the specified number of days
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(tempDate, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      const endTime = calculateEndTime(tempTime, sessionHours);
      
      const newDate: WorkshopDate = {
        date: formattedDate,
        time: tempTime,
        endTime: format(endTime, "HH:mm"),
        displayTime: `${formatTimeWithPeriod(tempTime)} - ${formatTimeWithPeriod(format(endTime, "HH:mm"))}`
      };
      
      // Check if this date and time combination already exists
      const dateExists = dates.some(
        (d) => d.date === formattedDate && d.time === tempTime
      );
      
      if (!dateExists) {
        newDates.push(newDate);
      }
    }

    if (newDates.length > 0) {
      setDates([...dates, ...newDates]);
      return true;
    } else {
      toast({
        title: "تنبيه",
        description: "هذه المواعيد موجودة مسبقاً",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeDate = (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  return {
    dates,
    setDates,
    addDate,
    removeDate
  };
};
