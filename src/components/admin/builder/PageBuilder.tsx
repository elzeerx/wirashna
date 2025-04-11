
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageSection, PageData } from "@/types/page";
import { useToast } from "@/hooks/use-toast";
import { fetchPageById, savePage } from "@/services/pageService";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Heading, Type, Image, LayoutGrid, TextIcon, SaveIcon, EyeIcon, GripVertical, Plus, Trash2 } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import PageElementEditor from "./PageElementEditor";
import ElementPicker from "./ElementPicker";

interface PageBuilderProps {
  pageId: string | null;
}

const PageBuilder = ({ pageId }: PageBuilderProps) => {
  const [page, setPage] = useState<PageData>({
    id: "",
    title: "",
    path: "",
    content: [],
    meta_description: "",
    published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedElementIndex, setSelectedElementIndex] = useState<number | null>(null);
  const [showElementPicker, setShowElementPicker] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    try {
      setIsLoading(true);
      const pageData = await fetchPageById(id);
      setPage(pageData);
    } catch (error) {
      console.error("Error loading page:", error);
      toast({
        title: "خطأ في تحميل الصفحة",
        description: "حدث خطأ أثناء تحميل بيانات الصفحة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePage = async () => {
    if (!page.title) {
      toast({
        title: "خطأ في حفظ الصفحة",
        description: "يرجى إدخال عنوان الصفحة.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      // If it's a new page and doesn't have a path yet, generate one from the title
      if (!page.path && page.title) {
        setPage({
          ...page,
          path: `/${generateSlug(page.title)}`
        });
      }

      const updatedPage = {
        ...page,
        updated_at: new Date().toISOString()
      };

      await savePage(updatedPage);
      toast({
        title: "تم حفظ الصفحة",
        description: "تم حفظ التغييرات بنجاح."
      });
      
      // If it was a new page (no ID), we should reload to get the assigned ID
      if (!pageId) {
        // Update the URL to include the new page ID without reloading the page
        window.history.pushState({}, "", `/admin?page=${updatedPage.id}`);
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "خطأ في حفظ الصفحة",
        description: "حدث خطأ أثناء حفظ الصفحة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = page.content.findIndex(item => item.id === active.id);
      const newIndex = page.content.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newContent = [...page.content];
        const [movedItem] = newContent.splice(oldIndex, 1);
        newContent.splice(newIndex, 0, movedItem);
        
        setPage({
          ...page,
          content: newContent
        });
      }
    }
  };

  const handleAddElement = (elementType: string) => {
    const newElement: PageSection = {
      id: `section-${Date.now()}`,
      type: elementType,
      content: elementType === 'heading' ? 'عنوان جديد' : 
               elementType === 'text' ? 'أدخل النص هنا...' : 
               elementType === 'image' ? '' : '',
      settings: {}
    };
    
    setPage({
      ...page,
      content: [...page.content, newElement]
    });
    
    setSelectedElementIndex(page.content.length);
    setShowElementPicker(false);
  };

  const handleUpdateElement = (index: number, updatedElement: PageSection) => {
    const newContent = [...page.content];
    newContent[index] = updatedElement;
    
    setPage({
      ...page,
      content: newContent
    });
  };

  const handleDeleteElement = (index: number) => {
    const newContent = [...page.content];
    newContent.splice(index, 1);
    
    setPage({
      ...page,
      content: newContent
    });
    
    setSelectedElementIndex(null);
  };

  const SortableElement = ({ element, index }: { element: PageSection, index: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: element.id
    });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    const isSelected = selectedElementIndex === index;
    
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className={`relative border rounded-md p-4 my-2 ${isSelected ? 'ring-2 ring-wirashna-accent' : ''}`}
      >
        <div 
          className="absolute top-2 left-2 cursor-move p-1 opacity-50 hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
        
        <div className="absolute top-2 right-2 flex space-x-1 rtl:space-x-reverse">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => handleDeleteElement(index)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
        
        <div 
          className="pt-4" 
          onClick={() => setSelectedElementIndex(index)}
        >
          {element.type === 'heading' && (
            <h2 className="text-xl font-bold">{element.content}</h2>
          )}
          
          {element.type === 'text' && (
            <p>{element.content}</p>
          )}
          
          {element.type === 'image' && element.content && (
            <img 
              src={element.content} 
              alt="Content" 
              className="max-w-full h-auto" 
            />
          )}
          
          {element.type === 'spacer' && (
            <div className="py-6 bg-gray-100 flex items-center justify-center text-gray-400">
              مساحة فارغة
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {pageId ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
        </h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <a href={page.path} target="_blank" rel="noopener noreferrer">
              <EyeIcon size={16} />
              معاينة
            </a>
          </Button>
          <Button 
            onClick={handleSavePage} 
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            <SaveIcon size={16} />
            {isSaving ? 'جاري الحفظ...' : 'حفظ الصفحة'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="wirashna-loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="content">المحتوى</TabsTrigger>
                    <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">عنوان الصفحة</Label>
                          <Input
                            id="title"
                            value={page.title}
                            onChange={(e) => setPage({ ...page, title: e.target.value })}
                            placeholder="أدخل عنوان الصفحة"
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">محتوى الصفحة</h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowElementPicker(true)}
                            className="flex items-center gap-1"
                          >
                            <Plus size={16} />
                            إضافة عنصر
                          </Button>
                        </div>
                        
                        <div className="min-h-[300px] border border-dashed rounded-md p-4 bg-gray-50">
                          {page.content.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                              <div className="text-4xl text-gray-300 mb-4">
                                <LayoutGrid size={48} />
                              </div>
                              <p className="text-gray-500 mb-4">لا يوجد محتوى حتى الآن</p>
                              <Button 
                                onClick={() => setShowElementPicker(true)}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Plus size={16} />
                                إضافة عنصر
                              </Button>
                            </div>
                          ) : (
                            <DndContext 
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                            >
                              <SortableContext 
                                items={page.content.map(item => item.id)} 
                                strategy={verticalListSortingStrategy}
                              >
                                {page.content.map((element, index) => (
                                  <SortableElement 
                                    key={element.id} 
                                    element={element} 
                                    index={index} 
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <div className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="slug">مسار الصفحة</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                              /
                            </span>
                            <Input
                              id="slug"
                              value={page.path?.replace(/^\//, '')}
                              onChange={(e) => setPage({ ...page, path: `/${e.target.value}` })}
                              placeholder="مسار-الصفحة"
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="meta_description">وصف الميتا (للبحث)</Label>
                          <Input
                            id="meta_description"
                            value={page.meta_description || ''}
                            onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                            placeholder="وصف مختصر للصفحة يظهر في نتائج البحث"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                          <Switch
                            id="published"
                            checked={page.published}
                            onCheckedChange={(checked) => setPage({ ...page, published: checked })}
                          />
                          <Label htmlFor="published">نشر الصفحة</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                {selectedElementIndex !== null && selectedElementIndex < page.content.length ? (
                  <PageElementEditor
                    element={page.content[selectedElementIndex]}
                    onUpdate={(updatedElement) => 
                      handleUpdateElement(selectedElementIndex, updatedElement)
                    }
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <p className="text-gray-500">اختر عنصرًا من محتوى الصفحة لتعديله</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <ElementPicker
        isOpen={showElementPicker}
        onClose={() => setShowElementPicker(false)}
        onSelect={handleAddElement}
      />
    </div>
  );
};

export default PageBuilder;
