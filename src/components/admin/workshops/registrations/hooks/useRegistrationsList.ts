import { useState, useEffect, useCallback } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { fetchWorkshopRegistrations } from "@/services/workshops";
import { useRegistrationsFilters } from "./useRegistrationsFilters";
import { useRegistrationDialogs } from "./useRegistrationDialogs";
import { useRegistrationOperations } from "./useRegistrationOperations";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationsList = (workshopId: string) => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workshopClosed, setWorkshopClosed] = useState(false);
  const { toast } = useToast();

  // Get all filter related functionality
  const {
    filteredRegistrations,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    resetFilters
  } = useRegistrationsFilters(registrations);

  // Handle registration updates and refresh data when needed
  const handleRegistrationsUpdated = useCallback(async (
    updatedRegistration: WorkshopRegistration | null, 
    action: 'update' | 'delete' | 'reset'
  ) => {
    // If action is update and we have the updated registration, 
    // we can update it in the state without fetching again
    if (action === 'update' && updatedRegistration) {
      setRegistrations(prev => 
        prev.map(reg => reg.id === updatedRegistration.id ? updatedRegistration : reg)
      );
    } else {
      // For delete and reset actions, reload the entire list
      try {
        console.log("Reloading registrations after action:", action);
        const freshData = await fetchWorkshopRegistrations(workshopId);
        setRegistrations(freshData);
      } catch (error) {
        console.error("Error reloading workshop registrations:", error);
        toast({
          title: "خطأ في تحديث البيانات",
          description: "حدث خطأ أثناء تحديث البيانات. الرجاء تحديث الصفحة.",
          variant: "destructive",
        });
      }
    }
  }, [workshopId, toast]);

  // Get all operations related functionality
  const {
    isProcessing,
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetRegistration
  } = useRegistrationOperations(handleRegistrationsUpdated);

  // Get all dialog related functionality
  const {
    selectedRegistration,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isResetDialogOpen,
    setIsResetDialogOpen,
    handleEditRegistration,
    handleDeleteRegistration,
    handleResetRegistration: openResetDialog
  } = useRegistrationDialogs();

  // Check if workshop is closed
  useEffect(() => {
    const checkWorkshopStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('workshops')
          .select('registration_closed')
          .eq('id', workshopId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setWorkshopClosed(data.registration_closed === true);
        }
      } catch (error) {
        console.error("Error checking workshop status:", error);
      }
    };
    
    checkWorkshopStatus();
  }, [workshopId]);

  // Load initial data
  useEffect(() => {
    const loadRegistrations = async () => {
      if (!workshopId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWorkshopRegistrations(workshopId);
        
        // Process data to handle potential duplicates
        const uniqueRegistrations = new Map();
        
        // Group by user_id + workshop_id to identify duplicates
        data.forEach(reg => {
          const key = `${reg.user_id}-${reg.workshop_id}`;
          // If duplicate exists, keep the one with most recent update
          if (!uniqueRegistrations.has(key) || 
              new Date(reg.updated_at) > new Date(uniqueRegistrations.get(key).updated_at)) {
            uniqueRegistrations.set(key, reg);
          }
        });
        
        // Convert back to array
        const processedData = Array.from(uniqueRegistrations.values());
        
        setRegistrations(processedData);
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

  return {
    registrations,
    filteredRegistrations,
    isLoading,
    isProcessing,
    workshopClosed,
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
    handleResetRegistration: openResetDialog,
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetConfirmation: handleResetRegistration,
    resetFilters
  };
};
