import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, Users, ArrowRight, X, User, Mail, Phone, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import WorkshopCard from "@/components/WorkshopCard";

// Mock workshop data
const workshops = [
  {
    id: "1",
    title: "الذكاء الاصطناعي للمبتدئين",
    description: "تعلم أساسيات الذكاء الاصطناعي وكيفية استخدامه في صناعة المحتوى بشكل عملي",
    longDescription: "تهدف هذه الورشة إلى تقديم المفاهيم الأساسية للذكاء الاصطناعي وتطبيقاته في مجال صناعة المحتوى. ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي المختلفة لتعزيز إنتاجية العمل الإبداعي، وكيفية الاستفادة من هذه التقنيات في تطوير محتوى متميز. الورشة مصممة للمبتدئين ولا تتطلب أي خبرة سابقة في مجال الذكاء الاصطناعي.",
    date: "١٥ مايو ٢٠٢٥",
    time: "٥:٠٠ مساءًا",
    venue: "الكويت",
    location: "فندق الشيراتون، قاعة الفردوس، الطابق الثاني",
    availableSeats: 12,
    totalSeats: 20,
    price: "١٢٠ دينار كويتي",
    instructor: "أحمد الشمري",
    instructorBio: "خبير في مجال الذكاء الاصطناعي وتطبيقاته في صناعة المحتوى، عمل في العديد من الشركات العالمية وقدم أكثر من ٥٠ ورشة عمل في مختلف دول الخليج.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    gallery: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    ],
    schedule: [
      { time: "٥:٠٠ - ٥:٣٠", activity: "تسجيل الحضور والترحيب" },
      { time: "٥:٣٠ - ٦:٣٠", activity: "مقدمة عن الذكاء الاصطناعي وتطبيقاته" },
      { time: "٦:٣٠ - ٧:٠٠", activity: "استراحة" },
      { time: "٧:٠٠ - ٨:٣٠", activity: "تطبيقات عملية على استخدام أدوات الذكاء الاصطناعي" },
      { time: "٨:٣٠ - ٩:٠٠", activity: "أسئلة ونقاش" }
    ],
    requirements: [
      "جهاز كمبيوتر محمول",
      "اتصال بالإنترنت",
      "حساب على منصات الذكاء الاصطناعي المجانية (سيتم تزويدكم بالتفاصيل قبل الورشة)"
    ],
    benefits: [
      "فهم أساسيات الذكاء الاصطناعي وتطبيقاته",
      "التعرف على أحدث التقنيات والأدوات في المجال",
      "تطبيق عملي للمهارات المكتسبة",
      "شهادة حضور معتمدة",
      "فرصة للتواصل مع المهتمين والخبراء في المجال"
    ]
  },
  {
    id: "2",
    title: "إنشاء محتوى إبداعي مع الذكاء الاصطناعي",
    description: "ورشة عمل متقدمة حول كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء محتوى متميز",
    longDescription: "ورشة عمل متقدمة تركز على كيفية استخدام أدوات الذكاء الاصطناعي المختلفة لإنشاء محتوى إبداعي متميز. ستتعلم كيفية استخدام تقنيات الذكاء الاصطناعي في كتابة النصوص، وإنشاء الصور، وتحرير الفيديو. هذه الورشة مخصصة للأشخاص الذين لديهم معرفة أساسية بالذكاء الاصطناعي ويرغبون في تطوير مهاراتهم في استخدامه لإنشاء محتوى إبداعي.",
    date: "٢٠ مايو ٢٠٢٥",
    time: "٤:٠٠ مساءًا",
    venue: "دبي",
    location: "فندق العنوان، قاعة المجلس، الطابق الأول",
    availableSeats: 8,
    totalSeats: 15,
    price: "٥٠٠ درهم إماراتي",
    instructor: "سارة العتيبي",
    instructorBio: "خبيرة في مجال صناعة المحتوى الرقمي وتطبيقات الذكاء الاصطناعي، قدمت العديد من الورش التدريبية في مختلف دول الخليج وشمال أفريقيا.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    ]
  },
  {
    id: "3",
    title: "تصميم الجرافيك باستخدام الذكاء الاصطناعي",
    description: "تعلم كيفية إنشاء تصاميم جرافيك احترافية باستخدام أحدث أدوات الذكاء الاصطناعي",
    longDescription: "في هذه الورشة، ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لإنشاء تصاميم جرافيك احترافية. سنغطي كيفية استخدام أدوات مثل DALL-E وMidjourney لإنشاء صور وتصاميم مبتكرة، وكيفية تحرير هذه التصاميم باستخدام برامج تحرير الصور. هذه الورشة مناسبة للمصممين والمبدعين الذين يرغبون في تعزيز مهاراتهم باستخدام الذكاء الاصطناعي.",
    date: "٢٥ مايو ٢٠٢٥",
    time: "٦:٠٠ مساءًا",
    venue: "الرياض",
    location: "فندق الفيصلية، قاعة المؤتمرات، الطابق الثالث",
    availableSeats: 15,
    totalSeats: 25,
    price: "٥٠٠ ريال سعودي",
    instructor: "محمد القحطاني",
    instructorBio: "مصمم جرافيك محترف مع خبرة أكثر من ١٠ سنوات في مجال التصميم، متخصص في استخدام تقنيات الذكاء الاصطناعي في التصميم الجرافيكي.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    gallery: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    ]
  },
  {
    id: "4",
    title: "كتابة السيناريو المدعومة بالذكاء الاصطناعي",
    description: "اكتشف كيفية استخدام الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك",
    longDescription: "في هذه الورشة، ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لتحسين مهارات كتابة السيناريو الخاصة بك. سنستكشف كيفية استخدام نماذج اللغة المتقدمة لتوليد أفكار للقصص، وتطوير الشخصيات، وكتابة الحوار. ستتعلم أيضًا كيفية تحرير وتنقيح النصوص التي تم إنشاؤها بواسطة الذكاء الاصطناعي لجعلها أكثر إبداعًا وأصالة.",
    date: "٣٠ مايو ٢٠٢٥",
    time: "٥:٣٠ مساءًا",
    venue: "الدوحة",
    location: "مركز قطر للمؤتمرات، قاعة اللؤلؤة، الطابق الثاني",
    availableSeats: 10,
    totalSeats: 20,
    price: "٤٠٠ ريال قطري",
    instructor: "فاطمة الكواري",
    instructorBio: "كاتبة سيناريو وروائية، لديها خبرة واسعة في مجال الكتابة الإبداعية واستخدام تقنيات الذكاء الاصطناعي في تطوير المحتوى.",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    gallery: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    ]
  }
];

