
import { CreditCard } from "lucide-react";

type PaymentSectionProps = {
  workshopPrice: number;
};

const PaymentSection = ({ workshopPrice }: PaymentSectionProps) => {
  const VAT_RATE = 0.05; // 5% VAT
  const vatAmount = workshopPrice * VAT_RATE;
  const total = workshopPrice + vatAmount;

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>سعر الورشة</span>
          <span>{workshopPrice} د.ك</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>ضريبة القيمة المضافة</span>
          <span>{vatAmount} د.ك</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>المجموع</span>
          <span>{total} د.ك</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <CreditCard size={18} />
        <span>طريقة الدفع: بطاقة ائتمان (كي نت / ماستركارد / فيزا)</span>
      </div>

      <img 
        src="/tap-payment-methods.png" 
        alt="Payment methods"
        className="h-8"
      />
    </div>
  );
};

export default PaymentSection;
