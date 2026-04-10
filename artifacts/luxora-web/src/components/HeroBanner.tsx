import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Latest Gadgets & Tech",
    description: "Discover cutting-edge electronics at unbeatable prices",
    emoji: "📱",
    gradient: "from-blue-900/60 via-indigo-900/40 to-transparent",
    accent: "#3b82f6",
    category: "electronics",
  },
  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Style That Speaks",
    description: "Curated fashion picks for every occasion",
    emoji: "👗",
    gradient: "from-rose-900/60 via-pink-900/40 to-transparent",
    accent: "#f43f5e",
    category: "fashion",
  },
  {
    id: 3,
    title: "Luxora Learn",
    subtitle: "Knowledge Is Power",
    description: "Premium digital courses and resources",
    emoji: "🎓",
    gradient: "from-amber-900/60 via-yellow-900/40 to-transparent",
    accent: "#f59e0b",
    category: "digital",
  },
  {
    id: 4,
    title: "Home & Living",
    subtitle: "Transform Your Space",
    description: "Beautiful home decor and accessories",
    emoji: "🏠",
    gradient: "from-emerald-900/60 via-teal-900/40 to-transparent",
    accent: "#10b981",
    category: "home",
  },
];

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    setCurrent((c) => (c + 1) % slides.length);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#111] border border-[#1f1f1f]" style={{ minHeight: "400px" }}>
      {/* Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-r transition-all duration-700", slide.gradient)} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0a0a_80%)]" />

      {/* Floating emoji */}
      <div className={cn(
        "absolute right-12 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] opacity-20 select-none pointer-events-none transition-all duration-500",
        isAnimating ? "scale-75 opacity-0" : "scale-100"
      )}>
        {slide.emoji}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      {/* Content */}
      <div className={cn(
        "relative z-10 px-8 md:px-16 py-16 md:py-20 max-w-2xl transition-all duration-500",
        isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4" style={{ color: slide.accent }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: slide.accent }}>
            {slide.subtitle}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          {slide.title}
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md">{slide.description}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navTo(`/shop/${slide.category}`)}
            className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-black transition-all hover:opacity-90 hover:scale-105 active:scale-100 shadow-lg"
            style={{ backgroundColor: slide.accent }}
          >
            <ShoppingBag className="w-5 h-5" /> Shop Now
          </button>
          <button
            onClick={() => navTo("/shop")}
            className="font-medium px-6 py-3 rounded-xl text-white border border-white/20 hover:bg-white/10 transition-all"
          >
            View All
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-6 h-2 bg-amber-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
