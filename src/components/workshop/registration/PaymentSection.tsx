
import { CreditCard } from "lucide-react";

type PaymentSectionProps = {
  workshopPrice: number;
};

const PaymentSection = ({ workshopPrice }: PaymentSectionProps) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={18} className="text-gray-500" />
        <span className="text-sm font-medium">طريقة الدفع: بطاقة ائتمان (كي نت / ماستركارد / فيزا)</span>
      </div>
      {workshopPrice > 0 ? (
        <div className="text-wirashna-accent font-bold text-lg">
          المبلغ: {workshopPrice} د.ك
        </div>
      ) : (
        <div className="text-green-600 font-bold">مجاناً</div>
      )}
    </div>
  );
};

export default PaymentSection;
