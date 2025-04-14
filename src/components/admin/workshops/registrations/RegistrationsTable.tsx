
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
import { memo } from "react";

interface RegistrationsTableProps {
  registrations: WorkshopRegistration[];
  onEdit: (registration: WorkshopRegistration) => void;
  onDelete: (registration: WorkshopRegistration) => void;
  onReset: (registration: WorkshopRegistration) => void;
}

// Memoize the component to prevent unnecessary re-renders
const RegistrationsTable = memo(({ 
  registrations, 
  onEdit, 
  onDelete,
  onReset
}: RegistrationsTableProps) => {
  // Format date for display using Gregorian calendar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      calendar: 'gregory', // Explicitly use Gregorian calendar
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Create handlers that don't require closure creation in the render loop
  const handleEdit = (registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(registration);
  };

  const handleDelete = (registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(registration);
  };

  const handleReset = (registration: WorkshopRegistration) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReset(registration);
  };

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
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                لا توجد تسجيلات لهذه الورشة
              </TableCell>
            </TableRow>
          ) : (
            registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.full_name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell dir="ltr">{registration.phone || "-"}</TableCell>
                <TableCell>{formatDate(registration.created_at)}</TableCell>
                <TableCell>
                  <RegistrationStatusBadge status={registration.status} type="status" />
                </TableCell>
                <TableCell>
                  <RegistrationStatusBadge paymentStatus={registration.payment_status} type="payment" />
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

RegistrationsTable.displayName = 'RegistrationsTable';

export default RegistrationsTable;
