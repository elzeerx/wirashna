
import { FormSection } from "./FormSection";
import { Button } from "@/components/ui/button";
import { Save, Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

export const BasicInformationStep = () => {
  const form = useFormContext();

  const handleAddDate = () => {
    const currentDates = form.getValues("dates") || [];
    const newDate = {
      date: form.getValues("tempDate") || "",
      time: form.getValues("tempTime") || ""
    };
    
    if (newDate.date && newDate.time) {
      form.setValue("dates", [...currentDates, newDate]);
      form.setValue("tempDate", "");
      form.setValue("tempTime", "");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSection
              name="tempDate"
              label="التاريخ"
              type="date"
              required={false}
              placeholder="dd/mm/yyyy"
            />

            <div className="space-y-2">
              <FormSection
                name="tempTime"
                label="وقت البدء"
                placeholder="--:--"
                type="time"
                required={false}
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
                {date.date} - {date.time}
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

        <div className="flex justify-end pt-6">
          <Button type="submit" className="gap-2">
            إنشاء الورشة
          </Button>
        </div>
      </div>
    </div>
  );
};
