
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormSubmission } from "@/hooks/useFormSubmission";

const addUserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  role: z.enum(['admin', 'supervisor', 'subscriber'])
});

type AddUserForm = z.infer<typeof addUserSchema>;

export function AddUserDialog({ onUserAdded }: { onUserAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddUserForm>({
    email: '',
    full_name: '',
    role: 'subscriber'
  });
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: '',
      full_name: '',
      role: 'subscriber'
    }
  });

  const { handleSubmit, isLoading } = useFormSubmission({
    onSubmit: async (data: AddUserForm) => {
      // First create the auth user
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: Math.random().toString(36).slice(-12),
        options: {
          data: {
            full_name: data.full_name,
          },
        }
      });

      if (signUpError) throw signUpError;

      // Then update the user profile
      // First get the user ID by email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', authData.user?.id)
        .single();

      if (userError) throw userError;

      // Now update the profile with the correct ID
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          role: data.role,
          is_admin: data.role === 'admin'
        })
        .eq('id', userData.id);

      if (profileError) throw profileError;

      setIsOpen(false);
      onUserAdded();
      toast({
        title: "تم إضافة المستخدم بنجاح",
        description: "تم إرسال بريد إلكتروني للمستخدم لتعيين كلمة المرور",
      });
    },
    errorMessage: "فشل في إضافة المستخدم",
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="example@domain.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              الاسم الكامل
            </label>
            <Input
              required
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="الاسم الكامل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              الدور
            </label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'supervisor' | 'subscriber') =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="supervisor">مشرف</SelectItem>
                <SelectItem value="subscriber">مشترك</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
