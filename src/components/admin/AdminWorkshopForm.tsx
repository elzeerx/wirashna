
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface AdminWorkshopFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AdminWorkshopForm = ({ initialData, onSubmit, onCancel }: AdminWorkshopFormProps) => {
  const isEditMode = !!initialData;
  
  // Initialize form with default values or initial data
  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      longDescription: initialData?.longDescription || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      venue: initialData?.venue || "",
      location: initialData?.location || "",
      availableSeats: initialData?.availableSeats || 0,
      totalSeats: initialData?.totalSeats || 0,
      price: initialData?.price || "",
      instructor: initialData?.instructor || "",
      instructorBio: initialData?.instructorBio || "",
      image: initialData?.image || "",
    },
  });

  const handleSubmit = (data: any) => {
    // If in edit mode, preserve the ID
    if (isEditMode) {
      data.id = initialData.id;
    } else {
      // For new workshops, generate a dummy ID (in a real app, the backend would do this)
      data.id = Date.now().toString();
    }
    
    // Convert numeric string inputs to numbers
    data.availableSeats = Number(data.availableSeats);
    data.totalSeats = Number(data.totalSeats);
    
    // Add default gallery if not provided
    if (!data.gallery) {
      data.gallery = [data.image];
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الورشة</FormLabel>
              <FormControl>
                <Input {...field} placeholder="أدخل عنوان الورشة" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف مختصر</FormLabel>
              <FormControl>
                <Input {...field} placeholder="وصف مختصر للورشة" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف مفصل</FormLabel>
              <FormControl>
                <textarea 
                  {...field} 
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="وصف مفصل للورشة" 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التاريخ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: ١٥ مايو ٢٠٢٥" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوقت</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: ٥:٠٠ مساءًا" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدينة</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: الكويت، دبي، الرياض" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان التفصيلي</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: فندق الشيراتون، قاعة الفردوس" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="availableSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المقاعد المتاحة</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalSeats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إجمالي المقاعد</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: ١٢٠ دينار كويتي" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المدرب</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="اسم المدرب" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رابط الصورة الرئيسية</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="أدخل رابط الصورة" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instructorBio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة عن المدرب</FormLabel>
              <FormControl>
                <textarea 
                  {...field} 
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="نبذة عن المدرب" 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 space-x-reverse pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit" className="bg-[#512b81] hover:bg-[#512b81]/90">
            {isEditMode ? "حفظ التغييرات" : "إضافة الورشة"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminWorkshopForm;