const formSchema = z.object({
  fullName: z.string().min(3, { message: "الرجاء إدخال الاسم الكامل" }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح" }),
  phone: z.string().min(8, { message: "الرجاء إدخال رقم هاتف صحيح" }),
  paymentMethod: z.enum(["credit", "bank", "cash"], {
    required_error: "الرجاء اختيار طريقة الدفع",
  }),
});

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const { toast } = useToast();
  
  const workshop = workshops.find(w => w.id === id);
  
  const relatedWorkshops = workshop 
    ? workshops
        .filter(w => w.id !== workshop.id)
        .filter(w => w.venue === workshop.venue || Math.random() > 0.5)
        .slice(0, 3)
    : [];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: "credit",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "تم تسجيل طلبك بنجاح",
      description: "سنتواصل معك قريبًا لتأكيد حجزك",
    });
    
    form.reset();
  }
  
  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="wirashna-container py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">الورشة غير موجودة</h1>
            <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على الورشة المطلوبة.</p>
            <Link to="/workshops" className="wirashna-btn-primary inline-flex items-center">
              <ArrowRight size={18} className="ml-2" />
              <span>العودة إلى الورش</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="wirashna-container py-12">
          <div className="mb-8">
            <Link to="/workshops" className="inline-flex items-center text-wirashna-accent hover:underline">
              <ArrowRight size={18} className="ml-2" />
              <span>العودة إلى الورش</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{workshop.title}</h1>
              
              <div className="relative h-72 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={workshop.image} 
                  alt={workshop.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {workshop.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="h-24 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-wirashna-accent transition-colors"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">وصف الورشة</h2>
                <p className="text-gray-700 leading-relaxed">{workshop.longDescription}</p>
              </div>

              <Collapsible
                open={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                className="mb-8 border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-wirashna-secondary hover:bg-wirashna-secondary/80 transition-colors">
                  <h2 className="text-xl font-bold">جدول الورشة</h2>
                  <div className="text-wirashna-accent">
                    {isScheduleOpen ? <X size={20} /> : <ArrowRight size={20} />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="space-y-3">
                    {workshop.schedule?.map((item, index) => (
                      <div key={index} className="flex border-b border-gray-200 pb-2 last:border-0">
                        <div className="w-24 font-bold">{item.time}</div>
                        <div>{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isRequirementsOpen}
                onOpenChange={setIsRequirementsOpen}
                className="mb-8 border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-wirashna-secondary hover:bg-wirashna-secondary/80 transition-colors">
                  <h2 className="text-xl font-bold">متطلبات الورشة</h2>
                  <div className="text-wirashna-accent">
                    {isRequirementsOpen ? <X size={20} /> : <ArrowRight size={20} />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <ul className="list-disc list-inside space-y-2">
                    {workshop.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isBenefitsOpen}
                onOpenChange={setIsBenefitsOpen}
                className="mb-8 border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-wirashna-secondary hover:bg-wirashna-secondary/80 transition-colors">
                  <h2 className="text-xl font-bold">مميزات الورشة</h2>
                  <div className="text-wirashna-accent">
                    {isBenefitsOpen ? <X size={20} /> : <ArrowRight size={20} />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <ul className="list-disc list-inside space-y-2">
                    {workshop.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">المدرب</h2>
                <div className="bg-wirashna-secondary p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">{workshop.instructor}</h3>
                  <p className="text-gray-700">{workshop.instructorBio}</p>
                </div>
              </div>

              <div className="lg:hidden">
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الاسم الكامل</FormLabel>
                              <FormControl>
                                <Input placeholder="أدخل اسمك الكامل" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="example@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم الهاتف</FormLabel>
                              <FormControl>
                                <Input placeholder="+965 XXXX XXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>طريقة الدفع</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                                  {...field}
                                >
                                  <option value="credit">بطاقة ائتمان</option>
                                  <option value="bank">تحويل بنكي</option>
                                  <option value="cash">نقداً عند الحضور</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full wirashna-btn-primary">
                          تأكيد التسجيل
                        </Button>

                        <p className="text-sm text-gray-500 text-center mt-4">
                          بالضغط على تأكيد التسجيل، أنت توافق على 
                          <Link to="/terms-conditions" className="text-wirashna-accent mx-1">الشروط والأحكام</Link>
                          و
                          <Link to="/privacy-policy" className="text-wirashna-accent mx-1">سياسة الخصوصية</Link>
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="wirashna-card sticky top-24">
                <h3 className="text-xl font-bold mb-4">تفاصيل الورشة</h3>
                
                <div className="flex items-center mb-4">
                  <Calendar size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">التاريخ</p>
                    <p className="text-gray-600">{workshop.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">الوقت</p>
                    <p className="text-gray-600">{workshop.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <MapPin size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">المكان</p>
                    <p className="text-gray-600">{workshop.venue}</p>
                    <p className="text-gray-600 text-sm">{workshop.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <Users size={18} className="ml-3 text-wirashna-accent" />
                  <div>
                    <p className="font-medium">المقاعد المتاحة</p>
                    <p className="text-gray-600">
                      {workshop.availableSeats} / {workshop.totalSeats}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="font-medium">السعر</p>
                  <p className="text-lg font-bold text-wirashna-accent">{workshop.price}</p>
                </div>
                
                <div className="hidden lg:block">
                  <h3 className="text-xl font-bold mb-4">سجل في الورشة</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <User size={18} className="absolute mt-3 mr-3 text-gray-400" />
                                <Input className="pr-10" placeholder="أدخل اسمك الكامل" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Mail size={18} className="absolute mt-3 mr-3 text-gray-400" />
                                <Input className="pr-10" type="email" placeholder="example@example.com" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Phone size={18} className="absolute mt-3 mr-3 text-gray-400" />
                                <Input className="pr-10" placeholder="+965 XXXX XXXX" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>طريقة الدفع</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <CreditCard size={18} className="absolute mt-3 mr-3 text-gray-400" />
                                <select
                                  className="w-full py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wirashna-accent"
                                  {...field}
                                >
                                  <option value="credit">بطاقة ائتمان</option>
                                  <option value="bank">تحويل بنكي</option>
                                  <option value="cash">نقداً عند الحضور</option>
                                </select>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full wirashna-btn-primary">
                        تأكيد التسجيل
                      </Button>

                      <p className="text-sm text-gray-500 text-center mt-4">
                        بالضغط على تأكيد التسجيل، أنت توافق على 
                        <Link to="/terms-conditions" className="text-wirashna-accent mx-1">الشروط والأحكام</Link>
                        و
                        <Link to="/privacy-policy" className="text-wirashna-accent mx-1">سياسة الخصوصية</Link>
                      </p>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>

          {relatedWorkshops.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">ورش ذات صلة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedWorkshops.map(workshop => (
                  <WorkshopCard 
                    key={workshop.id} 
                    id={workshop.id}
                    title={workshop.title}
                    description={workshop.description}
                    date={workshop.date}
                    time={workshop.time}
                    venue={workshop.venue}
                    availableSeats={workshop.availableSeats}
                    image={workshop.image}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
              <img 
                src={selectedImage} 
                alt="Workshop image" 
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkshopDetail;
