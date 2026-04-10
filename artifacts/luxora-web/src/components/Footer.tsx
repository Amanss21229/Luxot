import { Send, Heart, Mail, Shield, Lock } from "lucide-react";
import { CATEGORIES } from "@/lib/api";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

const policyLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Service", path: "/terms-of-service" },
  { label: "Shipping Policy", path: "/shipping-policy" },
  { label: "Return & Refund", path: "/return-refund" },
  { label: "FAQ", path: "/faq" },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] mt-16">
      {/* Razorpay & Security trust strip */}
      <div className="bg-gradient-to-r from-[#0e0e0e] via-[#131313] to-[#0e0e0e] border-b border-[#1a1a1a] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-gray-400">100% Safe & Secure Payments via</span>
            <span className="font-black text-white tracking-tight">Razorpay</span>
            <span className="text-xs text-green-400 border border-green-400/30 bg-green-400/10 px-1.5 py-0.5 rounded-md">PCI DSS</span>
          </div>
          <div className="flex items-center gap-3">
            {["UPI", "Cards", "Net Banking", "Wallets", "EMI"].map((m) => (
              <span key={m} className="text-[11px] bg-[#1a1a1a] border border-[#252525] text-gray-500 px-2 py-1 rounded-md">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Telegram CTA */}
      <div className="bg-gradient-to-r from-[#111] via-amber-950/10 to-[#111] border-b border-[#1a1a1a] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Also shop on Telegram 🚀</h3>
            <p className="text-gray-400 text-sm">Same products, same prices — browse & shop in Telegram</p>
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
              A tool of Sansa Feel. Premium shopping on web & Telegram.
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

            {/* Razorpay badge */}
            <div className="mt-5 p-3 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[11px] text-green-400 font-semibold">Secured by Razorpay</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed">All transactions are 256-bit SSL encrypted. Your payment data is never stored on our servers.</p>
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
                { label: "Trending Now", path: "/shop?sort=trending" },
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

          {/* Legal & Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal & Support</h4>
            <ul className="flex flex-col gap-2">
              {policyLinks.map(({ label, path }) => (
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

            <div className="mt-6 space-y-2">
              {[
                { emoji: "🚚", text: "Free delivery on ₹499+" },
                { emoji: "↩️", text: "7-day easy returns" },
                { emoji: "🔒", text: "Razorpay secured checkout" },
                { emoji: "📞", text: "24/7 Telegram support" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-gray-600">
                  <span>{emoji}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} LUXORA — A Product of Sansa Feel. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {policyLinks.map(({ label, path }) => (
              <button key={path} onClick={() => navTo(path)} className="hover:text-amber-400 transition-colors">
                {label}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> in India</span>
        </div>
      </div>
    </footer>
  );
}
