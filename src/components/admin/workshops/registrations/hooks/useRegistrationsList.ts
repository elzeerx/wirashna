
import { useState, useEffect } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchWorkshopRegistrations, 
  updateRegistrationStatus, 
  deleteRegistration, 
  resetRegistration 
} from "@/services/workshops";

export const useRegistrationsList = (workshopId: string) => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (isProcessing) return;
    setSelectedRegistration(registration);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRegistration = (registration: WorkshopRegistration) => {
    if (isProcessing) return;
    setSelectedRegistration(registration);
    setIsDeleteDialogOpen(true);
  };

  const handleResetRegistration = (registration: WorkshopRegistration) => {
    if (isProcessing) return;
    setSelectedRegistration(registration);
    setIsResetDialogOpen(true);
  };

  const handleUpdateRegistration = async (registrationId: string, data: Partial<WorkshopRegistration>) => {
    if (isProcessing) return false;
    
    try {
      setIsProcessing(true);
      await updateRegistrationStatus(registrationId, data);
      
      // Update the local registrations list
      const updatedRegistrations = registrations.map(reg => 
        reg.id === registrationId ? { ...reg, ...data } : reg
      );
      
      setRegistrations(updatedRegistrations as WorkshopRegistration[]);
      
      toast({
        title: "تم تحديث التسجيل بنجاح",
        description: "تم تحديث بيانات التسجيل بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        title: "خطأ في تحديث التسجيل",
        description: "حدث خطأ أثناء تحديث بيانات التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveRegistration = async () => {
    if (!selectedRegistration || isProcessing) return false;
    
    try {
      setIsProcessing(true);
      await deleteRegistration(selectedRegistration.id);
      
      // Update the local registrations list
      const updatedRegistrations = registrations.filter(reg => reg.id !== selectedRegistration.id);
      setRegistrations(updatedRegistrations);
      
      toast({
        title: "تم حذف التسجيل بنجاح",
        description: "تم حذف التسجيل من قاعدة البيانات",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "خطأ في حذف التسجيل",
        description: "حدث خطأ أثناء حذف التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleResetConfirmation = async () => {
    if (!selectedRegistration || isProcessing) return false;
    
    try {
      setIsProcessing(true);
      await resetRegistration(selectedRegistration.id);
      
      // Update the local registrations list with proper type casting
      const updatedRegistrations = registrations.map(reg => 
        reg.id === selectedRegistration.id ? { 
          ...reg, 
          status: 'canceled' as const, 
          payment_status: 'failed' as const,
          admin_notes: 'Reset by admin to allow re-registration' 
        } : reg
      );
      
      setRegistrations(updatedRegistrations);
      
      toast({
        title: "تم إعادة ضبط التسجيل بنجاح",
        description: "يمكن للمستخدم الآن التسجيل في الورشة مرة أخرى",
      });
      
      return true;
    } catch (error) {
      console.error("Error resetting registration:", error);
      toast({
        title: "خطأ في إعادة ضبط التسجيل",
        description: "حدث خطأ أثناء إعادة ضبط التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
      setIsResetDialogOpen(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setSearchQuery("");
  };

  return {
    registrations,
    filteredRegistrations,
    isLoading,
    isProcessing,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedRegistration,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isResetDialogOpen,
    setIsResetDialogOpen,
    handleEditRegistration,
    handleDeleteRegistration,
    handleResetRegistration,
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetConfirmation,
    resetFilters
  };
};
