
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

      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/eaaf22e5-909c-451f-8c7c-3993be15b82c.png" 
          alt="Payment methods" 
          className="h-8 object-contain max-w-full"
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "https://via.placeholder.com/200x50?text=Payment+Methods";
            imgElement.alt = "Payment methods placeholder";
          }}
        />
      </div>
    </div>
  );
};

export default PaymentSection;
