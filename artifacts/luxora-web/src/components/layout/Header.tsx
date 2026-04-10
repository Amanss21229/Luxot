import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, Search, Menu, X, MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useCart((s) => s.items);
  const wishlistItems = useWishlist((s) => s.items);

  const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  }

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/trending", label: "Trending" },
    { href: "/learn", label: "Luxora Learn" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
              <div className="w-9 h-9 bg-foreground flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>L</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold tracking-widest uppercase text-foreground leading-none">LUXORA</p>
                <p className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase">A Tool of Sansa Feel</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                <span className={`text-sm font-medium tracking-wide uppercase hover:text-accent transition-colors cursor-pointer ${location === l.href ? "text-accent" : "text-foreground"}`} data-testid={`nav-${l.label.toLowerCase()}`}>
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9 text-sm"
                data-testid="input-search-header"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-wishlist">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </Link>
            <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="hidden sm:flex" data-testid="button-telegram">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 h-9 text-sm"
                  data-testid="input-search-mobile"
                />
              </div>
              <Button type="submit" size="sm">Search</Button>
            </form>
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}>
                  <span className="block text-sm font-medium uppercase tracking-wide text-foreground hover:text-accent cursor-pointer" onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </span>
                </Link>
              ))}
              <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer" className="text-sm font-medium uppercase tracking-wide text-accent">
                Shop on Telegram
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
