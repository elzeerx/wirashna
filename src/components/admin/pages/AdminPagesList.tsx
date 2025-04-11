
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageData } from "@/types/page";
import { fetchPages, deletePage } from "@/services/pageService";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminPagesListProps {
  onPageSelect: (pageId: string) => void;
  onNewPage: () => void;
}

const AdminPagesList = ({ onPageSelect, onNewPage }: AdminPagesListProps) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const pagesData = await fetchPages();
      setPages(pagesData);
    } catch (error) {
      console.error("Error loading pages:", error);
      toast({
        title: "خطأ في تحميل الصفحات",
        description: "حدث خطأ أثناء تحميل بيانات الصفحات. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (pageId: string) => {
    setPageToDelete(pageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    
    try {
      await deletePage(pageToDelete);
      setPages(pages.filter(page => page.id !== pageToDelete));
      toast({
        title: "تم حذف الصفحة",
        description: "تم حذف الصفحة بنجاح.",
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "خطأ في حذف الصفحة",
        description: "حدث خطأ أثناء حذف الصفحة. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة صفحات الموقع</h2>
        <Button onClick={onNewPage} className="flex items-center gap-2">
          <Plus size={16} />
          صفحة جديدة
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="wirashna-loader"></div>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-gray-500 mb-4">لا توجد صفحات حتى الآن</p>
              <Button onClick={onNewPage} variant="outline" className="flex items-center gap-2">
                <Plus size={16} />
                إنشاء صفحة جديدة
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>المسار</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التعديل</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>{page.path}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.published ? 'منشورة' : 'مسودة'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(page.updated_at).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => onPageSelect(page.id)}
                        >
                          <Pencil size={14} />
                          <span className="sr-only">تعديل</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteClick(page.id)}
                        >
                          <Trash2 size={14} />
                          <span className="sr-only">حذف</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <a href={page.path} target="_blank" rel="noopener noreferrer">
                            <Eye size={14} />
                            <span className="sr-only">معاينة</span>
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الصفحة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الصفحة نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPagesList;
