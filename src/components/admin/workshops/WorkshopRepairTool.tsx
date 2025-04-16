
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import WorkshopSelector from "./workshop-repair/WorkshopSelector";
import OperationAlerts from "./workshop-repair/OperationAlerts";
import RepairDescription from "./workshop-repair/RepairDescription";
import RepairActions from "./workshop-repair/RepairActions";
import { useWorkshopRepair } from "./workshop-repair/hooks/useWorkshopRepair"; // Fix import path

interface WorkshopRepairToolProps {
  workshopId?: string;
}

const WorkshopRepairTool = ({ workshopId }: WorkshopRepairToolProps) => {
  const {
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
  } = useWorkshopRepair(workshopId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>أداة إصلاح الورش</CardTitle>
        <CardDescription>
          استخدم هذه الأداة لإصلاح مشاكل بيانات الورش وتنظيف التسجيلات وإعادة حساب المقاعد
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RepairDescription />
        
        <OperationAlerts operationResults={operationResults} />

        <WorkshopSelector 
          workshops={workshops}
          selectedWorkshopId={selectedWorkshopId}
          setSelectedWorkshopId={setSelectedWorkshopId}
          isLoading={isLoading}
          workshopId={workshopId}
          autoCleanup={autoCleanup}
          setAutoCleanup={setAutoCleanup}
        />
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <RepairActions 
          isLoading={isLoading}
          selectedWorkshopId={selectedWorkshopId}
          cleanupCompleted={cleanupCompleted}
          recalculationCompleted={recalculationCompleted}
          handleCleanupRegistrations={handleCleanupRegistrations}
          handleRecalculateSeats={handleRecalculateSeats}
          handleRepairAll={handleRepairAll}
        />
      </CardFooter>
    </Card>
  );
};

export default WorkshopRepairTool;
