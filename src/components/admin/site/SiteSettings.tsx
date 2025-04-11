
import { useState } from "react";
import { 
  Palette, Globe, Users, Shield, BellRing, FileText, 
  Mail, CreditCard, Cloud, Code, Save, Image 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsTabProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const SettingsTab = ({ children, title, description }: SettingsTabProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

const SiteSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSaveSettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">إعدادات الموقع</h1>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
              <TabsTrigger 
                value="general" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>إعدادات عامة</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>المظهر والعرض</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>المستخدمين</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>الأمان</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  <span>الإشعارات</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>البريد الإلكتروني</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>تحسين محركات البحث</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>التكاملات</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>المدفوعات</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="justify-start text-right px-3 py-2 hover:bg-gray-100 data-[state=active]:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  <span>إعدادات متقدمة</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 border rounded-lg p-6">
          <ScrollArea className="h-[600px]">
            <TabsContent value="general" className="mt-0 pr-4">
              <SettingsTab 
                title="الإعدادات العامة" 
                description="الإعدادات الأساسية للموقع"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">اسم الموقع</Label>
                    <Input id="siteName" defaultValue="ورشنا" placeholder="أدخل اسم الموقع" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">وصف الموقع</Label>
                    <textarea
                      id="siteDescription"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                      defaultValue="منصة ورشنا لإدارة وتسجيل الورش والفعاليات"
                      placeholder="أدخل وصفاً مختصراً للموقع"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">البريد الإلكتروني للتواصل</Label>
                    <Input 
                      id="contactEmail" 
                      type="email" 
                      defaultValue="contact@wirashna.com" 
                      placeholder="أدخل البريد الإلكتروني للتواصل" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">رابط الموقع</Label>
                    <Input 
                      id="siteUrl" 
                      defaultValue="https://wirashna.com" 
                      placeholder="أدخل رابط الموقع" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <Select defaultValue="Asia/Riyadh">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة الزمنية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="Asia/Qatar">الدوحة (GMT+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="maintenance" />
                    <Label htmlFor="maintenance">تفعيل وضع الصيانة</Label>
                  </div>
                </div>
              </SettingsTab>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 pr-4">
              <SettingsTab 
                title="المظهر والتصميم" 
                description="تخصيص مظهر وتصميم الموقع"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>شعار الموقع</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="h-20 w-40 flex items-center justify-center border rounded">
                        <Image className="h-12 w-12 text-gray-300" />
                      </div>
                      <Button variant="outline">تغيير الشعار</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>أيقونة الموقع (Favicon)</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="h-16 w-16 flex items-center justify-center border rounded">
                        <Image className="h-8 w-8 text-gray-300" />
                      </div>
                      <Button variant="outline">تغيير الأيقونة</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">اللون الرئيسي</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="primaryColor" 
                        defaultValue="#9b87f5" 
                        className="w-32" 
                      />
                      <div 
                        className="h-10 w-10 rounded-md border" 
                        style={{ backgroundColor: "#9b87f5" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">اللون الثانوي</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="accentColor" 
                        defaultValue="#7E69AB" 
                        className="w-32" 
                      />
                      <div 
                        className="h-10 w-10 rounded-md border" 
                        style={{ backgroundColor: "#7E69AB" }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rtl">اتجاه الموقع</Label>
                    <Select defaultValue="rtl">
                      <SelectTrigger id="rtl">
                        <SelectValue placeholder="اختر اتجاه الموقع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rtl">من اليمين إلى اليسار (RTL)</SelectItem>
                        <SelectItem value="ltr">من اليسار إلى اليمين (LTR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font">الخط الرئيسي</Label>
                    <Select defaultValue="tajawal">
                      <SelectTrigger id="font">
                        <SelectValue placeholder="اختر الخط الرئيسي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tajawal">Tajawal</SelectItem>
                        <SelectItem value="cairo">Cairo</SelectItem>
                        <SelectItem value="almarai">Almarai</SelectItem>
                        <SelectItem value="ibm">IBM Plex Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SettingsTab>
            </TabsContent>
            
            <TabsContent value="users" className="mt-0 pr-4">
              <SettingsTab 
                title="إعدادات المستخدمين" 
                description="إدارة إعدادات المستخدمين والصلاحيات"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="allowRegistration" defaultChecked />
                    <Label htmlFor="allowRegistration">السماح بالتسجيل</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="emailVerification" defaultChecked />
                    <Label htmlFor="emailVerification">تفعيل التحقق من البريد الإلكتروني</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="allowSocialLogin" defaultChecked />
                    <Label htmlFor="allowSocialLogin">السماح بتسجيل الدخول عبر منصات التواصل الاجتماعي</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultRole">الدور الافتراضي للمستخدمين الجدد</Label>
                    <Select defaultValue="subscriber">
                      <SelectTrigger id="defaultRole">
                        <SelectValue placeholder="اختر الدور الافتراضي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subscriber">مشترك</SelectItem>
                        <SelectItem value="contributor">مساهم</SelectItem>
                        <SelectItem value="editor">محرر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userApproval">سياسة قبول المستخدمين</Label>
                    <Select defaultValue="automatic">
                      <SelectTrigger id="userApproval">
                        <SelectValue placeholder="اختر سياسة قبول المستخدمين" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">قبول تلقائي</SelectItem>
                        <SelectItem value="manual">قبول يدوي</SelectItem>
                        <SelectItem value="email">بعد تأكيد البريد الإلكتروني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SettingsTab>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0 pr-4">
              <SettingsTab 
                title="الأمان" 
                description="إعدادات أمان الموقع"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="forceSsl" defaultChecked />
                    <Label htmlFor="forceSsl">إجبار استخدام HTTPS</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="enableCaptcha" defaultChecked />
                    <Label htmlFor="enableCaptcha">تفعيل reCAPTCHA لنماذج التسجيل</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">عدد محاولات تسجيل الدخول المسموح بها</Label>
                    <Input 
                      id="loginAttempts" 
                      type="number" 
                      defaultValue="5" 
                      placeholder="أدخل عدد المحاولات" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockoutTime">فترة الحظر بعد تجاوز محاولات تسجيل الدخول (بالدقائق)</Label>
                    <Input 
                      id="lockoutTime" 
                      type="number" 
                      defaultValue="30" 
                      placeholder="أدخل فترة الحظر بالدقائق" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">سياسة كلمة المرور</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger id="passwordPolicy">
                        <SelectValue placeholder="اختر سياسة كلمة المرور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">أساسية (6 أحرف على الأقل)</SelectItem>
                        <SelectItem value="medium">متوسطة (8 أحرف، حرف كبير وأرقام)</SelectItem>
                        <SelectItem value="strong">قوية (10 أحرف، أحرف كبيرة وصغيرة، أرقام ورموز)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SettingsTab>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 pr-4">
              <SettingsTab 
                title="الإشعارات" 
                description="إعدادات إشعارات الموقع"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="notifyAdmin" defaultChecked />
                    <Label htmlFor="notifyAdmin">إشعار المسؤول عند تسجيل مستخدم جديد</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="notifyWorkshopRegistration" defaultChecked />
                    <Label htmlFor="notifyWorkshopRegistration">إشعار المسؤول عند تسجيل ورشة جديدة</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="notifyContactForm" defaultChecked />
                    <Label htmlFor="notifyContactForm">إشعار المسؤول عند استلام رسالة من نموذج الاتصال</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="notifyComments" />
                    <Label htmlFor="notifyComments">إشعار المسؤول عند إضافة تعليق جديد</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="userNotificationEmail" defaultChecked />
                    <Label htmlFor="userNotificationEmail">إرسال إشعارات البريد الإلكتروني للمستخدمين</Label>
                  </div>
                </div>
              </SettingsTab>
            </TabsContent>
            
            <TabsContent value="email" className="mt-0 pr-4">
              <SettingsTab 
                title="البريد الإلكتروني" 
                description="إعدادات البريد الإلكتروني للموقع"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mailProvider">مزود خدمة البريد الإلكتروني</Label>
                    <Select defaultValue="smtp">
                      <SelectTrigger id="mailProvider">
                        <SelectValue placeholder="اختر مزود خدمة البريد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input 
                      id="smtpHost" 
                      defaultValue="smtp.example.com" 
                      placeholder="أدخل عنوان SMTP Host" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input 
                      id="smtpPort" 
                      defaultValue="587" 
                      placeholder="أدخل رقم المنفذ" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input 
                      id="smtpUsername" 
                      defaultValue="info@wirashna.com" 
                      placeholder="أدخل اسم المستخدم" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input 
                      id="smtpPassword" 
                      type="password" 
                      defaultValue="********" 
                      placeholder="أدخل كلمة المرور" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderName">اسم المرسل</Label>
                    <Input 
                      id="senderName" 
                      defaultValue="ورشنا" 
                      placeholder="أدخل اسم المرسل" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">بريد المرسل</Label>
                    <Input 
                      id="senderEmail" 
                      defaultValue="no-reply@wirashna.com" 
                      placeholder="أدخل بريد المرسل" 
                    />
                  </div>
                  
                  <Button variant="outline">اختبار إعدادات البريد الإلكتروني</Button>
                </div>
              </SettingsTab>
            </TabsContent>
            
            {/* Only showing a few tabs in detail for brevity */}
            {["seo", "integrations", "payments", "advanced"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0 pr-4">
                <SettingsTab 
                  title={`إعدادات ${tab === "seo" ? "تحسين محركات البحث" : 
                  tab === "integrations" ? "التكاملات" : 
                  tab === "payments" ? "المدفوعات" : "متقدمة"}`} 
                  description={`إدارة إعدادات ${tab === "seo" ? "تحسين محركات البحث" : 
                  tab === "integrations" ? "التكاملات" : 
                  tab === "payments" ? "المدفوعات" : "متقدمة"} للموقع`}
                >
                  <div className="py-20 flex items-center justify-center">
                    <p className="text-gray-500">يتم تطوير هذا القسم حالياً</p>
                  </div>
                </SettingsTab>
              </TabsContent>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
