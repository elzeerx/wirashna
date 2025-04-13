
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { registerForWorkshop } from "@/services/workshops";
import { createTapPayment } from "@/services/payment/paymentService";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "الرجاء إدخال الاسم الكامل" }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح" }),
  phone: z.string().min(8, { message: "الرجاء إدخال رقم هاتف صحيح" }),
  paymentMethod: z.enum(["credit", "bank", "cash"], {
    required_error: "الرجاء اختيار طريقة الدفع",
  }),
});

type RegistrationFormProps = {
  compact?: boolean;
  workshopId?: string;
  userEmail?: string;
  workshopPrice?: number;
};

const RegistrationForm = ({ 
  compact = false, 
  workshopId, 
  userEmail = "", 
  workshopPrice = 0 
}: RegistrationFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: userEmail,
      phone: "",
      paymentMethod: "credit",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!workshopId || !user) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى تسجيل الدخول والتأكد من اختيار ورشة صحيحة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Register for the workshop first
      const registration = await registerForWorkshop({
        workshop_id: workshopId,
        user_id: user.id,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        notes: `Payment Method: ${values.paymentMethod}`
      });
      
      // Handle payment based on the selected method
      if (values.paymentMethod === "credit" && workshopPrice > 0) {
        // Process online payment
        const paymentResult = await createTapPayment(
          workshopPrice,
          workshopId,
          user.id,
          {
            name: values.fullName,
            email: values.email,
            phone: values.phone
          }
        );
        
        if (paymentResult.success && paymentResult.redirect_url) {
          // Redirect to Tap payment page
          window.location.href = paymentResult.redirect_url;
          return;
        } else {
          toast({
            title: "خطأ في معالجة الدفع",
            description: paymentResult.error || "حدث خطأ أثناء إنشاء عملية الدفع",
            variant: "destructive",
          });
        }
      } else {
        // For bank transfer or cash, show success message and redirect
        toast({
          title: "تم تسجيل طلبك بنجاح",
          description: "سنتواصل معك قريبًا لتأكيد حجزك",
        });
        
        // Redirect to home page after successful registration
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {!compact && <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <div className="flex">
                    <User size={18} className="absolute mt-3 mr-3 text-gray-400" />
                    <Input className="pr-10" placeholder="أدخل اسمك الكامل" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Mail size={18} className="absolute mt-3 mr-3 text-gray-400" />
                    <Input className="pr-10" type="email" placeholder="example@example.com" {...field} readOnly={!!userEmail} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Phone size={18} className="absolute mt-3 mr-3 text-gray-400" />
                    <Input className="pr-10" placeholder="+965 XXXX XXXX" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الدفع</FormLabel>
                <FormControl>
                  <div className="flex">
                    <CreditCard size={18} className="absolute mt-3 mr-3 text-gray-400" />
                    <select
                      className="w-full py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                      {...field}
                    >
                      <option value="credit">بطاقة ائتمان (كي نت / ماستركارد / فيزا)</option>
                      <option value="bank">تحويل بنكي</option>
                      <option value="cash">نقداً عند الحضور</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full wirashna-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري التسجيل..." : "تأكيد التسجيل"}
          </Button>

          <p className="text-sm text-gray-500 text-center mt-4">
            بالضغط على تأكيد التسجيل، أنت توافق على 
            <Link to="/terms-conditions" className="text-wirashna-accent mx-1">الشروط والأحكام</Link>
            و
            <Link to="/privacy-policy" className="text-wirashna-accent mx-1">سياسة الخصوصية</Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default RegistrationForm;
