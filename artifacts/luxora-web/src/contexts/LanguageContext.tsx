import { createContext, useContext, useState } from "react";

export type LangCode = "en" | "hi" | "ta" | "te" | "bn" | "gu" | "mr" | "kn" | "ml";

export interface LangOption {
  code: LangCode;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LangOption[] = [
  { code: "en", label: "English",    native: "English",    flag: "🇬🇧" },
  { code: "hi", label: "Hindi",      native: "हिंदी",       flag: "🇮🇳" },
  { code: "ta", label: "Tamil",      native: "தமிழ்",       flag: "🇮🇳" },
  { code: "te", label: "Telugu",     native: "తెలుగు",      flag: "🇮🇳" },
  { code: "bn", label: "Bengali",    native: "বাংলা",       flag: "🇮🇳" },
  { code: "gu", label: "Gujarati",   native: "ગુજરાતી",     flag: "🇮🇳" },
  { code: "mr", label: "Marathi",    native: "मराठी",       flag: "🇮🇳" },
  { code: "kn", label: "Kannada",    native: "ಕನ್ನಡ",      flag: "🇮🇳" },
  { code: "ml", label: "Malayalam",  native: "മലയാളം",     flag: "🇮🇳" },
];

type Translations = {
  nav_home: string;
  nav_shop: string;
  nav_learn: string;
  nav_orders: string;
  nav_earn: string;
  nav_wishlist: string;
  nav_cart: string;
  search_placeholder: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  add_to_cart: string;
  buy_now: string;
  out_of_stock: string;
  view_all: string;
  trending: string;
  new_arrivals: string;
  telegram_bot: string;
  affiliate_title: string;
  affiliate_sub: string;
  earn_per_sale: string;
  monthly_earn: string;
};

const translations: Record<LangCode, Translations> = {
  en: {
    nav_home: "Home",
    nav_shop: "Shop",
    nav_learn: "Luxora Learn",
    nav_orders: "My Orders",
    nav_earn: "Earn ₹50/Sale",
    nav_wishlist: "Wishlist",
    nav_cart: "Cart",
    search_placeholder: "Search products...",
    hero_title: "Discover Premium Products",
    hero_subtitle: "Quality you can trust, prices you'll love",
    hero_cta: "Shop Now",
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    out_of_stock: "Out of Stock",
    view_all: "View All",
    trending: "Trending Now",
    new_arrivals: "New Arrivals",
    telegram_bot: "Telegram Bot",
    affiliate_title: "Earn ₹50 Per Sale",
    affiliate_sub: "Share LUXORA products and earn ₹50 every time someone buys through your link",
    earn_per_sale: "₹50 per sale",
    monthly_earn: "Earn ₹15,000–₹20,000/month",
  },
  hi: {
    nav_home: "होम",
    nav_shop: "शॉप",
    nav_learn: "लक्सोरा लर्न",
    nav_orders: "मेरे ऑर्डर",
    nav_earn: "₹50/बिक्री कमाएं",
    nav_wishlist: "विशलिस्ट",
    nav_cart: "कार्ट",
    search_placeholder: "उत्पाद खोजें...",
    hero_title: "प्रीमियम उत्पाद खोजें",
    hero_subtitle: "भरोसेमंद गुणवत्ता, किफायती दाम",
    hero_cta: "अभी खरीदें",
    add_to_cart: "कार्ट में जोड़ें",
    buy_now: "अभी खरीदें",
    out_of_stock: "स्टॉक में नहीं",
    view_all: "सभी देखें",
    trending: "ट्रेंडिंग",
    new_arrivals: "नए आइटम",
    telegram_bot: "टेलीग्राम बॉट",
    affiliate_title: "हर बिक्री पर ₹50 कमाएं",
    affiliate_sub: "LUXORA उत्पाद शेयर करें और हर खरीद पर ₹50 कमाएं",
    earn_per_sale: "₹50 प्रति बिक्री",
    monthly_earn: "₹15,000–₹20,000/माह कमाएं",
  },
  ta: {
    nav_home: "முகப்பு",
    nav_shop: "கடை",
    nav_learn: "லக்சோரா கற்க",
    nav_orders: "என் ஆர்டர்கள்",
    nav_earn: "₹50/விற்பனை சம்பாதிக்க",
    nav_wishlist: "விஷ்லிஸ்ட்",
    nav_cart: "கார்ட்",
    search_placeholder: "தயாரிப்புகளை தேடுங்கள்...",
    hero_title: "பிரீமியம் தயாரிப்புகளை கண்டறியுங்கள்",
    hero_subtitle: "நம்பகமான தரம், கவர்ச்சிகரமான விலை",
    hero_cta: "இப்போது வாங்குங்கள்",
    add_to_cart: "கார்டில் சேர்",
    buy_now: "இப்போது வாங்கு",
    out_of_stock: "இல்லை",
    view_all: "அனைத்தும் பார்",
    trending: "டிரெண்டிங்",
    new_arrivals: "புதிய வருகை",
    telegram_bot: "டெலிகிராம் பாட்",
    affiliate_title: "ஒவ்வொரு விற்பனையிலும் ₹50 சம்பாதிக்க",
    affiliate_sub: "LUXORA தயாரிப்புகளை பகிர்ந்து ₹50 சம்பாதிக்கவும்",
    earn_per_sale: "₹50 ஒவ்வொரு விற்பனைக்கும்",
    monthly_earn: "மாதம் ₹15,000–₹20,000 சம்பாதிக்க",
  },
  te: {
    nav_home: "హోమ్",
    nav_shop: "షాప్",
    nav_learn: "లక్సోరా లర్న్",
    nav_orders: "నా ఆర్డర్లు",
    nav_earn: "₹50/అమ్మకానికి సంపాదించు",
    nav_wishlist: "విష్‌లిస్ట్",
    nav_cart: "కార్ట్",
    search_placeholder: "ఉత్పత్తులు వెతకండి...",
    hero_title: "ప్రీమియం ఉత్పత్తులు కనుగొనండి",
    hero_subtitle: "నమ్మకమైన నాణ్యత, అందుబాటు ధర",
    hero_cta: "ఇప్పుడు కొనండి",
    add_to_cart: "కార్ట్‌కు జోడించు",
    buy_now: "ఇప్పుడు కొనండి",
    out_of_stock: "స్టాక్ లేదు",
    view_all: "అన్నీ చూడండి",
    trending: "ట్రెండింగ్",
    new_arrivals: "కొత్త రాకలు",
    telegram_bot: "టెలిగ్రామ్ బాట్",
    affiliate_title: "ప్రతి అమ్మకంపై ₹50 సంపాదించు",
    affiliate_sub: "LUXORA ఉత్పత్తులు షేర్ చేసి ₹50 సంపాదించండి",
    earn_per_sale: "₹50 అమ్మకానికి",
    monthly_earn: "నెలకు ₹15,000–₹20,000 సంపాదించండి",
  },
  bn: {
    nav_home: "হোম",
    nav_shop: "শপ",
    nav_learn: "লাক্সোরা লার্ন",
    nav_orders: "আমার অর্ডার",
    nav_earn: "₹50/বিক্রয় আয় করুন",
    nav_wishlist: "উইশলিস্ট",
    nav_cart: "কার্ট",
    search_placeholder: "পণ্য খুঁজুন...",
    hero_title: "প্রিমিয়াম পণ্য আবিষ্কার করুন",
    hero_subtitle: "বিশ্বস্ত মান, সাশ্রয়ী মূল্য",
    hero_cta: "এখনই কিনুন",
    add_to_cart: "কার্টে যোগ করুন",
    buy_now: "এখনই কিনুন",
    out_of_stock: "স্টক নেই",
    view_all: "সব দেখুন",
    trending: "ট্রেন্ডিং",
    new_arrivals: "নতুন পণ্য",
    telegram_bot: "টেলিগ্রাম বট",
    affiliate_title: "প্রতিটি বিক্রয়ে ₹50 আয় করুন",
    affiliate_sub: "LUXORA পণ্য শেয়ার করুন এবং প্রতিটি কেনাকাটায় ₹50 আয় করুন",
    earn_per_sale: "₹50 প্রতি বিক্রয়",
    monthly_earn: "মাসে ₹15,000–₹20,000 আয় করুন",
  },
  gu: {
    nav_home: "હોમ",
    nav_shop: "શૉપ",
    nav_learn: "લક્ઝોરા શીખો",
    nav_orders: "મારા ઓર્ડર",
    nav_earn: "₹50/વેચાણ કમાઓ",
    nav_wishlist: "વિષ્ટલિસ્ટ",
    nav_cart: "કાર્ટ",
    search_placeholder: "ઉત્પાદનો શોધો...",
    hero_title: "પ્રીમિયમ ઉત્પાદનો શોધો",
    hero_subtitle: "વિશ્વસનીય ગુણવત્તા, ઓછી કિંમત",
    hero_cta: "હવે ખરીદો",
    add_to_cart: "કાર્ટમાં ઉમેરો",
    buy_now: "હવે ખરીદો",
    out_of_stock: "સ્ટૉક નથી",
    view_all: "બધું જુઓ",
    trending: "ટ્રેન્ડિંગ",
    new_arrivals: "નવી આવક",
    telegram_bot: "ટેલિગ્રામ બૉટ",
    affiliate_title: "દરેક વેચાણ પર ₹50 કમાઓ",
    affiliate_sub: "LUXORA ઉત્પાદનો શૅર કરો અને ₹50 કમાઓ",
    earn_per_sale: "₹50 પ્રતિ વેચાણ",
    monthly_earn: "મહિને ₹15,000–₹20,000 કમાઓ",
  },
  mr: {
    nav_home: "होम",
    nav_shop: "शॉप",
    nav_learn: "लक्सोरा शिकणे",
    nav_orders: "माझे ऑर्डर",
    nav_earn: "₹50/विक्री कमवा",
    nav_wishlist: "विशलिस्ट",
    nav_cart: "कार्ट",
    search_placeholder: "उत्पादने शोधा...",
    hero_title: "प्रीमियम उत्पादने शोधा",
    hero_subtitle: "विश्वासू गुणवत्ता, परवडणारी किंमत",
    hero_cta: "आता खरेदी करा",
    add_to_cart: "कार्टमध्ये जोडा",
    buy_now: "आता खरेदी करा",
    out_of_stock: "साठा नाही",
    view_all: "सर्व पहा",
    trending: "ट्रेंडिंग",
    new_arrivals: "नवीन आगमन",
    telegram_bot: "टेलिग्राम बॉट",
    affiliate_title: "प्रत्येक विक्रीवर ₹50 कमवा",
    affiliate_sub: "LUXORA उत्पादने शेअर करा आणि ₹50 कमवा",
    earn_per_sale: "₹50 प्रति विक्री",
    monthly_earn: "महिना ₹15,000–₹20,000 कमवा",
  },
  kn: {
    nav_home: "ಮನೆ",
    nav_shop: "ಶಾಪ್",
    nav_learn: "ಲಕ್ಸೊರಾ ಕಲಿ",
    nav_orders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    nav_earn: "₹50/ಮಾರಾಟ ಗಳಿಸಿ",
    nav_wishlist: "ವಿಶ್‌ಲಿಸ್ಟ್",
    nav_cart: "ಕಾರ್ಟ್",
    search_placeholder: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...",
    hero_title: "ಪ್ರೀಮಿಯಂ ಉತ್ಪನ್ನಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    hero_subtitle: "ವಿಶ್ವಾಸಾರ್ಹ ಗುಣಮಟ್ಟ, ಕೈಗೆಟುಕುವ ಬೆಲೆ",
    hero_cta: "ಈಗ ಖರೀದಿಸಿ",
    add_to_cart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    buy_now: "ಈಗ ಖರೀದಿಸಿ",
    out_of_stock: "ಸ್ಟಾಕ್ ಇಲ್ಲ",
    view_all: "ಎಲ್ಲ ನೋಡಿ",
    trending: "ಟ್ರೆಂಡಿಂಗ್",
    new_arrivals: "ಹೊಸ ಆಗಮನ",
    telegram_bot: "ಟೆಲಿಗ್ರಾಮ್ ಬಾಟ್",
    affiliate_title: "ಪ್ರತಿ ಮಾರಾಟದಲ್ಲಿ ₹50 ಗಳಿಸಿ",
    affiliate_sub: "LUXORA ಉತ್ಪನ್ನಗಳನ್ನು ಹಂಚಿ ₹50 ಗಳಿಸಿ",
    earn_per_sale: "₹50 ಪ್ರತಿ ಮಾರಾಟ",
    monthly_earn: "ತಿಂಗಳಿಗೆ ₹15,000–₹20,000 ಗಳಿಸಿ",
  },
  ml: {
    nav_home: "ഹോം",
    nav_shop: "ഷോപ്പ്",
    nav_learn: "ലക്സോറ ലേൺ",
    nav_orders: "എന്റെ ഓർഡറുകൾ",
    nav_earn: "₹50/വിൽപ്പന നേടൂ",
    nav_wishlist: "വിഷ്‌ലിസ്റ്റ്",
    nav_cart: "കാർട്ട്",
    search_placeholder: "ഉൽപ്പന്നങ്ങൾ തിരയൂ...",
    hero_title: "പ്രീമിയം ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തൂ",
    hero_subtitle: "വിശ്വസനീയ ഗുണനിലവാരം, താങ്ങാനാവുന്ന വില",
    hero_cta: "ഇപ്പോൾ വാങ്ങൂ",
    add_to_cart: "കാർട്ടിലേക്ക് ചേർക്കൂ",
    buy_now: "ഇപ്പോൾ വാങ്ങൂ",
    out_of_stock: "സ്റ്റോക്കില്ല",
    view_all: "എല്ലാം കാണൂ",
    trending: "ട്രെൻഡിങ്",
    new_arrivals: "പുതിയ വരവ്",
    telegram_bot: "ടെലിഗ്രാം ബോട്ട്",
    affiliate_title: "ഓരോ വിൽപ്പനയിലും ₹50 നേടൂ",
    affiliate_sub: "LUXORA ഉൽപ്പന്നങ്ങൾ പങ്കിട്ട് ₹50 നേടൂ",
    earn_per_sale: "₹50 ഓരോ വിൽപ്പനക്കും",
    monthly_earn: "മാസം ₹15,000–₹20,000 നേടൂ",
  },
};

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const stored = localStorage.getItem("luxora_lang") as LangCode | null;
    return stored && translations[stored] ? stored : "en";
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("luxora_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
