import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  CreditCard, 
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

const AdminDashboardLayout = ({ children, isLoading = false }: AdminDashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: "لوحة التحكم", path: "/admin" },
    { icon: <CalendarDays size={20} />, label: "إدارة الورش", path: "/admin/workshops" },
    { icon: <Users size={20} />, label: "المشتركين", path: "/admin/subscribers" },
    { icon: <CreditCard size={20} />, label: "المدفوعات", path: "/admin/payments" },
    { icon: <Settings size={20} />, label: "الإعدادات العامة", path: "/admin/settings" },
    { icon: <Wrench size={20} />, label: "أدوات النظام", path: "/admin/system-repair" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="wirashna-container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/eaaf22e5-909c-451f-8c7c-3993be15b82c.png" alt="Wirashna" className="h-12" />
          </Link>
          
          <div className="flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-foreground hover:text-wirashna-accent transition-colors">
              الرئيسية
            </Link>
            <Link to="/about" className="text-foreground hover:text-wirashna-accent transition-colors">
              عن ورشنا
            </Link>
            <Link to="/workshops" className="text-foreground hover:text-wirashna-accent transition-colors">
              الورش
            </Link>
            <Link to="/contact" className="text-foreground hover:text-wirashna-accent transition-colors">
              تواصل معنا
            </Link>
            
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">مدير النظام</span>
                <div className="w-8 h-8 rounded-full bg-wirashna-accent text-white flex items-center justify-center">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <div className="flex flex-1 pt-16">
        <div 
          className={cn(
            "fixed right-0 top-16 h-full bg-white shadow-sm transition-all duration-300 z-40",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 flex flex-col h-full">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-4 -left-3 bg-white rounded-full border border-gray-200 p-1 shadow-sm"
            >
              {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <div className="space-y-1 pt-4">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md transition-colors",
                    "hover:bg-wirashna-accent/10 text-gray-700",
                    window.location.pathname === item.path && "bg-wirashna-accent text-white hover:bg-wirashna-accent/90"
                  )}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto">
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 justify-center"
              >
                <LogOut size={16} />
                {!collapsed && <span>تسجيل الخروج</span>}
              </Button>
            </div>
          </div>
        </div>
        
        <main className={cn(
          "flex-grow transition-all duration-300",
          collapsed ? "mr-16" : "mr-64"
        )}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
