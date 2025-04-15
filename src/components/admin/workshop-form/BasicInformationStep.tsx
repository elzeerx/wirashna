import { FormSection } from "./FormSection";
import { Button } from "@/components/ui/button";
import { Clock, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const BasicInformationStep = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إنشاء ورشة عمل جديدة</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">المعلومات الأساسية</span>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
            1
          </div>
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormSection
            name="date"
            label="التاريخ"
            type="date"
            required
            placeholder="dd/mm/yyyy"
          />

          <div className="space-y-2">
            <FormSection
              name="time"
              label="وقت البدء"
              placeholder="--:--"
              type="time"
              required
            />
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
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            حفظ كمسودة
          </Button>
          <Button type="submit" className="gap-2">
            الخطوة التالية
          </Button>
        </div>
      </div>
    </div>
  );
};
