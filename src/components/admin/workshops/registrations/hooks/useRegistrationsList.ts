
import { useCallback } from "react";
import { WorkshopRegistration } from "@/types/supabase";
import { useRegistrationsState } from "./useRegistrationsState";
import { useRegistrationsFilters } from "./useRegistrationsFilters";
import { useRegistrationDialogs } from "./useRegistrationDialogs";
import { useRegistrationOperations } from "./useRegistrationOperations";

export const useRegistrationsList = (workshopId: string) => {
  // Use our custom hooks to separate concerns
  const { 
    registrations, 
    setRegistrations,
    isLoading, 
    isProcessing, 
    setIsProcessing 
  } = useRegistrationsState(workshopId);
  
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
    handleResetRegistration
  } = useRegistrationDialogs();
  
  const {
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetConfirmation
  } = useRegistrationOperations(registrations, setRegistrations, setIsProcessing);

  // Wrapper functions to handle selected registration
  const handleUpdateSelectedRegistration = useCallback(
    (data: Partial<WorkshopRegistration>) => 
      selectedRegistration ? handleUpdateRegistration(selectedRegistration.id, data) : Promise.resolve(false),
    [selectedRegistration, handleUpdateRegistration]
  );

  const handleRemoveSelectedRegistration = useCallback(
    () => selectedRegistration ? handleRemoveRegistration(selectedRegistration.id) : Promise.resolve(false),
    [selectedRegistration, handleRemoveRegistration]
  );

  const handleResetSelectedRegistration = useCallback(
    () => selectedRegistration ? handleResetConfirmation(selectedRegistration.id) : Promise.resolve(false),
    [selectedRegistration, handleResetConfirmation]
  );

  return {
    // State
    registrations,
    filteredRegistrations,
    isLoading,
    isProcessing,
    
    // Filters
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    resetFilters,
    
    // Selected registration & dialog states
    selectedRegistration,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isResetDialogOpen,
    setIsResetDialogOpen,
    
    // Event handlers
    handleEditRegistration,
    handleDeleteRegistration,
    handleResetRegistration,
    handleUpdateRegistration: handleUpdateSelectedRegistration,
    handleRemoveRegistration: handleRemoveSelectedRegistration,
    handleResetConfirmation: handleResetSelectedRegistration
  };
};
