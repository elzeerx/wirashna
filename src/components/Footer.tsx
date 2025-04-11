
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-wirashna-secondary pt-10 pb-6">
      <div className="wirashna-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ورشنا</h3>
            <p className="text-gray-600 mb-4">
              منصة متخصصة في تقديم ورش عمل حضورية في مجال صناعة المحتوى والذكاء الاصطناعي في الكويت والخليج
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  عن ورشنا
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  الورش
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-gray-600 hover:text-wirashna-accent transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <p className="text-gray-600 mb-2">البريد الإلكتروني: info@wirashna.com</p>
            <p className="text-gray-600 mb-2">الهاتف: <span dir="ltr">+965 1234 5678</span></p>
            <p className="text-gray-600">الكويت، مدينة الكويت</p>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} ورشنا. جميع الحقوق محفوظة.
            <span className="mx-2">|</span>
            <Link to="/privacy-policy" className="hover:text-wirashna-accent transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms-conditions" className="hover:text-wirashna-accent transition-colors">
              الشروط والأحكام
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
