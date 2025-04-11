
import { useState } from "react";
import { 
  ArrowLeft, Save, Image, Type, Layout, PanelLeft, 
  PanelRight, Grid, List, Search, Plus, Edit, Trash, Eye, 
  Columns, Box, Heading, Paragraph, Link, Button as ButtonIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PageBuilder = () => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock page data - in real implementation this would come from API
  const pages = [
    { id: "home", title: "الصفحة الرئيسية", lastEdited: "2024-04-10" },
    { id: "about", title: "من نحن", lastEdited: "2024-04-08" },
    { id: "workshops", title: "الورش", lastEdited: "2024-04-05" },
    { id: "contact", title: "اتصل بنا", lastEdited: "2024-04-03" },
    { id: "terms", title: "الشروط والأحكام", lastEdited: "2024-03-28" },
    { id: "privacy", title: "سياسة الخصوصية", lastEdited: "2024-03-25" },
  ];

  // Filter pages based on search term
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPage = (pageId: string) => {
    setCurrentPage(pageId);
    toast({
      title: "تم فتح الصفحة للتحرير",
      description: `جاري تحميل محرر الصفحات لتحرير "${pages.find(p => p.id === pageId)?.title}"`,
    });
  };

  const handleSavePage = () => {
    toast({
      title: "تم حفظ التغييرات",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  const PageSelector = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="ابحث عن صفحة..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-3 pl-10"
        />
      </div>
      
      <div className="space-y-2">
        {filteredPages.length > 0 ? (
          filteredPages.map(page => (
            <Card key={page.id} className={`cursor-pointer transition-all ${currentPage === page.id ? 'border-wirashna-accent' : ''}`} onClick={() => handleEditPage(page.id)}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{page.title}</h3>
                  <p className="text-xs text-gray-500">آخر تعديل: {new Date(page.lastEdited).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>لا توجد صفحات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );

  const PageEditor = () => {
    if (!currentPage) return null;
    
    const pageName = pages.find(p => p.id === currentPage)?.title;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setCurrentPage(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة للصفحات
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              معاينة
            </Button>
            <Button className="flex items-center gap-2" onClick={handleSavePage}>
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 h-[600px] border rounded-lg overflow-hidden">
          {/* Left Sidebar - Components */}
          <div className="w-64 border-l bg-gray-50">
            <div className="p-3 border-b bg-white">
              <h3 className="font-medium">العناصر</h3>
            </div>
            <Tabs defaultValue="layout">
              <TabsList className="w-full justify-start px-3 pt-3">
                <TabsTrigger value="layout" className="flex items-center gap-1">
                  <Layout className="h-3 w-3" />
                  <span>تخطيط</span>
                </TabsTrigger>
                <TabsTrigger value="elements" className="flex items-center gap-1">
                  <Box className="h-3 w-3" />
                  <span>عناصر</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  <span>وسائط</span>
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(600px-6rem)]">
                <TabsContent value="layout" className="p-3 space-y-3">
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Columns className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">صف (عمودان)</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Grid className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">صف (ثلاثة أعمدة)</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <PanelLeft className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">قسم جانبي (يسار)</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <PanelRight className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">قسم جانبي (يمين)</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="elements" className="p-3 space-y-3">
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Heading className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">عنوان</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Paragraph className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">فقرة نصية</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <ButtonIcon className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">زر</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">رابط</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <List className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">قائمة</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="media" className="p-3 space-y-3">
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Image className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">صورة</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border cursor-move hover:border-wirashna-accent">
                    <div className="flex items-center">
                      <Type className="h-4 w-4 ml-2 text-gray-500" />
                      <span className="text-sm">أيقونة</span>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            <div className="p-3 border-b bg-white flex justify-between items-center">
              <h3 className="font-medium">تحرير: {pageName}</h3>
              <div className="flex items-center gap-2">
                <Select defaultValue="desktop">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="نوع الجهاز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">سطح المكتب</SelectItem>
                    <SelectItem value="tablet">تابلت</SelectItem>
                    <SelectItem value="mobile">جوال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="bg-white min-h-full rounded shadow p-6">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center h-full flex flex-col justify-center items-center">
                  <Plus className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">اسحب وأفلت العناصر هنا لبناء الصفحة</p>
                  <p className="text-sm text-gray-400">أو</p>
                  <Button variant="outline" className="mt-2">اختر قالباً</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Properties */}
          <div className="w-64 border-r bg-gray-50">
            <div className="p-3 border-b bg-white">
              <h3 className="font-medium">خصائص</h3>
            </div>
            <ScrollArea className="h-[calc(600px-3rem)]">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageTitle">عنوان الصفحة</Label>
                  <Input id="pageTitle" defaultValue={pageName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageSlug">مسار الصفحة</Label>
                  <Input id="pageSlug" defaultValue={`/${currentPage}`} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">عنوان SEO</Label>
                  <Input id="metaTitle" defaultValue={pageName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDesc">وصف SEO</Label>
                  <textarea
                    id="metaDesc"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={`وصف صفحة ${pageName}`}
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t mt-6">
                  <h4 className="text-sm font-medium mb-2">إعدادات الصفحة</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">عرض في القائمة</span>
                    <div>
                      <input type="checkbox" id="showInMenu" defaultChecked />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">حالة النشر</span>
                    <Select defaultValue="published">
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">منشورة</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  };

  return currentPage ? <PageEditor /> : <PageSelector />;
};

export default PageBuilder;
