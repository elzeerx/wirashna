
import { useState, useEffect } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { fetchWorkshopRegistrations, updateRegistrationStatus, deleteRegistration, resetRegistration } from "@/services/workshops";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import EditRegistrationDialog from "../EditRegistrationDialog";
import DeleteRegistrationDialog from "../DeleteRegistrationDialog";
import RegistrationFilters from "./RegistrationFilters";
import RegistrationsTable from "./RegistrationsTable";

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
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
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

  const handleResetRegistration = (registration: WorkshopRegistration) => {
    setSelectedRegistration(registration);
    setIsResetDialogOpen(true);
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

  const handleResetConfirmation = async () => {
    if (!selectedRegistration) return false;
    
    try {
      await resetRegistration(selectedRegistration.id);
      
      // Update the local registrations list
      const updatedRegistrations = registrations.map(reg => 
        reg.id === selectedRegistration.id ? { 
          ...reg, 
          status: 'canceled', 
          payment_status: 'failed',
          admin_notes: 'Reset by admin to allow re-registration' 
        } : reg
      );
      
      setRegistrations(updatedRegistrations);
      
      toast({
        title: "تم إعادة ضبط التسجيل بنجاح",
        description: "يمكن للمستخدم الآن التسجيل في الورشة مرة أخرى",
      });
      
      setIsResetDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error resetting registration:", error);
      toast({
        title: "خطأ في إعادة ضبط التسجيل",
        description: "حدث خطأ أثناء إعادة ضبط التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setSearchQuery("");
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
              onClick={resetFilters}
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
          <RegistrationFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            resetFilters={resetFilters}
          />

          <RegistrationsTable
            registrations={filteredRegistrations}
            onEdit={handleEditRegistration}
            onDelete={handleDeleteRegistration}
            onReset={handleResetRegistration}
          />
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

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>إعادة ضبط التسجيل</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء سيقوم بتغيير حالة تسجيل المشارك إلى "ملغي" وحالة الدفع إلى "فشل"، مما يسمح له بإعادة التسجيل في الورشة مرة أخرى.
              هل أنت متأكد من المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirmation}>تأكيد</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default WorkshopRegistrationsList;
