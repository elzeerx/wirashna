import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageData } from "@/types/page";
import { fetchPageByPath } from "@/services/pageService";
import { MainLayout } from "@/components/layouts/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoadingState } from "@/hooks/useLoadingState";
import { Helmet } from "react-helmet-async";

const DynamicPage = () => {
  const { path } = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const { isLoading, wrapAsync } = useLoadingState({
    errorMessage: "حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة مرة أخرى."
  });

  useEffect(() => {
    if (!path) return;
    
    wrapAsync(async () => {
      const pageData = await fetchPageByPath(`/${path}`);
      setPage(pageData);
    });
  }, [path, wrapAsync]);

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (!page) {
    return (
      <MainLayout>
        <div className="wirashna-container py-12">
          <h1 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h1>
          <p>الصفحة التي تبحث عنها غير موجودة أو ربما تم حذفها.</p>
        </div>
      </MainLayout>
    );
  }

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

  return (
    <MainLayout>
      <Helmet>
        <title>{page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
      </Helmet>
      
      <div className="wirashna-container py-12">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
        <div className="page-content">
          {renderPageContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default DynamicPage;
