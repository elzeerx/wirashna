
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info, RefreshCw, Check, RotateCcw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWorkshops, recalculateWorkshopSeats, cleanupFailedRegistrations } from "@/services/workshops";
import { Workshop } from "@/types/supabase";

interface WorkshopRepairToolProps {
  workshopId?: string;
}

const WorkshopRepairTool = ({ workshopId }: WorkshopRepairToolProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(workshopId || "");
  const [operationResults, setOperationResults] = useState<{ success: boolean; message: string } | null>(null);
  const [cleanupCompleted, setCleanupCompleted] = useState<boolean>(false);
  const [recalculationCompleted, setRecalculationCompleted] = useState<boolean>(false);
  const [autoCleanup, setAutoCleanup] = useState<boolean>(true);
  const { toast } = useToast();

  // Load workshops if not provided with a specific one
  const loadWorkshops = async () => {
    if (workshops.length > 0) return;
    
    setIsLoading(true);
    try {
      const workshopsData = await fetchWorkshops();
      setWorkshops(workshopsData);
      
      // If a workshopId was provided in props, select it
      if (workshopId && !selectedWorkshopId) {
        setSelectedWorkshopId(workshopId);
      }
    } catch (error) {
      console.error("Error loading workshops:", error);
      toast({
        title: "خطأ في تحميل الورش",
        description: "حدث خطأ أثناء تحميل بيانات الورش. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load workshops on component mount
  useState(() => {
    loadWorkshops();
  });

  // Handle recalculating seats for a workshop
  const handleRecalculateSeats = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecalculationCompleted(false);
    setOperationResults(null);
    
    try {
      await recalculateWorkshopSeats(selectedWorkshopId);
      setOperationResults({
        success: true,
        message: "تم إعادة حساب المقاعد المتاحة بنجاح"
      });
      setRecalculationCompleted(true);
      
      toast({
        title: "تم إعادة الحساب بنجاح",
        description: "تم إعادة حساب عدد المقاعد المتاحة بنجاح",
      });
    } catch (error) {
      console.error("Error recalculating seats:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء إعادة حساب المقاعد المتاحة"
      });
      
      toast({
        title: "خطأ في إعادة الحساب",
        description: "حدث خطأ أثناء إعادة حساب المقاعد المتاحة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cleaning up failed registrations
  const handleCleanupRegistrations = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCleanupCompleted(false);
    setOperationResults(null);
    
    try {
      await cleanupFailedRegistrations(selectedWorkshopId);
      
      // If auto cleanup is enabled, also recalculate seats
      if (autoCleanup) {
        await recalculateWorkshopSeats(selectedWorkshopId);
        setRecalculationCompleted(true);
      }
      
      setOperationResults({
        success: true,
        message: "تم تنظيف التسجيلات الفاشلة بنجاح" + (autoCleanup ? " وإعادة حساب المقاعد" : "")
      });
      setCleanupCompleted(true);
      
      toast({
        title: "تم التنظيف بنجاح",
        description: "تم تنظيف التسجيلات الفاشلة بنجاح" + (autoCleanup ? " وإعادة حساب المقاعد" : ""),
      });
    } catch (error) {
      console.error("Error cleaning up registrations:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء تنظيف التسجيلات الفاشلة"
      });
      
      toast({
        title: "خطأ في التنظيف",
        description: "حدث خطأ أثناء تنظيف التسجيلات الفاشلة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle repair all operation (cleanup and recalculate)
  const handleRepairAll = async () => {
    if (!selectedWorkshopId) {
      toast({
        title: "حدد ورشة",
        description: "يرجى اختيار ورشة أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCleanupCompleted(false);
    setRecalculationCompleted(false);
    setOperationResults(null);
    
    try {
      // First cleanup failed registrations
      await cleanupFailedRegistrations(selectedWorkshopId);
      setCleanupCompleted(true);
      
      // Then recalculate seats
      await recalculateWorkshopSeats(selectedWorkshopId);
      setRecalculationCompleted(true);
      
      setOperationResults({
        success: true,
        message: "تم إصلاح الورشة بنجاح (تنظيف التسجيلات وإعادة حساب المقاعد)"
      });
      
      toast({
        title: "تم الإصلاح بنجاح",
        description: "تم إصلاح الورشة بنجاح (تنظيف التسجيلات وإعادة حساب المقاعد)",
      });
    } catch (error) {
      console.error("Error repairing workshop:", error);
      setOperationResults({
        success: false,
        message: "حدث خطأ أثناء إصلاح الورشة"
      });
      
      toast({
        title: "خطأ في الإصلاح",
        description: "حدث خطأ أثناء إصلاح الورشة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداة إصلاح الورش</CardTitle>
        <CardDescription>
          استخدم هذه الأداة لإصلاح مشاكل بيانات الورش وتنظيف التسجيلات وإعادة حساب المقاعد
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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

        {operationResults && (
          <Alert variant={operationResults.success ? "default" : "destructive"}>
            {operationResults.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{operationResults.success ? "تمت العملية بنجاح" : "خطأ في العملية"}</AlertTitle>
            <AlertDescription>{operationResults.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workshop-select">اختر ورشة</Label>
            <Select
              value={selectedWorkshopId}
              onValueChange={setSelectedWorkshopId}
              disabled={isLoading || !!workshopId} // Disable if loading or if workshopId was provided in props
            >
              <SelectTrigger id="workshop-select">
                <SelectValue placeholder="اختر ورشة لإصلاحها" />
              </SelectTrigger>
              <SelectContent>
                {workshops.map((workshop) => (
                  <SelectItem key={workshop.id} value={workshop.id}>
                    {workshop.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="auto-recalculate"
              checked={autoCleanup}
              onCheckedChange={(checked) => setAutoCleanup(checked as boolean)}
            />
            <Label htmlFor="auto-recalculate">إعادة حساب المقاعد تلقائياً بعد تنظيف التسجيلات</Label>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          variant="outline"
          onClick={handleCleanupRegistrations}
          disabled={isLoading || !selectedWorkshopId}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          تنظيف التسجيلات الفاشلة
          {cleanupCompleted && <Check className="h-4 w-4 text-green-500" />}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleRecalculateSeats}
          disabled={isLoading || !selectedWorkshopId}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          إعادة حساب المقاعد المتاحة
          {recalculationCompleted && <Check className="h-4 w-4 text-green-500" />}
        </Button>
        
        <Button
          onClick={handleRepairAll}
          disabled={isLoading || !selectedWorkshopId}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          إصلاح شامل للورشة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkshopRepairTool;
