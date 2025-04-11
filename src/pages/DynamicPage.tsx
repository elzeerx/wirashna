
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageData } from "@/types/page";
import { fetchPageByPath } from "@/services/pageService";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DynamicPage = () => {
  const { path } = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPage = async () => {
      if (!path) return;
      
      try {
        setIsLoading(true);
        const pageData = await fetchPageByPath(`/${path}`);
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

    loadPage();
  }, [path, toast]);

  const renderPageContent = () => {
    if (!page || !page.content || !Array.isArray(page.content)) {
      return <p>لا يوجد محتوى لهذه الصفحة</p>;
    }

    return page.content.map((section, index) => {
      switch (section.type) {
        case 'heading':
          const HeadingTag = section.settings?.level || 'h2';
          return (
            <HeadingTag key={section.id} className="mb-4 font-bold">
              {section.content}
            </HeadingTag>
          );
        case 'text':
          return (
            <p key={section.id} className="mb-4">
              {section.content}
            </p>
          );
        case 'image':
          return (
            <div key={section.id} className="mb-6">
              <img 
                src={section.content} 
                alt={section.settings?.alt || ''} 
                className="max-w-full h-auto"
              />
            </div>
          );
        case 'spacer':
          const size = section.settings?.size || 'medium';
          const heightClass = 
            size === 'small' ? 'h-4' :
            size === 'medium' ? 'h-8' :
            'h-16';
          return <div key={section.id} className={heightClass}></div>;
        default:
          return null;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12 flex justify-center items-center">
            <div className="wirashna-loader"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12">
            <h1 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h1>
            <p>الصفحة التي تبحث عنها غير موجودة أو ربما تم حذفها.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
          <div className="page-content">
            {renderPageContent()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DynamicPage;
