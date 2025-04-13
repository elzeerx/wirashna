
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RegistrationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
  resetFilters: () => void;
}

const RegistrationFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  resetFilters
}: RegistrationFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="فلتر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="confirmed">تم التأكيد</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="canceled">ملغي</SelectItem>
            <SelectItem value="attended">حضر</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="فلتر حالة الدفع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع حالات الدفع</SelectItem>
            <SelectItem value="paid">مدفوع</SelectItem>
            <SelectItem value="processing">قيد المعالجة</SelectItem>
            <SelectItem value="unpaid">غير مدفوع</SelectItem>
            <SelectItem value="refunded">تم الإرجاع</SelectItem>
            <SelectItem value="failed">فشل الدفع</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RegistrationFilters;
