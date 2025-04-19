
import { useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  CalendarDays,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" },
  { path: "/admin/workshops", icon: CalendarDays, label: "إدارة الورش" },
  { path: "/admin/subscribers", icon: Users, label: "المشتركين" },
  { path: "/admin/payments", icon: CreditCard, label: "المدفوعات" },
  { path: "/admin/settings", icon: Settings, label: "الإعدادات" },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">لوحة الإدارة</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 py-2",
                      isActive && "font-semibold text-primary-600 dark:text-primary-400"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
