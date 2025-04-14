
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditRegistrationDialog from "../EditRegistrationDialog";
import DeleteRegistrationDialog from "../DeleteRegistrationDialog";
import RegistrationFilters from "./RegistrationFilters";
import RegistrationsTable from "./RegistrationsTable";
import ResetRegistrationDialog from "./ResetRegistrationDialog";
import { useRegistrationsList } from "./hooks/useRegistrationsList";
import { Suspense, useCallback } from "react";
import { WorkshopRegistration } from "@/types/supabase";

interface WorkshopRegistrationsListProps {
  workshopId: string;
}

const WorkshopRegistrationsList = ({ workshopId }: WorkshopRegistrationsListProps) => {
  const {
    filteredRegistrations,
    isLoading,
    isProcessing,
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
    handleResetRegistration,
    handleUpdateRegistration,
    handleRemoveRegistration,
    handleResetConfirmation,
    resetFilters
  } = useRegistrationsList(workshopId);

  // Memoize the event handlers with useCallback for better performance
  const handleTableEditRegistration = useCallback((registration) => {
    handleEditRegistration(registration);
  }, [handleEditRegistration]);

  const handleTableDeleteRegistration = useCallback((registration) => {
    handleDeleteRegistration(registration);
  }, [handleDeleteRegistration]);

  const handleTableResetRegistration = useCallback((registration) => {
    handleResetRegistration(registration);
  }, [handleResetRegistration]);

  // Handler for the EditRegistrationDialog that adapter to the expected signature
  const handleEditSubmit = async (data: Partial<WorkshopRegistration>) => {
    if (!selectedRegistration) return false;
    return await handleUpdateRegistration(selectedRegistration.id, data);
  };

  // Handler for the DeleteRegistrationDialog that adapts to expected signature
  const handleDeleteSubmit = async () => {
    if (!selectedRegistration) return false;
    return await handleRemoveRegistration(selectedRegistration.id);
  };

  // Handler for the ResetRegistrationDialog that adapts to expected signature
  const handleResetSubmit = async () => {
    if (!selectedRegistration) return false;
    return await handleResetConfirmation(selectedRegistration.id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>التسجيلات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="wirashna-loader"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>التسجيلات ({filteredRegistrations.length})</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={isProcessing}
            >
              إعادة ضبط الفلتر
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          إدارة تسجيلات المشاركين في الورشة
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className={`space-y-4 ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}>
          <RegistrationFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            resetFilters={resetFilters}
          />

          <Suspense fallback={<div className="flex justify-center py-8"><div className="wirashna-loader"></div></div>}>
            <RegistrationsTable
              registrations={filteredRegistrations}
              onEdit={handleTableEditRegistration}
              onDelete={handleTableDeleteRegistration}
              onReset={handleTableResetRegistration}
            />
          </Suspense>
        </div>
        
        {isProcessing && (
          <div className="fixed inset-0 bg-background/20 flex items-center justify-center z-50">
            <div className="wirashna-loader"></div>
          </div>
        )}
      </CardContent>
      
      {/* Dialogs - Only render when needed */}
      {isEditDialogOpen && (
        <EditRegistrationDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          registration={selectedRegistration}
          onSubmit={handleEditSubmit}
        />
      )}
      
      {isDeleteDialogOpen && (
        <DeleteRegistrationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          registration={selectedRegistration}
          onDelete={handleDeleteSubmit}
        />
      )}

      {isResetDialogOpen && (
        <ResetRegistrationDialog
          isOpen={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
          registration={selectedRegistration}
          onReset={handleResetSubmit}
        />
      )}
    </Card>
  );
};

export default WorkshopRegistrationsList;
