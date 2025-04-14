
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const RepairDescription = () => {
  return (
    <Alert variant="default" className="bg-muted/50">
      <Info className="h-4 w-4" />
      <AlertTitle>ما هذه الأداة؟</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          تساعدك هذه الأداة على إصلاح المشاكل الشائعة في نظام التسجيل في الورش:
        </p>
        <ul className="list-disc list-inside rtl:pr-4 ltr:pl-4 space-y-1">
          <li>
            تنظيف التسجيلات الفاشلة أو المعلقة
          </li>
          <li>
            إعادة حساب عدد المقاعد المتاحة للتسجيل
          </li>
          <li>
            إصلاح أخطاء الدفع وتحديث حالة التسجيلات
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default RepairDescription;
