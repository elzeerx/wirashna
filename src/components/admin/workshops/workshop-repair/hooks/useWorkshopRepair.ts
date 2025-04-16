
import { useState } from 'react';
import { useWorkshopLoad } from './useWorkshopLoad';
import { useRepairOperations } from './useRepairOperations';

export const useWorkshopRepair = (workshopId?: string) => {
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [cleanupCompleted, setCleanupCompleted] = useState(false);
  const [recalculationCompleted, setRecalculationCompleted] = useState(false);

  const {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading
  } = useWorkshopLoad(workshopId);

  const {
    isProcessing,
    operationResults,
    handleCleanupRegistrations: baseHandleCleanup,
    handleRecalculateSeats: baseHandleRecalculate,
    handleRepairAll: baseHandleRepairAll
  } = useRepairOperations(selectedWorkshopId, setCleanupCompleted, setRecalculationCompleted);

  // Wrap the handlers with the current workshop ID
  const handleCleanupRegistrations = async () => {
    if (!selectedWorkshopId) return;
    await baseHandleCleanup(selectedWorkshopId, autoCleanup);
  };

  const handleRecalculateSeats = async () => {
    if (!selectedWorkshopId) return;
    await baseHandleRecalculate(selectedWorkshopId);
  };

  const handleRepairAll = async () => {
    if (!selectedWorkshopId) return;
    await baseHandleRepairAll();
  };

  return {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading: isLoading || isProcessing,
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
