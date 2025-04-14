
import { useState, useCallback } from "react";
import { WorkshopRegistration } from "@/types/supabase";

export const useRegistrationDialogs = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<WorkshopRegistration | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Optimize handlers to prevent unnecessary re-renders
  const handleEditRegistration = useCallback((registration: WorkshopRegistration) => {
    // Close any other open dialogs first to prevent UI conflicts
    setIsDeleteDialogOpen(false);
    setIsResetDialogOpen(false);
    
    // Set the selected registration and open the edit dialog
    setSelectedRegistration(registration);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteRegistration = useCallback((registration: WorkshopRegistration) => {
    // Close any other open dialogs first to prevent UI conflicts
    setIsEditDialogOpen(false);
    setIsResetDialogOpen(false);
    
    // Set the selected registration and open the delete dialog
    setSelectedRegistration(registration);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleResetRegistration = useCallback((registration: WorkshopRegistration) => {
    // Close any other open dialogs first to prevent UI conflicts
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    
    // Set the selected registration and open the reset dialog
    setSelectedRegistration(registration);
    setIsResetDialogOpen(true);
  }, []);

  return {
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
  };
};
