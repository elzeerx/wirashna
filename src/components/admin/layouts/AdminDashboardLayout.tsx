
import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminSidebar } from "./AdminSidebar";

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const AdminDashboardLayout = ({ children, isLoading = false }: AdminDashboardLayoutProps) => {
  if (isLoading) {
    return <MainLayout>
      <div className="wirashna-container py-12 flex justify-center items-center">
        <div className="wirashna-loader"></div>
      </div>
    </MainLayout>;
  }

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardLayout;
