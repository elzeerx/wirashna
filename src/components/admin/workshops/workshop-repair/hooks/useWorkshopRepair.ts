
import { useState } from 'react';
import { useWorkshopLoad } from './useWorkshopLoad';
import { useRepairOperations } from './useRepairOperations';

export const useWorkshopRepair = (workshopId?: string) => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(workshopId || "");
  const [autoCleanup, setAutoCleanup] = useState<boolean>(true);
  
  const { workshops, isLoading: isLoadingWorkshops } = useWorkshopLoad(workshopId);
  const {
    isProcessing,
    cleanupCompleted,
    recalculationCompleted,
    operationResults,
    handleCleanupRegistrations,
    handleRecalculateSeats
  } = useRepairOperations();

  const handleRepairAll = async () => {
    if (!selectedWorkshopId) return;
    
    await handleCleanupRegistrations(selectedWorkshopId, true);
    if (!operationResults?.success) return;
    
    await handleRecalculateSeats(selectedWorkshopId);
  };

  return {
    workshops,
    selectedWorkshopId,
    setSelectedWorkshopId,
    isLoading: isLoadingWorkshops || isProcessing,
    operationResults,
    cleanupCompleted,
    recalculationCompleted,
    autoCleanup,
    setAutoCleanup,
    handleCleanupRegistrations: () => handleCleanupRegistrations(selectedWorkshopId, autoCleanup),
    handleRecalculateSeats: () => handleRecalculateSeats(selectedWorkshopId),
    handleRepairAll
  };
};
