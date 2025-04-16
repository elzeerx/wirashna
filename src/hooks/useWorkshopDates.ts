
import { useState } from "react";
import { format, addDays } from "date-fns";
import { WorkshopDate } from "@/types/workshop";
import { formatTimeWithPeriod } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

export const useWorkshopDates = (
  initialDates: WorkshopDate[] = []
) => {
  const [dates, setDates] = useState<WorkshopDate[]>(initialDates);
  const { toast } = useToast();

  const addDate = (tempDate: Date | null, tempTime: string, duration: string) => {
    if (!tempDate || !tempTime) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار التاريخ والوقت",
        variant: "destructive",
      });
      return false;
    }

    const numberOfDays = parseInt(duration);
    const newDates: WorkshopDate[] = [];

    // Generate dates for the specified number of days
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(tempDate, i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      
      const newDate: WorkshopDate = {
        date: formattedDate,
        time: tempTime,
        endTime: tempTime, // Using the same time for consistency
        displayTime: formatTimeWithPeriod(tempTime)
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
