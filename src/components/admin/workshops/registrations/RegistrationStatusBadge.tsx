
import { Badge } from "@/components/ui/badge";

type StatusType = 'confirmed' | 'pending' | 'canceled' | 'attended';
type PaymentStatusType = 'paid' | 'processing' | 'unpaid' | 'refunded' | 'failed';

interface StatusBadgeProps {
  status?: string;
  paymentStatus?: string;
  type?: 'status' | 'payment';
}

const RegistrationStatusBadge = ({ status, paymentStatus, type = 'status' }: StatusBadgeProps) => {
  // Determine which status to use based on the props
  const statusValue = type === 'status' ? status : paymentStatus;
  
  if (!statusValue) return null;
  
  const getStatusBadgeVariant = (value: string, statusType: 'status' | 'payment') => {
    if (statusType === 'status') {
      switch (value) {
        case "confirmed": return "success";
        case "pending": return "warning";
        case "canceled": return "destructive";
        case "attended": return "default";
        default: return "secondary";
      }
    } else {
      switch (value) {
        case "paid": return "success";
        case "processing": return "warning";
        case "unpaid": return "secondary";
        case "refunded": return "destructive";
        case "failed": return "destructive";
        default: return "secondary";
      }
    }
  };

  const getStatusLabel = (value: string, statusType: 'status' | 'payment') => {
    if (statusType === 'status') {
      switch (value) {
        case "confirmed": return "تم التأكيد";
        case "pending": return "قيد الانتظار";
        case "canceled": return "ملغي";
        case "attended": return "حضر";
        default: return value;
      }
    } else {
      switch (value) {
        case "paid": return "مدفوع";
        case "processing": return "قيد المعالجة";
        case "unpaid": return "غير مدفوع";
        case "refunded": return "تم الإرجاع";
        case "failed": return "فشل الدفع";
        default: return value;
      }
    }
  };

  const variant = getStatusBadgeVariant(statusValue, type);
  const label = getStatusLabel(statusValue, type);
  
  return <Badge variant={variant as any}>{label}</Badge>;
};

export default RegistrationStatusBadge;
