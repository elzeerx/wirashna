
import { CreditCard } from "lucide-react";

type PaymentSectionProps = {
  workshopPrice: number;
};

const PaymentSection = ({
  workshopPrice
}: PaymentSectionProps) => {
  return <div className="py-4">
      <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between font-bold">
          <span>المجموع</span>
          <span>{workshopPrice} د.ك</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <CreditCard size={18} />
        <span>طريقة الدفع: بطاقة ائتمان (كي نت / ماستركارد / فيزا)</span>
      </div>

      <div className="flex justify-center">
        <img 
          alt="Payment methods" 
          src="/lovable-uploads/9acf5425-9eca-4aa7-aa10-99bb75b7b7ad.png" 
          className="h-8 max-w-full object-contain mx-auto"
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "https://via.placeholder.com/200x50?text=Payment+Methods";
            imgElement.alt = "Payment methods placeholder";
          }}
        />
      </div>
    </div>;
};

export default PaymentSection;
