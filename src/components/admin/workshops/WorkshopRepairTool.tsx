
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { repairWorkshopData, repairAllWorkshops } from "@/utils/workshopRepair";
import { useToast } from "@/hooks/use-toast";

interface WorkshopRepairToolProps {
  workshopId?: string;
}

const WorkshopRepairTool = ({ workshopId }: WorkshopRepairToolProps) => {
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairResult, setRepairResult] = useState<any>(null);
  const { toast } = useToast();

  const handleRepairWorkshop = async () => {
    if (!workshopId) {
      toast({
        title: "خطأ",
        description: "لم يتم تحديد ورشة للإصلاح",
        variant: "destructive"
      });
      return;
    }
    
    setIsRepairing(true);
    try {
      const result = await repairWorkshopData(workshopId);
      setRepairResult(result);
      
      if (result.success) {
        toast({
          title: "تم الإصلاح بنجاح",
          description: "تم إصلاح بيانات الورشة بنجاح"
        });
      } else {
        toast({
          title: "حدث خطأ",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error repairing workshop:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إصلاح بيانات الورشة",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
    }
  };

  const handleRepairAllWorkshops = async () => {
    setIsRepairing(true);
    try {
      const result = await repairAllWorkshops();
      setRepairResult(result);
      
      if (result.success) {
        toast({
          title: "تم الإصلاح بنجاح",
          description: result.message
        });
      } else {
        toast({
          title: "حدث خطأ",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error repairing all workshops:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء إصلاح بيانات الورش",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداة إصلاح بيانات الورش</CardTitle>
        <CardDescription>
          استخدم هذه الأداة لإصلاح مشاكل بيانات الورش وتحديث عدد المقاعد المتاحة وتنظيف التسجيلات الفاشلة
        </CardDescription>
      </CardHeader>
      <CardContent>
        {repairResult && (
          <Alert variant={repairResult.success ? "default" : "destructive"} className="mb-4">
            <AlertTitle className="flex items-center gap-2">
              {repairResult.success ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {repairResult.success ? "تم الإصلاح بنجاح" : "حدث خطأ"}
            </AlertTitle>
            <AlertDescription>
              {repairResult.message}
              
              {repairResult.success && repairResult.data && (
                <div className="mt-2">
                  <h4 className="font-semibold">نتائج الإصلاح:</h4>
                  <ul className="list-disc list-inside mt-1">
                    <li>
                      عدد المقاعد الإجمالي: {repairResult.data.workshop?.total_seats}
                    </li>
                    <li>
                      عدد المقاعد المتاحة: {repairResult.data.workshop?.available_seats}
                    </li>
                    <li>
                      التسجيلات المؤكدة: {repairResult.data.confirmedRegistrations}
                    </li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <p>
            هذه الأداة تقوم بإصلاح البيانات التالية:
          </p>
          <ul className="list-disc list-inside space-y-1 rtl:pr-4 ltr:pl-4">
            <li>تنظيف التسجيلات الفاشلة وغير المكتملة</li>
            <li>إعادة حساب عدد المقاعد المتاحة</li>
            <li>تصحيح حالات التسجيل</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        {workshopId ? (
          <Button 
            onClick={handleRepairWorkshop} 
            disabled={isRepairing}
            className="w-full"
          >
            {isRepairing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                جاري الإصلاح...
              </>
            ) : (
              "إصلاح هذه الورشة"
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleRepairAllWorkshops} 
            disabled={isRepairing}
            className="w-full"
          >
            {isRepairing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                جاري إصلاح جميع الورش...
              </>
            ) : (
              "إصلاح جميع الورش"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkshopRepairTool;
