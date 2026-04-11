import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, Send, Package, Users } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { CATEGORIES } from "@/lib/api";
import { cn } from "@/lib/utils";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const totalItems = useCart((s) => s.totalItems());
  const wishlistItems = useWishlist((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navTo(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1f1f1f] shadow-2xl"
          : "bg-[#0a0a0a] border-b border-[#1a1a1a]"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <button onClick={() => navTo("/")} className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-black font-black text-sm">L</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight hidden sm:block">
                LUXORA
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <button onClick={() => navTo("/")} className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Home
              </button>
              <div className="relative" onMouseEnter={() => setShopDropdown(true)} onMouseLeave={() => setShopDropdown(false)}>
                <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                  Shop <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", shopDropdown && "rotate-180")} />
                </button>
                {shopDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#111] border border-[#222] rounded-xl shadow-2xl p-2 min-w-[180px] grid grid-cols-2 gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setShopDropdown(false); navTo(`/shop/${cat.id}`); }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 px-2.5 py-2 rounded-lg hover:bg-amber-500/10 transition-all text-left"
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span className="text-xs font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => navTo("/digital")} className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Luxora Learn
              </button>
              <button onClick={() => navTo("/my-orders")} className="flex items-center gap-1.5 text-gray-400 hover:text-amber-400 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                <Package className="w-4 h-4" /> My Orders
              </button>
              <button onClick={() => navTo("/affiliate")} className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-bold px-3 py-2 rounded-lg border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all">
                <Users className="w-4 h-4" /> Earn ₹50/Sale
              </button>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search bar (desktop) */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#1a1a1a] border border-amber-500/40 rounded-xl px-3 py-1.5 w-64">
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                  />
                  <button type="submit" className="text-amber-400">
                    <Search className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <a
                href="https://t.me/LuxoraShoppingBot"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Telegram Bot</span>
              </a>

              <button onClick={() => navTo("/wishlist")} className="relative p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems > 9 ? "9+" : wishlistItems}
                  </span>
                )}
              </button>

              <button onClick={() => navTo("/cart")} className="relative p-2 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f0f0f] border-t border-[#1a1a1a] px-4 py-4 flex flex-col gap-2">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 mb-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
              />
            </form>
            <button onClick={() => { navTo("/"); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-amber-400 py-2 px-2 rounded-lg transition-colors font-medium">Home</button>
            <div className="border-t border-[#1a1a1a] pt-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => { navTo(`/shop/${cat.id}`); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 py-2 px-2 rounded-lg hover:bg-amber-500/10 transition-all">
                    <span>{cat.emoji}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { navTo("/digital"); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-amber-400 py-2 px-2 rounded-lg transition-colors font-medium border-t border-[#1a1a1a] pt-3">Luxora Learn 🎓</button>
            <button onClick={() => { navTo("/my-orders"); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-left text-amber-400 hover:text-amber-300 py-2 px-2 rounded-lg transition-colors font-medium border-t border-[#1a1a1a] pt-3">
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => { navTo("/affiliate"); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-left text-amber-400 hover:text-amber-300 py-2 px-2 rounded-lg transition-colors font-bold border-t border-[#1a1a1a] pt-3">
              <Users className="w-4 h-4" /> 🤝 Earn ₹50/Sale — Affiliate
            </button>
            <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 py-2 px-2 rounded-lg font-medium border-t border-[#1a1a1a] pt-3">
              <Send className="w-4 h-4" /> Open Telegram Bot
            </a>
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
