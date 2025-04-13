
import { useState, useEffect } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { fetchWorkshopRegistrations, updateRegistrationStatus, deleteRegistration } from "@/services/workshops";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Edit, Trash2, Eye, Filter } from "lucide-react";
import EditRegistrationDialog from "./EditRegistrationDialog";
import DeleteRegistrationDialog from "./DeleteRegistrationDialog";

interface WorkshopRegistrationsListProps {
  workshopId: string;
}

const WorkshopRegistrationsList = ({ workshopId }: WorkshopRegistrationsListProps) => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<WorkshopRegistration | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!workshopId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkshopRegistrations(workshopId);
        setRegistrations(data);
        setFilteredRegistrations(data);
      } catch (error) {
        console.error("Error loading workshop registrations:", error);
        toast({
          title: "خطأ في تحميل بيانات التسجيلات",
          description: "حدث خطأ أثناء تحميل بيانات التسجيلات. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, [workshopId, toast]);

  useEffect(() => {
    let result = [...registrations];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(reg => reg.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      result = result.filter(reg => reg.payment_status === paymentStatusFilter);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        reg =>
          reg.full_name.toLowerCase().includes(query) ||
          reg.email.toLowerCase().includes(query) ||
          (reg.phone && reg.phone.includes(query))
      );
    }
    
    setFilteredRegistrations(result);
  }, [registrations, statusFilter, paymentStatusFilter, searchQuery]);

  const handleEditRegistration = (registration: WorkshopRegistration) => {
    setSelectedRegistration(registration);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRegistration = (registration: WorkshopRegistration) => {
    setSelectedRegistration(registration);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateRegistration = async (registrationId: string, data: Partial<WorkshopRegistration>) => {
    try {
      await updateRegistrationStatus(registrationId, data);
      
      // Update the local registrations list
      const updatedRegistrations = registrations.map(reg => 
        reg.id === registrationId ? { ...reg, ...data } : reg
      );
      
      setRegistrations(updatedRegistrations);
      
      toast({
        title: "تم تحديث التسجيل بنجاح",
        description: "تم تحديث بيانات التسجيل بنجاح",
      });
      
      setIsEditDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        title: "خطأ في تحديث التسجيل",
        description: "حدث خطأ أثناء تحديث بيانات التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoveRegistration = async () => {
    if (!selectedRegistration) return false;
    
    try {
      await deleteRegistration(selectedRegistration.id);
      
      // Update the local registrations list
      const updatedRegistrations = registrations.filter(reg => reg.id !== selectedRegistration.id);
      setRegistrations(updatedRegistrations);
      
      toast({
        title: "تم حذف التسجيل بنجاح",
        description: "تم حذف التسجيل من قاعدة البيانات",
      });
      
      setIsDeleteDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "خطأ في حذف التسجيل",
        description: "حدث خطأ أثناء حذف التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "canceled": return "destructive";
      case "attended": return "default";
      default: return "secondary";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "processing": return "warning";
      case "unpaid": return "secondary";
      case "refunded": return "destructive";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  const renderStatusBadge = (status: string) => {
    const variant = getStatusBadgeVariant(status);
    let label;
    
    switch (status) {
      case "confirmed": label = "تم التأكيد"; break;
      case "pending": label = "قيد الانتظار"; break;
      case "canceled": label = "ملغي"; break;
      case "attended": label = "حضر"; break;
      default: label = status;
    }
    
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  const renderPaymentStatusBadge = (status: string) => {
    const variant = getPaymentStatusBadgeVariant(status);
    let label;
    
    switch (status) {
      case "paid": label = "مدفوع"; break;
      case "processing": label = "قيد المعالجة"; break;
      case "unpaid": label = "غير مدفوع"; break;
      case "refunded": label = "تم الإرجاع"; break;
      case "failed": label = "فشل الدفع"; break;
      default: label = status;
    }
    
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>التسجيلات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>التسجيلات ({filteredRegistrations.length})</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setPaymentStatusFilter("all");
                setSearchQuery("");
              }}
            >
              إعادة ضبط الفلتر
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          إدارة تسجيلات المشاركين في الورشة
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلتر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="confirmed">تم التأكيد</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="canceled">ملغي</SelectItem>
                <SelectItem value="attended">حضر</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلتر حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع حالات الدفع</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
                <SelectItem value="refunded">تم الإرجاع</SelectItem>
                <SelectItem value="failed">فشل الدفع</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>حالة الدفع</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.full_name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone || "—"}</TableCell>
                      <TableCell>{renderStatusBadge(registration.status)}</TableCell>
                      <TableCell>{renderPaymentStatusBadge(registration.payment_status)}</TableCell>
                      <TableCell>
                        <span title={new Date(registration.created_at).toLocaleString("ar")}>
                          {formatDistanceToNow(new Date(registration.created_at), { 
                            addSuffix: true,
                            locale: ar 
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRegistration(registration)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteRegistration(registration)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      {registrations.length === 0 
                        ? "لا توجد تسجيلات لهذه الورشة حتى الآن" 
                        : "لا توجد نتائج مطابقة لعوامل الفلترة المحددة"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      <EditRegistrationDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        registration={selectedRegistration}
        onSubmit={(data) => selectedRegistration && handleUpdateRegistration(selectedRegistration.id, data)}
      />
      
      <DeleteRegistrationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        registration={selectedRegistration}
        onDelete={handleRemoveRegistration}
      />
    </Card>
  );
};

export default WorkshopRegistrationsList;
