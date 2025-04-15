
import { z } from "zod";
import { User, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "الرجاء إدخال الاسم الكامل" }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح" }),
  phone: z.string().min(8, { message: "الرجاء إدخال رقم هاتف صحيح" }),
});

export type UserFormData = z.infer<typeof formSchema>;

type UserDetailsFormProps = {
  defaultValues: UserFormData;
  readOnlyEmail?: boolean;
  onSubmit: (values: UserFormData) => void;
  isSubmitting: boolean;
  submitButtonContent: React.ReactNode;
};

const UserDetailsForm = ({
  defaultValues,
  readOnlyEmail = false,
  onSubmit,
  isSubmitting,
  submitButtonContent,
}: UserDetailsFormProps) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-semibold mb-6">تفاصيل الدفع</h3>
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <div className="flex">
                  <User size={18} className="absolute mt-3 mr-3 text-gray-400" />
                  <Input 
                    className="pr-10 bg-gray-50" 
                    placeholder="أدخل اسمك الكامل" 
                    {...field} 
                  />
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
                  <Input 
                    className="pr-10 bg-gray-50" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...field} 
                    readOnly={readOnlyEmail} 
                  />
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
                  <Input 
                    className="pr-10 bg-gray-50" 
                    placeholder="00965xxxxxxxx" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {submitButtonContent}
      </form>
    </Form>
  );
};

export default UserDetailsForm;
