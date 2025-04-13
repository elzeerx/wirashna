
import { Link } from "react-router-dom";

const TermsDisclaimer = () => {
  return (
    <p className="text-sm text-gray-500 text-center mt-4">
      بالضغط على تأكيد التسجيل، أنت توافق على 
      <Link to="/terms-conditions" className="text-wirashna-accent mx-1">الشروط والأحكام</Link>
      و
      <Link to="/privacy-policy" className="text-wirashna-accent mx-1">سياسة الخصوصية</Link>
    </p>
  );
};

export default TermsDisclaimer;
