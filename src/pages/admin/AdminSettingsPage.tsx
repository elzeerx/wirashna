
import SiteSettings from "@/components/admin/settings/SiteSettings";
import AdminDashboardLayout from "@/components/admin/layouts/AdminDashboardLayout";

const AdminSettingsPage = () => {
  return (
    <AdminDashboardLayout>
      <SiteSettings />
    </AdminDashboardLayout>
  );
};

export default AdminSettingsPage;
