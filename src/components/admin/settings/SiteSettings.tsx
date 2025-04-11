
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUp, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteSettings, updateSiteSettings } from "@/services/settingsService";

interface SiteSettingsData {
  id?: string;
  site_name: string;
  site_description: string;
  contact_email: string;
  logo_url?: string;
  primary_color?: string;
  enable_registrations: boolean;
  footer_text?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

const defaultSettings: SiteSettingsData = {
  site_name: "ورشنا",
  site_description: "منصة الورش التدريبية الإبداعية",
  contact_email: "",
  enable_registrations: true,
  social_links: {
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: ""
  },
};

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSiteSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSiteSettings(settings);
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الموقع بنجاح."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ إعدادات الموقع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `site-logo_${Date.now()}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      setSettings({
        ...settings,
        logo_url: publicUrl
      });
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "خطأ في تحميل الشعار",
        description: "حدث خطأ أثناء تحميل شعار الموقع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setSettings({
      ...settings,
      logo_url: undefined
    });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings({
      ...settings,
      social_links: {
        ...settings.social_links,
        [platform]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="wirashna-loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إعدادات الموقع</h2>
        <Button 
          onClick={handleSaveSettings} 
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          <Save size={16} />
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">اسم الموقع</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  placeholder="اسم الموقع"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_description">وصف الموقع</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="وصف مختصر للموقع"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                <Switch
                  id="enable_registrations"
                  checked={settings.enable_registrations}
                  onCheckedChange={(checked) => setSettings({ ...settings, enable_registrations: checked })}
                />
                <Label htmlFor="enable_registrations">تفعيل التسجيل للمستخدمين الجدد</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المظهر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>شعار الموقع</Label>
                
                {settings.logo_url ? (
                  <div className="relative inline-block">
                    <img
                      src={settings.logo_url}
                      alt="شعار الموقع"
                      className="max-h-24 max-w-48 border rounded-md p-2"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-50 border border-dashed rounded-md p-8">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <FileUp className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">اختر شعار للتحميل</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}
                
                {isUploading && <p className="text-sm text-gray-500">جاري تحميل الشعار...</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary_color">اللون الرئيسي</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.primary_color || "#3B82F6"}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={settings.primary_color || "#3B82F6"}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footer_text">نص التذييل</Label>
                <Textarea
                  id="footer_text"
                  value={settings.footer_text || ""}
                  onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                  placeholder="نص يظهر في تذييل الموقع"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">البريد الإلكتروني للتواصل</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium">روابط التواصل الاجتماعي</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook_link">فيسبوك</Label>
                  <Input
                    id="facebook_link"
                    value={settings.social_links?.facebook || ""}
                    onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter_link">تويتر</Label>
                  <Input
                    id="twitter_link"
                    value={settings.social_links?.twitter || ""}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram_link">انستغرام</Label>
                  <Input
                    id="instagram_link"
                    value={settings.social_links?.instagram || ""}
                    onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube_link">يوتيوب</Label>
                  <Input
                    id="youtube_link"
                    value={settings.social_links?.youtube || ""}
                    onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات متقدمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800 text-sm">
                  تنبيه: تغيير الإعدادات المتقدمة قد يؤثر على أداء الموقع. يرجى الحذر عند تعديل هذه الإعدادات.
                </p>
              </div>
              
              {/* كود إعدادات متقدمة في المستقبل */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
