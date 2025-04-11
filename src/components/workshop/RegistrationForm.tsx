
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
};

const RegistrationForm = ({ compact = false }: RegistrationFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: "credit",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "تم تسجيل طلبك بنجاح",
      description: "سنتواصل معك قريبًا لتأكيد حجزك",
    });
    
    form.reset();
  }

  return (
    <>
      <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
      
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
                    <Input className="pr-10" type="email" placeholder="example@example.com" {...field} />
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
                      <option value="credit">بطاقة ائتمان</option>
                      <option value="bank">تحويل بنكي</option>
                      <option value="cash">نقداً عند الحضور</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full wirashna-btn-primary">
            تأكيد التسجيل
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
