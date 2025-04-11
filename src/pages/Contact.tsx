
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: "", email: "", phone: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <h1 className="text-3xl font-bold mb-8">تواصل معنا</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-gray-700 mb-6">
                نحن نرحب بأسئلتكم واقتراحاتكم. يمكنكم التواصل معنا عبر النموذج المرفق أو من خلال معلومات الاتصال المباشرة.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full ml-4">
                    <Mail size={20} className="text-wirashna-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-600">info@wirashna.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full ml-4">
                    <Phone size={20} className="text-wirashna-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">الهاتف</h3>
                    <p className="text-gray-600">+965 1234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-wirashna-accent bg-opacity-10 p-3 rounded-full ml-4">
                    <MapPin size={20} className="text-wirashna-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">العنوان</h3>
                    <p className="text-gray-600">الكويت، مدينة الكويت، شارع الخليج العربي، برج الحمراء، الطابق 18</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-wirashna-secondary p-6 rounded-lg">
                <h3 className="font-bold mb-4">ساعات العمل</h3>
                <p className="text-gray-600 mb-2">الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً</p>
                <p className="text-gray-600">الجمعة - السبت: مغلق</p>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="wirashna-card">
                <h2 className="text-xl font-bold mb-6">أرسل لنا رسالة</h2>
                
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                    تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="name" className="block font-medium mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block font-medium mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block font-medium mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block font-medium mb-1">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="wirashna-btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>جاري الإرسال...</span>
                  ) : (
                    <>
                      <span>إرسال الرسالة</span>
                      <Send size={18} className="mr-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
