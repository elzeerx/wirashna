
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, RefreshCw, Wrench } from "lucide-react";
import { 
  findDuplicateRegistrations, 
  findOrphanedRegistrations,
  cleanupFailedRegistrations,
  fixRegistrationStatus
} from "@/services/workshops/registrationManagement";
import { recalculateWorkshopSeats } from "@/services/workshops/registrationSeats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface WorkshopRepairToolProps {
  workshopId: string;
}

const WorkshopRepairTool = ({ workshopId }: WorkshopRepairToolProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    duplicateRegistrations?: any[];
    orphanedRegistrations?: any[];
    stalledRegistrations?: any[];
    hasIssues: boolean;
  }>({ hasIssues: false });
  const { toast } = useToast();

  const handleAudit = async () => {
    setIsChecking(true);
    try {
      // Find duplicate registrations
      const duplicates = await findDuplicateRegistrations();
      
      // Find orphaned registrations (missing user profiles)
      const orphaned = await findOrphanedRegistrations();
      
      // Find stalled processing registrations
      const { data: stalled } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('workshop_id', workshopId)
        .eq('payment_status', 'processing')
        .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      
      setAuditResults({
        duplicateRegistrations: duplicates,
        orphanedRegistrations: orphaned,
        stalledRegistrations: stalled || [],
        hasIssues: 
          duplicates.length > 0 || 
          orphaned.length > 0 || 
          (stalled && stalled.length > 0)
      });
      
      if (duplicates.length === 0 && orphaned.length === 0 && (!stalled || stalled.length === 0)) {
        toast({
          title: "تدقيق ناجح",
          description: "لم يتم العثور على أي مشاكل في بيانات الورشة",
        });
      } else {
        toast({
          title: "تم العثور على مشاكل",
          description: `تم العثور على ${duplicates.length} تسجيل مكرر، ${orphaned.length} تسجيل بدون ملف مستخدم، و ${stalled?.length || 0} تسجيل معلق`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during audit:", error);
      toast({
        title: "خطأ في التدقيق",
        description: "حدث خطأ أثناء تدقيق بيانات الورشة",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleRepair = async () => {
    setIsRepairing(true);
    try {
      // Fix stalled registrations
      await fixRegistrationStatus(workshopId);
      
      // Clean up failed registrations
      await cleanupFailedRegistrations(workshopId);
      
      // Recalculate seats
      await recalculateWorkshopSeats(workshopId);
      
      toast({
        title: "تم إصلاح البيانات",
        description: "تم إصلاح بيانات الورشة بنجاح",
      });
      
      // Clear audit results after repair
      setAuditResults({ hasIssues: false });
      
      // Run audit again to confirm fixes
      await handleAudit();
    } catch (error) {
      console.error("Error during repair:", error);
      toast({
        title: "خطأ في الإصلاح",
        description: "حدث خطأ أثناء إصلاح بيانات الورشة",
        variant: "destructive",
      });
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>أدوات إصلاح بيانات الورشة</CardTitle>
        <CardDescription>
          تدقيق وإصلاح مشاكل التسجيلات في الورشة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleAudit} 
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                جاري التدقيق...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                تدقيق البيانات
              </>
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleRepair} 
            disabled={isRepairing || !auditResults.hasIssues}
            className="flex items-center gap-2"
          >
            {isRepairing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                جاري الإصلاح...
              </>
            ) : (
              <>
                <Wrench className="h-4 w-4" />
                إصلاح المشاكل
              </>
            )}
          </Button>
        </div>
        
        {auditResults.hasIssues && (
          <div className="space-y-4 border rounded-md p-4">
            <h3 className="text-lg font-medium">نتائج التدقيق</h3>
            
            {auditResults.duplicateRegistrations && auditResults.duplicateRegistrations.length > 0 && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  تم العثور على {auditResults.duplicateRegistrations.length} تسجيل مكرر. 
                  الإصلاح سيحتفظ بأحدث تسجيل ويحذف البقية.
                </AlertDescription>
              </Alert>
            )}
            
            {auditResults.orphanedRegistrations && auditResults.orphanedRegistrations.length > 0 && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  تم العثور على {auditResults.orphanedRegistrations.length} تسجيل بدون ملف مستخدم.
                  الإصلاح سيحاول إنشاء ملفات مستخدمين للتسجيلات المتأثرة.
                </AlertDescription>
              </Alert>
            )}
            
            {auditResults.stalledRegistrations && auditResults.stalledRegistrations.length > 0 && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  تم العثور على {auditResults.stalledRegistrations.length} تسجيل معلق.
                  الإصلاح سيغير حالة هذه التسجيلات إلى "فشل" ويعيد حساب المقاعد المتاحة.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {!isChecking && !auditResults.hasIssues && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              لم يتم العثور على أي مشاكل في بيانات الورشة
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkshopRepairTool;
