
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="wirashna-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">ورشنا</h3>
            <p className="text-sm text-gray-600 mb-4">
              منصة متكاملة للتعلم والتطور في مجال صناعة المحتوى والذكاء الاصطناعي
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900">الرئيسية</Link></li>
              <li><Link to="/workshops" className="text-gray-600 hover:text-gray-900">الورش</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">من نحن</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">المدربون</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-2 text-gray-600">
              <p>info@wirashna.com</p>
              <p>12345678 965+</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">تابعنا</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
          جميع الحقوق محفوظة © ورشنا 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer;
