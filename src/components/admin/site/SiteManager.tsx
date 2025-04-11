
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, ArrowUp, ArrowDown, Edit, Trash2, Eye, 
  Home, Info, Wrench, Phone, Copy, MoveVertical, 
  LayoutGrid, File 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock page data - in real implementation this would come from API
const PAGES = [
  { id: "home", title: "الصفحة الرئيسية", url: "/", status: "published", type: "home" },
  { id: "about", title: "من نحن", url: "/about", status: "published", type: "content" },
  { id: "workshops", title: "الورش", url: "/workshops", status: "published", type: "dynamic" },
  { id: "contact", title: "اتصل بنا", url: "/contact", status: "published", type: "form" },
  { id: "terms", title: "الشروط والأحكام", url: "/terms-conditions", status: "published", type: "content" },
  { id: "privacy", title: "سياسة الخصوصية", url: "/privacy-policy", status: "published", type: "content" },
];

// Page type icons
const TYPE_ICONS: Record<string, any> = {
  home: <Home size={16} />,
  content: <File size={16} />,
  dynamic: <LayoutGrid size={16} />,
  form: <Wrench size={16} />,
};

const SiteManager = () => {
  const [pages, setPages] = useState(PAGES);
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: "", url: "", type: "content" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePageAction = (actionType: string, pageId: string) => {
    // This would be implemented with actual API calls in production
    switch (actionType) {
      case "view":
        // Navigate to page in new tab
        window.open(`${pageId === "home" ? "/" : `/${pageId}`}`, "_blank");
        break;
      case "edit":
        toast({
          title: "تحرير الصفحة",
          description: "سيتم توجيهك إلى محرر الصفحات لتحرير هذه الصفحة",
        });
        break;
      case "delete":
        toast({
          title: "تم حذف الصفحة",
          description: "تم حذف الصفحة بنجاح",
        });
        setPages(pages.filter(p => p.id !== pageId));
        break;
      case "moveUp":
        const upIndex = pages.findIndex(p => p.id === pageId);
        if (upIndex > 0) {
          const newPages = [...pages];
          [newPages[upIndex], newPages[upIndex - 1]] = [newPages[upIndex - 1], newPages[upIndex]];
          setPages(newPages);
        }
        break;
      case "moveDown":
        const downIndex = pages.findIndex(p => p.id === pageId);
        if (downIndex < pages.length - 1) {
          const newPages = [...pages];
          [newPages[downIndex], newPages[downIndex + 1]] = [newPages[downIndex + 1], newPages[downIndex]];
          setPages(newPages);
        }
        break;
      case "duplicate":
        const pageToDuplicate = pages.find(p => p.id === pageId);
        if (pageToDuplicate) {
          const newPage = {
            ...pageToDuplicate,
            id: `${pageId}-copy`,
            title: `${pageToDuplicate.title} (نسخة)`,
            url: `${pageToDuplicate.url}-copy`,
          };
          setPages([...pages, newPage]);
          toast({
            title: "تم نسخ الصفحة",
            description: `تم إنشاء نسخة من "${pageToDuplicate.title}"`,
          });
        }
        break;
      default:
        break;
    }
  };

  const handleCreateNewPage = () => {
    // This would be implemented with actual API calls in production
    const newId = newPageData.url.replace(/^\/+/, "").replace(/\/+$/, "").replace(/\//g, "-") || "new-page";
    const newPage = {
      id: newId,
      title: newPageData.title,
      url: newPageData.url,
      status: "draft",
      type: newPageData.type,
    };
    
    setPages([...pages, newPage]);
    setIsNewPageDialogOpen(false);
    setNewPageData({ title: "", url: "", type: "content" });
    
    toast({
      title: "تم إنشاء الصفحة",
      description: "تم إنشاء الصفحة الجديدة بنجاح. يمكنك الآن تحريرها.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">صفحات الموقع</h2>
        <Button onClick={() => setIsNewPageDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          صفحة جديدة
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>النوع</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>المسار</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>
                <div className="flex items-center">
                  {TYPE_ICONS[page.type] || <File size={16} />}
                  <span className="mr-2 text-xs text-gray-500">
                    {page.type === "home" ? "رئيسية" : 
                     page.type === "content" ? "محتوى" : 
                     page.type === "dynamic" ? "ديناميكية" : 
                     page.type === "form" ? "نموذج" : "أخرى"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell>{page.url}</TableCell>
              <TableCell>
                <Badge variant={page.status === "published" ? "default" : "outline"}>
                  {page.status === "published" ? "منشورة" : "مسودة"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 space-x-reverse">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageAction("view", page.id)}
                        >
                          <Eye size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>عرض الصفحة</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageAction("edit", page.id)}
                        >
                          <Edit size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تحرير الصفحة</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageAction("duplicate", page.id)}
                        >
                          <Copy size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>نسخ الصفحة</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageAction("moveUp", page.id)}
                        >
                          <ArrowUp size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>نقل لأعلى</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageAction("moveDown", page.id)}
                        >
                          <ArrowDown size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>نقل لأسفل</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {page.id !== "home" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handlePageAction("delete", page.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>حذف الصفحة</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>إنشاء صفحة جديدة</DialogTitle>
            <DialogDescription>
              أدخل معلومات الصفحة الجديدة. يمكنك تحرير المحتوى بعد الإنشاء.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الصفحة</Label>
              <Input 
                id="title" 
                value={newPageData.title} 
                onChange={e => setNewPageData({...newPageData, title: e.target.value})} 
                placeholder="أدخل عنوان الصفحة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">مسار الصفحة (URL)</Label>
              <Input 
                id="url" 
                value={newPageData.url} 
                onChange={e => setNewPageData({...newPageData, url: e.target.value})} 
                placeholder="/your-page-path"
              />
              <p className="text-xs text-gray-500">مثال: /about-us، /services/web-design</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">نوع الصفحة</Label>
              <select
                id="type"
                value={newPageData.type}
                onChange={e => setNewPageData({...newPageData, type: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="content">صفحة محتوى</option>
                <option value="form">صفحة نموذج</option>
                <option value="dynamic">صفحة ديناميكية</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPageDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleCreateNewPage}>إنشاء الصفحة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteManager;
