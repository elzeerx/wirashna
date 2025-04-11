
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft, LayoutDashboard, Calendar, FileText, Settings, Award, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
};

const SidebarLink = ({ href, icon, label, isActive, isCollapsed }: SidebarLinkProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center p-3 rounded-md transition-colors mb-1",
      isActive
        ? "bg-wirashna-accent text-white"
        : "hover:bg-wirashna-secondary"
    )}
  >
    <span className="mr-3">{icon}</span>
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { userRole } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "h-screen fixed top-0 right-0 bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-40 pt-20",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-24 -left-3 bg-white rounded-full border border-gray-200 p-1 shadow-sm"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-4">
        <div className="space-y-1">
          {/* Common links for all roles */}
          {userRole === 'subscriber' && (
            <>
              <SidebarLink
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="لوحة التحكم"
                isActive={isActive("/dashboard")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/dashboard/workshops"
                icon={<Calendar size={20} />}
                label="الورش المسجلة"
                isActive={isActive("/dashboard/workshops")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/dashboard/certificates"
                icon={<Award size={20} />}
                label="الشهادات"
                isActive={isActive("/dashboard/certificates")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/dashboard/materials"
                icon={<FileText size={20} />}
                label="المواد التعليمية"
                isActive={isActive("/dashboard/materials")}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* Supervisor links */}
          {userRole === 'supervisor' && (
            <>
              <SidebarLink
                href="/supervisor"
                icon={<LayoutDashboard size={20} />}
                label="لوحة التحكم"
                isActive={isActive("/supervisor")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/supervisor/workshops"
                icon={<Calendar size={20} />}
                label="إدارة الورش"
                isActive={isActive("/supervisor/workshops")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/supervisor/materials"
                icon={<BookOpen size={20} />}
                label="إدارة المواد"
                isActive={isActive("/supervisor/materials")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/supervisor/statistics"
                icon={<FileText size={20} />}
                label="الإحصائيات"
                isActive={isActive("/supervisor/statistics")}
                isCollapsed={isCollapsed}
              />
            </>
          )}

          {/* Admin links */}
          {userRole === 'admin' && (
            <>
              <SidebarLink
                href="/admin"
                icon={<LayoutDashboard size={20} />}
                label="لوحة التحكم"
                isActive={isActive("/admin")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/admin/workshops"
                icon={<Calendar size={20} />}
                label="إدارة الورش"
                isActive={isActive("/admin/workshops")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/admin/users"
                icon={<Users size={20} />}
                label="إدارة المستخدمين"
                isActive={isActive("/admin/users")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/admin/materials"
                icon={<BookOpen size={20} />}
                label="إدارة المواد"
                isActive={isActive("/admin/materials")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/admin/statistics"
                icon={<FileText size={20} />}
                label="الإحصائيات"
                isActive={isActive("/admin/statistics")}
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                href="/admin/settings"
                icon={<Settings size={20} />}
                label="إعدادات الموقع"
                isActive={isActive("/admin/settings")}
                isCollapsed={isCollapsed}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
