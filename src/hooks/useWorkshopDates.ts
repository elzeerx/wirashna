
import { useState } from "react";
import { format } from "date-fns";
import { WorkshopDate } from "@/types/workshop";
import { formatTimeWithPeriod, calculateEndTime } from "@/utils/dateUtils";
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
      return;
    }

    const formattedDate = format(tempDate, "yyyy-MM-dd");
    const endTime = calculateEndTime(tempTime, Number(duration));
    
    const newDate: WorkshopDate = {
      date: formattedDate,
      time: tempTime,
      endTime: format(endTime, 'HH:mm'),
      displayTime: `من ${formatTimeWithPeriod(tempTime)} إلى ${formatTimeWithPeriod(format(endTime, 'HH:mm'))}`
    };
    
    const dateExists = dates.some(
      (d) => d.date === formattedDate && d.time === tempTime
    );
    
    if (!dateExists) {
      setDates([...dates, newDate]);
      return true;
    } else {
      toast({
        title: "تنبيه",
        description: "هذا الموعد موجود مسبقاً",
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
