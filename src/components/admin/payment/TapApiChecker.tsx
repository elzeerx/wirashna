
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, AlertCircle, Info } from "lucide-react";
import { checkTapApiKey } from "@/services/payment/checkApiKey";
import { useToast } from "@/hooks/use-toast";

const TapApiChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<any>(null);
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const { toast } = useToast();

  // Run an initial check when the component mounts
  useEffect(() => {
    const runInitialCheck = async () => {
      try {
        setIsChecking(true);
        const result = await checkTapApiKey();
        setLastCheckResult(result);
      } catch (error) {
        console.error("Error during initial API key check:", error);
        setLastCheckResult({
          success: false,
          message: "حدث خطأ أثناء التحقق من مفتاح TAP API"
        });
      } finally {
        setIsChecking(false);
        setIsInitialCheck(false);
      }
    };

    if (isInitialCheck) {
      runInitialCheck();
    }
  }, [isInitialCheck]);

  const handleCheckApiKey = async () => {
    setIsChecking(true);
    try {
      const result = await checkTapApiKey();
      setLastCheckResult(result);
      
      toast({
        title: result.success ? "تم التحقق بنجاح" : "فشل التحقق",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error checking TAP API key:", error);
      setLastCheckResult({
        success: false,
        message: "حدث خطأ أثناء التحقق من مفتاح TAP API"
      });
      
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء التحقق من مفتاح TAP API",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>التحقق من مفتاح TAP API</CardTitle>
        <CardDescription>
          تحقق من وجود وصلاحية مفتاح TAP API اللازم لمعالجة المدفوعات
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lastCheckResult && (
          <Alert 
            variant={lastCheckResult.success ? "default" : "destructive"} 
            className="mb-4"
          >
            <AlertTitle className="flex items-center gap-2">
              {lastCheckResult.success ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {lastCheckResult.success ? "مفتاح API صالح" : "مشكلة في مفتاح API"}
            </AlertTitle>
            <AlertDescription>{lastCheckResult.message}</AlertDescription>
          </Alert>
        )}
        
        <Alert variant="default" className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertTitle>معلومات مهمة</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              يجب إضافة مفتاح TAP API السري إلى إعدادات الوظائف في Supabase لكي تعمل عمليات الدفع بشكل صحيح.
            </p>
            <ul className="list-disc list-inside rtl:pr-4 ltr:pl-4 space-y-1">
              <li>
                تأكد من إضافة مفتاح API باسم <code>TAP_SECRET_KEY</code>
              </li>
              <li>
                تأكد من استخدام المفتاح السري وليس المفتاح العام
              </li>
              <li>
                يمكنك الحصول على مفتاح API من لوحة تحكم TAP
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCheckApiKey} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              جاري التحقق...
            </>
          ) : (
            "تحقق من مفتاح API الآن"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TapApiChecker;
