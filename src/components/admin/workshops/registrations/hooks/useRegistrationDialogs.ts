
import { useState, useCallback } from "react";
import { WorkshopRegistration } from "@/types/supabase";

export const useRegistrationDialogs = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<WorkshopRegistration | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleEditRegistration = useCallback((registration: WorkshopRegistration) => {
    setSelectedRegistration(registration);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteRegistration = useCallback((registration: WorkshopRegistration) => {
    setSelectedRegistration(registration);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleResetRegistration = useCallback((registration: WorkshopRegistration) => {
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
