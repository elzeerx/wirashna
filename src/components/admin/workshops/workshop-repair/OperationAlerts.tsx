
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";

interface OperationAlertsProps {
  operationResults: { success: boolean; message: string } | null;
}

const OperationAlerts = ({ operationResults }: OperationAlertsProps) => {
  if (!operationResults) return null;

  return (
    <Alert variant={operationResults.success ? "default" : "destructive"}>
      {operationResults.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{operationResults.success ? "تمت العملية بنجاح" : "خطأ في العملية"}</AlertTitle>
      <AlertDescription>{operationResults.message}</AlertDescription>
    </Alert>
  );
};

export default OperationAlerts;
