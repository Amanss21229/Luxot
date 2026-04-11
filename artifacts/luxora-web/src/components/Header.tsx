import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, Send, Package, Users, Sun, Moon, Globe } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { CATEGORIES } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { LuxoraLogoMark } from "@/components/LuxoraLogo";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const totalItems = useCart((s) => s.totalItems());
  const wishlistItems = useWishlist((s) => s.items.length);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const isLight = theme === "light";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navTo(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  const headerBg = isLight
    ? scrolled
      ? "bg-white/95 backdrop-blur-xl border-b border-amber-100 shadow-lg"
      : "bg-white border-b border-amber-100"
    : scrolled
      ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1f1f1f] shadow-2xl"
      : "bg-[#0a0a0a] border-b border-[#1a1a1a]";

  const navBtnClass = isLight
    ? "text-gray-600 hover:text-amber-600 hover:bg-amber-50 text-sm font-medium px-3 py-2 rounded-lg transition-all"
    : "text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium px-3 py-2 rounded-lg transition-all";

  const mobileMenuBg = isLight ? "bg-white border-t border-amber-100" : "bg-[#0f0f0f] border-t border-[#1a1a1a]";
  const mobileTextClass = isLight ? "text-gray-700 hover:text-amber-600" : "text-gray-300 hover:text-amber-400";

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", headerBg)}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <button onClick={() => navTo("/")} className="flex items-center gap-2 shrink-0 group">
              <LuxoraLogoMark size={36} />
              <span
                className={cn("font-black text-xl tracking-tight hidden sm:block", isLight ? "text-gray-900" : "text-white")}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.06em" }}
              >
                LUXORA
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <button onClick={() => navTo("/")} className={navBtnClass}>{t.nav_home}</button>

              <div className="relative" onMouseEnter={() => setShopDropdown(true)} onMouseLeave={() => setShopDropdown(false)}>
                <button className={cn(navBtnClass, "flex items-center gap-1")}>
                  {t.nav_shop} <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", shopDropdown && "rotate-180")} />
                </button>
                {shopDropdown && (
                  <div className={cn(
                    "absolute top-full left-0 mt-1 rounded-xl shadow-2xl p-2 min-w-[180px] grid grid-cols-2 gap-1 border",
                    isLight ? "bg-white border-amber-100" : "bg-[#111] border-[#222]"
                  )}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setShopDropdown(false); navTo(`/shop/${cat.id}`); }}
                        className={cn(
                          "flex items-center gap-2 text-sm px-2.5 py-2 rounded-lg hover:bg-amber-500/10 transition-all text-left",
                          isLight ? "text-gray-600 hover:text-amber-600" : "text-gray-400 hover:text-amber-400"
                        )}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span className="text-xs font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => navTo("/digital")} className={navBtnClass}>{t.nav_learn}</button>
              <button onClick={() => navTo("/my-orders")} className={cn(navBtnClass, "flex items-center gap-1.5")}>
                <Package className="w-4 h-4" /> {t.nav_orders}
              </button>
              <button onClick={() => navTo("/affiliate")} className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 text-sm font-bold px-3 py-2 rounded-lg border border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/5 transition-all">
                <Users className="w-4 h-4" /> {t.nav_earn}
              </button>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search bar (desktop) */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearch} className={cn(
                  "flex items-center gap-2 border rounded-xl px-3 py-1.5 w-64",
                  isLight ? "bg-amber-50 border-amber-300" : "bg-[#1a1a1a] border-amber-500/40"
                )}>
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.search_placeholder}
                    className={cn("bg-transparent text-sm placeholder-gray-400 outline-none flex-1", isLight ? "text-gray-900" : "text-white")}
                  />
                  <button type="submit" className="text-amber-500"><Search className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className={cn("p-2 rounded-lg transition-all", isLight ? "text-gray-500 hover:text-gray-900 hover:bg-amber-50" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Language selector */}
              <div className="relative hidden sm:block" ref={langRef}>
                <button
                  onClick={() => setLangDropdown((v) => !v)}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border transition-all font-medium",
                    isLight
                      ? "text-gray-600 hover:text-amber-600 border-amber-200 hover:border-amber-400 hover:bg-amber-50"
                      : "text-gray-400 hover:text-white border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-white/5"
                  )}
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang.flag}</span>
                  <span className="hidden lg:inline">{currentLang.native}</span>
                </button>
                {langDropdown && (
                  <div className={cn(
                    "absolute top-full right-0 mt-1 rounded-xl shadow-2xl border py-1.5 min-w-[160px] z-50",
                    isLight ? "bg-white border-amber-100" : "bg-[#111] border-[#222]"
                  )}>
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangDropdown(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors",
                          l.code === lang
                            ? "text-amber-500 font-semibold"
                            : isLight
                              ? "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span>{l.native}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isLight
                    ? "text-amber-600 hover:bg-amber-50"
                    : "text-amber-400 hover:bg-white/5"
                )}
                title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <a
                href="https://t.me/LuxoraShoppingBot"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.telegram_bot}</span>
              </a>

              <button onClick={() => navTo("/wishlist")} className={cn("relative p-2 rounded-lg transition-all", isLight ? "text-gray-500 hover:text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-red-400 hover:bg-white/5")}>
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems > 9 ? "9+" : wishlistItems}
                  </span>
                )}
              </button>

              <button onClick={() => navTo("/cart")} className={cn("relative p-2 rounded-lg transition-all", isLight ? "text-gray-500 hover:text-amber-600 hover:bg-amber-50" : "text-gray-400 hover:text-amber-400 hover:bg-white/5")}>
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={cn("md:hidden p-2 rounded-lg transition-all", isLight ? "text-gray-500 hover:text-gray-900 hover:bg-amber-50" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={cn("md:hidden px-4 py-4 flex flex-col gap-2", mobileMenuBg)}>
            <form onSubmit={handleSearch} className={cn("flex items-center gap-2 border rounded-xl px-3 py-2 mb-2", isLight ? "bg-amber-50 border-amber-200" : "bg-[#1a1a1a] border-[#2a2a2a]")}>
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder}
                className={cn("bg-transparent text-sm placeholder-gray-400 outline-none flex-1", isLight ? "text-gray-900" : "text-white")}
              />
            </form>

            <button onClick={() => { navTo("/"); setMobileMenuOpen(false); }} className={cn("text-left py-2 px-2 rounded-lg transition-colors font-medium", mobileTextClass)}>{t.nav_home}</button>

            <div className={cn("border-t pt-2", isLight ? "border-amber-100" : "border-[#1a1a1a]")}>
              <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => { navTo(`/shop/${cat.id}`); setMobileMenuOpen(false); }} className={cn("flex items-center gap-2 text-sm py-2 px-2 rounded-lg hover:bg-amber-500/10 transition-all", isLight ? "text-gray-600 hover:text-amber-600" : "text-gray-400 hover:text-amber-400")}>
                    <span>{cat.emoji}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { navTo("/digital"); setMobileMenuOpen(false); }} className={cn("text-left py-2 px-2 rounded-lg transition-colors font-medium border-t pt-3", isLight ? "border-amber-100" : "border-[#1a1a1a]", mobileTextClass)}>
              {t.nav_learn} 🎓
            </button>
            <button onClick={() => { navTo("/my-orders"); setMobileMenuOpen(false); }} className={cn("flex items-center gap-2 text-left text-amber-500 hover:text-amber-400 py-2 px-2 rounded-lg transition-colors font-medium border-t pt-3", isLight ? "border-amber-100" : "border-[#1a1a1a]")}>
              <Package className="w-4 h-4" /> {t.nav_orders}
            </button>
            <button onClick={() => { navTo("/affiliate"); setMobileMenuOpen(false); }} className={cn("flex items-center gap-2 text-left text-amber-500 hover:text-amber-400 py-2 px-2 rounded-lg transition-colors font-bold border-t pt-3", isLight ? "border-amber-100" : "border-[#1a1a1a]")}>
              <Users className="w-4 h-4" /> 🤝 {t.nav_earn} — Affiliate
            </button>

            {/* Language selector mobile */}
            <div className={cn("border-t pt-3", isLight ? "border-amber-100" : "border-[#1a1a1a]")}>
              <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1"><Globe className="w-3 h-3" /> Language</p>
              <div className="grid grid-cols-3 gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                    className={cn(
                      "text-xs py-1.5 px-2 rounded-lg text-center transition-colors",
                      l.code === lang
                        ? "bg-amber-500/20 text-amber-400 font-semibold"
                        : isLight ? "text-gray-500 hover:bg-amber-50" : "text-gray-400 hover:bg-white/5"
                    )}
                  >
                    {l.flag} {l.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme toggle mobile */}
            <button
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
              className={cn("flex items-center gap-2 py-2 px-2 rounded-lg transition-colors font-medium border-t pt-3", isLight ? "border-amber-100 text-gray-600 hover:text-amber-600" : "border-[#1a1a1a] text-gray-300 hover:text-amber-400")}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>

            <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 text-blue-400 py-2 px-2 rounded-lg font-medium border-t pt-3", isLight ? "border-amber-100" : "border-[#1a1a1a]")}>
              <Send className="w-4 h-4" /> Open {t.telegram_bot}
            </a>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
