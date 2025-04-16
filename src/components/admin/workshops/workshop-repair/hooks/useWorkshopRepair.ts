
import { useState } from 'react';
import { useWorkshopLoad } from './useWorkshopLoad';
import { useRepairOperations } from './useRepairOperations';

export const useWorkshopRepair = (workshopId?: string) => {
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [cleanupCompleted, setCleanupCompleted] = useState(false);
  const [recalculationCompleted, setRecalculationCompleted] = useState(false);

  // Load workshops
  const {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading
  } = useWorkshopLoad(workshopId);

  // Initialize repair operations
  const {
    operationResults,
    handleCleanupRegistrations,
    handleRecalculateSeats,
    handleRepairAll
  } = useRepairOperations(
    selectedWorkshopId,
    setCleanupCompleted,
    setRecalculationCompleted
  );

  return {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading,
    operationResults,
    cleanupCompleted,
    recalculationCompleted,
    autoCleanup,
    setAutoCleanup,
    handleCleanupRegistrations,
    handleRecalculateSeats,
    handleRepairAll
  };
};
