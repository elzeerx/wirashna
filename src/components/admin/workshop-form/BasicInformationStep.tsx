
import { FormSection } from "./FormSection";
import { Button } from "@/components/ui/button";
import { Plus, X, CalendarIcon, Clock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { format, addHours } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatTimeWithPeriod } from "@/utils/dateUtils";

export const BasicInformationStep = () => {
  const form = useFormContext();

  const handleAddDate = () => {
    const currentDates = form.getValues("dates") || [];
    const tempDate = form.getValues("tempDate");
    const tempTime = form.getValues("tempTime");
    const duration = Number(form.getValues("duration")) || 1;
    
    if (tempDate && tempTime) {
      const formattedDate = format(tempDate, "yyyy-MM-dd");
      
      // Calculate end time
      const [hours, minutes] = tempTime.split(':');
      const startTime = new Date();
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);
      const endTime = addHours(startTime, duration);
      
      const newDate = {
        date: formattedDate,
        time: tempTime,
        endTime: format(endTime, 'HH:mm'),
        displayTime: `من ${formatTimeWithPeriod(tempTime)} إلى ${format(endTime, 'h:mm a')}`
      };
      
      // Check if this date and time combination already exists
      const dateExists = currentDates.some(
        (d: any) => d.date === formattedDate && d.time === tempTime
      );
      
      if (!dateExists) {
        form.setValue("dates", [...currentDates, newDate]);
        form.setValue("tempTime", "");
        // Don't reset the date to allow for quick multiple selections
      }
    }
  };

  const handleRemoveDate = (index: number) => {
    const currentDates = form.getValues("dates") || [];
    form.setValue(
      "dates",
      currentDates.filter((_, i) => i !== index)
    );
  };

  const dates = form.watch("dates") || [];
  const selectedDate = form.watch("tempDate");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إنشاء ورشة عمل جديدة</h1>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <FormSection
          name="title"
          label="عنوان ورشة العمل"
          placeholder="أدخل عنوان ورشة العمل"
          required
        />

        <FormSection
          name="description"
          label="الوصف"
          placeholder="صف ورشة العمل الخاصة بك"
          required
          isTextarea
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">التاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy")
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => form.setValue("tempDate", date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <FormSection
                name="tempTime"
                label="وقت البدء"
                placeholder="--:--"
                type="time"
                required={false}
              />
            </div>

            <div className="space-y-2">
              <FormSection
                name="duration"
                label="المدة"
                type="select"
                placeholder="ساعة واحدة"
                options={[
                  { value: "1", label: "ساعة واحدة" },
                  { value: "2", label: "ساعتان" },
                  { value: "3", label: "3 ساعات" },
                  { value: "4", label: "4 ساعات" },
                ]}
                required
              />
            </div>
          </div>
          
          <Button 
            type="button" 
            onClick={handleAddDate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة موعد
          </Button>

          <div className="flex flex-wrap gap-2 mt-2">
            {dates.map((date: any, index: number) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="flex items-center gap-2"
              >
                {date.date} - {date.displayTime}
                <button
                  type="button"
                  onClick={() => handleRemoveDate(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" className="gap-2">
            إنشاء الورشة
          </Button>
        </div>
      </div>
    </div>
  );
};
