
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, RotateCcw, Zap } from "lucide-react";

interface RepairActionsProps {
  isLoading: boolean;
  selectedWorkshopId: string;
  cleanupCompleted: boolean;
  recalculationCompleted: boolean;
  handleCleanupRegistrations: () => Promise<void>;
  handleRecalculateSeats: () => Promise<void>;
  handleRepairAll: () => Promise<void>;
}

const RepairActions = ({
  isLoading,
  selectedWorkshopId,
  cleanupCompleted,
  recalculationCompleted,
  handleCleanupRegistrations,
  handleRecalculateSeats,
  handleRepairAll
}: RepairActionsProps) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={handleCleanupRegistrations}
        disabled={isLoading || !selectedWorkshopId}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        تنظيف التسجيلات الفاشلة
        {cleanupCompleted && <Check className="h-4 w-4 text-green-500" />}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleRecalculateSeats}
        disabled={isLoading || !selectedWorkshopId}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        إعادة حساب المقاعد المتاحة
        {recalculationCompleted && <Check className="h-4 w-4 text-green-500" />}
      </Button>
      
      <Button
        onClick={handleRepairAll}
        disabled={isLoading || !selectedWorkshopId}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        إصلاح شامل للورشة
      </Button>
    </>
  );
};

export default RepairActions;
