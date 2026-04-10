import { Link } from "wouter";
import { MessageCircle, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>L</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-widest uppercase leading-none">LUXORA</p>
                <p className="text-[9px] tracking-[0.12em] text-white/60 uppercase">A Tool of Sansa Feel</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your premium shopping destination. Curated products. Unbeatable deals.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80">Shop</h4>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/trending", label: "Trending" },
                { href: "/category/electronics", label: "Electronics" },
                { href: "/category/fashion", label: "Fashion" },
                { href: "/learn", label: "Luxora Learn" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-sm text-white/60 hover:text-accent cursor-pointer transition-colors">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80">Info</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/cart", label: "My Cart" },
                { href: "/wishlist", label: "Wishlist" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-sm text-white/60 hover:text-accent cursor-pointer transition-colors">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-white/80">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                data-testid="link-telegram-footer">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <a href="https://t.me/LuxoraShoppingBot" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-accent border border-accent px-3 py-2 hover:bg-accent hover:text-white transition-colors">
              <MessageCircle className="w-3 h-3" />
              Shop on Telegram
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© 2026 LUXORA. All rights reserved.</p>
          <p className="text-xs text-white/40">Affiliated products. Prices may vary.</p>
        </div>
      </div>
    </footer>
  );
}
