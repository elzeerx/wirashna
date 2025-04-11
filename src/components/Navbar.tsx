
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="wirashna-container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/eaaf22e5-909c-451f-8c7c-3993be15b82c.png" alt="Wirashna" className="h-12" />
        </Link>

        {isMobile ? (
          <>
            <button
              onClick={toggleMenu}
              className="p-2 text-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-white z-40 animate-fade-in">
                <div className="flex flex-col items-center py-8 space-y-6">
                  <Link to="/" className="text-lg font-medium" onClick={toggleMenu}>
                    الرئيسية
                  </Link>
                  <Link to="/about" className="text-lg font-medium" onClick={toggleMenu}>
                    عن ورشنا
                  </Link>
                  <Link to="/workshops" className="text-lg font-medium" onClick={toggleMenu}>
                    الورش
                  </Link>
                  <Link to="/contact" className="text-lg font-medium" onClick={toggleMenu}>
                    تواصل معنا
                  </Link>
                  <Link
                    to="/login"
                    className="wirashna-btn-primary"
                    onClick={toggleMenu}
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
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
            <Link to="/login" className="wirashna-btn-primary">
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
