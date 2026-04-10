import { Send, Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/api";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] mt-16">
      {/* Telegram CTA */}
      <div className="bg-gradient-to-r from-[#111] via-amber-950/20 to-[#111] border-b border-[#1a1a1a] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Shop on Telegram Too! 🚀</h3>
            <p className="text-gray-400 text-sm">Browse, shop, and get deals directly via our Telegram bot</p>
          </div>
          <a
            href="https://t.me/LuxoraShoppingBot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 shrink-0"
          >
            <Send className="w-5 h-5" /> Open @LuxoraShoppingBot
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-black font-black text-base">L</span>
              </div>
              <span className="text-white font-black text-2xl tracking-tight">LUXORA</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              A tool of Sansa Feel. Premium shopping experience on web and Telegram.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> support@luxora.shop
              </span>
              <a
                href="https://t.me/LuxoraShoppingBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Send className="w-4 h-4 text-blue-400" /> @LuxoraShoppingBot
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navTo(`/shop/${cat.id}`)}
                    className="text-gray-500 hover:text-amber-400 text-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-base">{cat.emoji}</span> {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "All Products", path: "/shop" },
                { label: "Trending", path: "/shop?sort=trending" },
                { label: "Luxora Learn", path: "/digital" },
                { label: "My Cart", path: "/cart" },
                { label: "My Wishlist", path: "/wishlist" },
              ].map(({ label, path }) => (
                <li key={path}>
                  <button
                    onClick={() => navTo(path)}
                    className="text-gray-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Information</h4>
            <ul className="flex flex-col gap-2">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Shipping Policy",
                "Return & Refund",
                "FAQ",
              ].map((label) => (
                <li key={label}>
                  <span className="text-gray-500 hover:text-amber-400 text-sm transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 bg-[#111] rounded-xl border border-[#1f1f1f]">
              <p className="text-xs text-gray-600 mb-2">Secure Payments</p>
              <div className="flex gap-2 flex-wrap">
                {["💳 UPI", "🏦 Net Banking", "📱 Wallets"].map((m) => (
                  <span key={m} className="text-xs bg-[#1a1a1a] text-gray-500 px-2 py-1 rounded-md">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} LUXORA - A Tool of Sansa Feel. All rights reserved.</span>
          <span className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> in India</span>
        </div>
      </div>
    </footer>
  );
}
