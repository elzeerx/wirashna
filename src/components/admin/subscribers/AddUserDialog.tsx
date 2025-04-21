
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddUserDialogProps {
  onUserAdded?: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "يجب أن يكون الاسم أكثر من حرفين",
  }),
  email: z.string().email({
    message: "البريد الإلكتروني غير صحيح",
  }),
  password: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
  phone: z.string().optional(),
});

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Instead of signup, use admin create user to avoid session switch
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: values.email,
          password: values.password,
          full_name: values.fullName,
          phone: values.phone || null,
          send_email: true
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: "تم إنشاء المستخدم بنجاح",
        description: "تم إرسال بريد إلكتروني للمستخدم مع معلومات تسجيل الدخول",
      });
      
      form.reset();
      setIsOpen(false);
      
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      let errorMessage = "حدث خطأ أثناء إنشاء المستخدم";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "البريد الإلكتروني مسجل بالفعل";
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد. سيتم إرسال بريد إلكتروني له تلقائياً.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستخدم" {...field} />
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
                    <Input type="email" placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
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
                    <Input placeholder="اختياري" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة المستخدم"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
