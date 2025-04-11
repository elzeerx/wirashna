
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageSection } from "@/types/page";
import { FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageElementEditorProps {
  element: PageSection;
  onUpdate: (updatedElement: PageSection) => void;
}

const PageElementEditor = ({ element, onUpdate }: PageElementEditorProps) => {
  const [localElement, setLocalElement] = useState<PageSection>(element);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setLocalElement(element);
  }, [element]);

  const handleTextChange = (value: string) => {
    setLocalElement({
      ...localElement,
      content: value
    });
    onUpdate({
      ...localElement,
      content: value
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = {
      ...localElement.settings,
      [key]: value
    };
    
    setLocalElement({
      ...localElement,
      settings: updatedSettings
    });
    
    onUpdate({
      ...localElement,
      settings: updatedSettings
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `page-images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setLocalElement({
        ...localElement,
        content: publicUrl
      });
      
      onUpdate({
        ...localElement,
        content: publicUrl
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">تعديل العنصر</h3>
      
      {/* Element Type Display */}
      <div className="flex items-center bg-gray-50 p-2 rounded-md">
        <span className="text-sm font-medium">نوع العنصر:</span>
        <span className="text-sm ms-2">
          {localElement.type === 'heading' ? 'عنوان' : 
           localElement.type === 'text' ? 'نص' : 
           localElement.type === 'image' ? 'صورة' : 
           localElement.type === 'spacer' ? 'مساحة فارغة' : 
           localElement.type}
        </span>
      </div>
      
      {/* Element Content Editor */}
      {localElement.type === 'heading' && (
        <div className="space-y-2">
          <Label htmlFor="heading-content">محتوى العنوان</Label>
          <Input
            id="heading-content"
            value={localElement.content}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="أدخل نص العنوان"
          />
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="heading-level">مستوى العنوان</Label>
            <Select
              value={localElement.settings?.level || 'h2'}
              onValueChange={(value) => handleSettingChange('level', value)}
            >
              <SelectTrigger id="heading-level">
                <SelectValue placeholder="اختر مستوى العنوان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">عنوان رئيسي (H1)</SelectItem>
                <SelectItem value="h2">عنوان فرعي (H2)</SelectItem>
                <SelectItem value="h3">عنوان فرعي (H3)</SelectItem>
                <SelectItem value="h4">عنوان فرعي (H4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {localElement.type === 'text' && (
        <div className="space-y-2">
          <Label htmlFor="text-content">محتوى النص</Label>
          <Textarea
            id="text-content"
            value={localElement.content}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="أدخل النص هنا..."
            rows={6}
          />
        </div>
      )}
      
      {localElement.type === 'image' && (
        <div className="space-y-4">
          {localElement.content && (
            <div className="border rounded-md overflow-hidden">
              <img
                src={localElement.content}
                alt="Preview"
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="image-upload">الصورة</Label>
            <div className="flex items-center justify-center bg-gray-50 border border-dashed rounded-md p-4">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <FileUp className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">اختر صورة للتحميل</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && <p className="text-sm text-gray-500">جاري تحميل الصورة...</p>}
          </div>
          
          {localElement.content && (
            <div className="space-y-2">
              <Label htmlFor="image-alt">النص البديل للصورة</Label>
              <Input
                id="image-alt"
                value={localElement.settings?.alt || ''}
                onChange={(e) => handleSettingChange('alt', e.target.value)}
                placeholder="وصف الصورة للقارئات الشاشة"
              />
            </div>
          )}
        </div>
      )}
      
      {localElement.type === 'spacer' && (
        <div className="space-y-2">
          <Label htmlFor="spacer-height">ارتفاع المساحة الفارغة</Label>
          <Select
            value={localElement.settings?.size || 'medium'}
            onValueChange={(value) => handleSettingChange('size', value)}
          >
            <SelectTrigger id="spacer-height">
              <SelectValue placeholder="اختر حجم المساحة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">صغير</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="large">كبير</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default PageElementEditor;
