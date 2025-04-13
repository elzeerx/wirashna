
import { WorkshopRegistration } from "@/types/supabase";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import RegistrationStatusBadge from "./RegistrationStatusBadge";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface RegistrationsTableProps {
  registrations: WorkshopRegistration[];
  onEdit: (registration: WorkshopRegistration) => void;
  onDelete: (registration: WorkshopRegistration) => void;
}

const RegistrationsTable = ({ registrations, onEdit, onDelete }: RegistrationsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>حالة الدفع</TableHead>
            <TableHead>تاريخ التسجيل</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length > 0 ? (
            registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">{registration.full_name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.phone || "—"}</TableCell>
                <TableCell>
                  <RegistrationStatusBadge status={registration.status} type="status" />
                </TableCell>
                <TableCell>
                  <RegistrationStatusBadge status={registration.payment_status} type="payment" />
                </TableCell>
                <TableCell>
                  <span title={new Date(registration.created_at).toLocaleString("ar")}>
                    {formatDistanceToNow(new Date(registration.created_at), { 
                      addSuffix: true,
                      locale: ar 
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(registration)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => onDelete(registration)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                {registrations.length === 0 
                  ? "لا توجد تسجيلات لهذه الورشة حتى الآن" 
                  : "لا توجد نتائج مطابقة لعوامل الفلترة المحددة"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrationsTable;
