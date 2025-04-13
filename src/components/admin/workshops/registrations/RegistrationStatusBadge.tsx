
import { Badge } from "@/components/ui/badge";

type StatusType = 'confirmed' | 'pending' | 'canceled' | 'attended';
type PaymentStatusType = 'paid' | 'processing' | 'unpaid' | 'refunded' | 'failed';

interface StatusBadgeProps {
  status: string;
  type: 'status' | 'payment';
}

const RegistrationStatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStatusBadgeVariant = (status: string, type: 'status' | 'payment') => {
    if (type === 'status') {
      switch (status) {
        case "confirmed": return "success";
        case "pending": return "warning";
        case "canceled": return "destructive";
        case "attended": return "default";
        default: return "secondary";
      }
    } else {
      switch (status) {
        case "paid": return "success";
        case "processing": return "warning";
        case "unpaid": return "secondary";
        case "refunded": return "destructive";
        case "failed": return "destructive";
        default: return "secondary";
      }
    }
  };

  const getStatusLabel = (status: string, type: 'status' | 'payment') => {
    if (type === 'status') {
      switch (status) {
        case "confirmed": return "تم التأكيد";
        case "pending": return "قيد الانتظار";
        case "canceled": return "ملغي";
        case "attended": return "حضر";
        default: return status;
      }
    } else {
      switch (status) {
        case "paid": return "مدفوع";
        case "processing": return "قيد المعالجة";
        case "unpaid": return "غير مدفوع";
        case "refunded": return "تم الإرجاع";
        case "failed": return "فشل الدفع";
        default: return status;
      }
    }
  };

  const variant = getStatusBadgeVariant(status, type);
  const label = getStatusLabel(status, type);
  
  return <Badge variant={variant as any}>{label}</Badge>;
};

export default RegistrationStatusBadge;
