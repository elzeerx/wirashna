
import { MoreHorizontal, Edit, Trash2, RotateCcw } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WorkshopRegistration } from "@/types/supabase";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import { memo, useCallback } from "react";

interface RegistrationsTableProps {
  registrations: WorkshopRegistration[];
  onEdit: (registration: WorkshopRegistration) => void;
  onDelete: (registration: WorkshopRegistration) => void;
  onReset: (registration: WorkshopRegistration) => void;
  workshopClosed?: boolean;
}

// Memoize the table cell to prevent re-renders
const MemoizedTableCell = memo(TableCell);

// Memoize status badges
const MemoizedStatusBadge = memo(RegistrationStatusBadge);

// Memoize the entire component to prevent unnecessary re-renders
const RegistrationsTable = memo(({ 
  registrations, 
  onEdit, 
  onDelete,
  onReset,
  workshopClosed = false
}: RegistrationsTableProps) => {
  // Format date for display using memoization to avoid recalculating
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      calendar: 'gregory',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }, []);

  // Create handlers with useCallback
  const handleEdit = useCallback((registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(registration);
  }, [onEdit]);

  const handleDelete = useCallback((registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(registration);
  }, [onDelete]);

  const handleReset = useCallback((registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReset(registration);
  }, [onReset]);

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>تاريخ التسجيل</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>حالة الدفع</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length === 0 ? (
            <TableRow>
              <MemoizedTableCell colSpan={7} className="text-center py-6 text-gray-500">
                لا توجد تسجيلات لهذه الورشة
              </MemoizedTableCell>
            </TableRow>
          ) : (
            registrations.map((registration) => {
              // Determine if this row should be grayed out
              const isGrayedOut = workshopClosed;
              const rowClassName = isGrayedOut ? "opacity-60" : "";
              
              return (
                <TableRow key={registration.id} className={rowClassName}>
                  <MemoizedTableCell>{registration.full_name}</MemoizedTableCell>
                  <MemoizedTableCell>{registration.email}</MemoizedTableCell>
                  <MemoizedTableCell dir="ltr">{registration.phone || "-"}</MemoizedTableCell>
                  <MemoizedTableCell>{formatDate(registration.created_at)}</MemoizedTableCell>
                  <MemoizedTableCell>
                    <MemoizedStatusBadge status={registration.status} type="status" />
                  </MemoizedTableCell>
                  <MemoizedTableCell>
                    <MemoizedStatusBadge paymentStatus={registration.payment_status} type="payment" />
                  </MemoizedTableCell>
                  <MemoizedTableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleEdit(registration)}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleReset(registration)}>
                          <RotateCcw className="ml-2 h-4 w-4" />
                          إعادة ضبط التسجيل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleDelete(registration)}
                          className="text-red-600"
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </MemoizedTableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
});

RegistrationsTable.displayName = 'RegistrationsTable';

export default RegistrationsTable;
