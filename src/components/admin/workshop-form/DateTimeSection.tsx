
import React from "react";
import { format } from "date-fns";
import { FormSection } from "./FormSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X, Plus, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useWorkshopDates } from "@/hooks/useWorkshopDates";

export const DateTimeSection = () => {
  const form = useFormContext();
  const { dates, addDate, removeDate } = useWorkshopDates(form.getValues("dates") || []);

  const handleAddDate = () => {
    const tempDate = form.getValues("tempDate");
    const tempTime = form.getValues("tempTime");
    const duration = form.getValues("duration") || "1";
    
    if (addDate(tempDate, tempTime, duration)) {
      form.setValue("dates", dates);
      form.setValue("tempTime", "");
      // Don't reset tempDate to allow for quick multiple selections
    }
  };

  const handleRemoveDate = (index: number) => {
    removeDate(index);
    form.setValue("dates", dates.filter((_, i) => i !== index));
  };

  const selectedDate = form.watch("tempDate");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">المواعيد المتاحة</h3>
      
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
              { value: "5", label: "5 ساعات" },
              { value: "6", label: "6 ساعات" },
              { value: "7", label: "7 ساعات" },
              { value: "8", label: "8 ساعات" },
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
        {dates.map((date, index) => (
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
  );
};
