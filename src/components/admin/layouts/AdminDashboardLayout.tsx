
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LogOut, 
  Search, 
  Bell, 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  CreditCard, 
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: "لوحة التحكم", path: "/admin" },
    { icon: <CalendarDays size={20} />, label: "إدارة الورش", path: "/admin/workshops" },
    { icon: <Users size={20} />, label: "المشتركين", path: "/admin/users" },
    { icon: <CreditCard size={20} />, label: "المدفوعات", path: "#" },
    { icon: <Settings size={20} />, label: "الإعدادات العامة", path: "/admin/settings" },
    { icon: <Wrench size={20} />, label: "أدوات النظام", path: "/admin/system-repair" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-50 fixed w-full top-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-wirashna-primary font-bold text-xl">ورشنا</Link>
          </div>
          
          <div className="flex-1 mx-8">
            <div className="relative max-w-md mx-auto">
              <Input 
                type="text" 
                placeholder="بحث..." 
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-gray-500 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-2 h-2"></span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">مدير النظام</span>
              <div className="w-8 h-8 rounded-full bg-wirashna-primary text-white flex items-center justify-center">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar and Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div 
          className={cn(
            "fixed right-0 top-16 h-full bg-white shadow-sm transition-all duration-300 z-40",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 flex flex-col h-full">
            {/* Sidebar toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute top-4 -left-3 bg-white rounded-full border border-gray-200 p-1 shadow-sm"
            >
              {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {/* Sidebar items */}
            <div className="space-y-1 pt-4">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md transition-colors",
                    "hover:bg-wirashna-primary/10 text-gray-700",
                    window.location.pathname === item.path && "bg-wirashna-primary text-white hover:bg-wirashna-primary/90"
                  )}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
            
            {/* Logout button */}
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
        
        {/* Main content */}
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
