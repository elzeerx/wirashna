
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

interface EditRegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  registration: WorkshopRegistration | null;
  onSubmit: (data: Partial<WorkshopRegistration>) => Promise<boolean>;
}

const EditRegistrationDialog = ({
  isOpen,
  onOpenChange,
  registration,
  onSubmit
}: EditRegistrationDialogProps) => {
  const [formData, setFormData] = useState<Partial<WorkshopRegistration>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form data when dialog opens with new registration
  useEffect(() => {
    if (isOpen && registration) {
      setFormData({
        full_name: registration.full_name,
        email: registration.email,
        phone: registration.phone || "",
        notes: registration.notes || "",
        admin_notes: registration.admin_notes || "",
        status: registration.status,
        payment_status: registration.payment_status
      });
    }
    
    // Reset submission state when dialog closes
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen, registration]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!registration || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting registration update:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث التسجيل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>تعديل بيانات التسجيل</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم</Label>
              <Input
                id="full_name"
                value={formData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">تم التأكيد</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="canceled">ملغي</SelectItem>
                    <SelectItem value="attended">حضر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_status">حالة الدفع</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => handleChange("payment_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="unpaid">غير مدفوع</SelectItem>
                    <SelectItem value="refunded">تم الإرجاع</SelectItem>
                    <SelectItem value="failed">فشل الدفع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات المشارك</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin_notes">ملاحظات المدير</Label>
              <Textarea
                id="admin_notes"
                value={formData.admin_notes || ""}
                onChange={(e) => handleChange("admin_notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRegistrationDialog;
