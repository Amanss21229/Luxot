import { useFeaturedProducts, useTrendingProducts } from "@/hooks/use-products";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { TrendingUp, Star, Send, Shield, Truck, RefreshCw } from "lucide-react";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function HomePage() {
  const featured = useFeaturedProducts();
  const trending = useTrendingProducts(8);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-14">

        {/* Hero */}
        <HeroBanner />

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, label: "Fast Delivery", desc: "Pan India shipping" },
            { icon: Shield, label: "100% Secure", desc: "Encrypted payments" },
            { icon: RefreshCw, label: "Easy Returns", desc: "7-day return policy" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">{label}</p>
                <p className="text-gray-500 text-[11px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <CategoryGrid />

        {/* Featured Products */}
        <div>
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked by our team"
            action={{ label: "View all", onClick: () => navTo("/shop") }}
          />
          <ProductGrid
            products={featured.data}
            isLoading={featured.isLoading}
            error={featured.error}
          />
        </div>

        {/* Trending */}
        <div>
          <SectionHeader
            title={<span className="flex items-center gap-2"><TrendingUp className="w-6 h-6 text-amber-400" /> Trending Now</span>}
            subtitle="Most popular picks right now"
            action={{ label: "See more", onClick: () => navTo("/shop?sort=trending") }}
          />
          <ProductGrid
            products={trending.data}
            isLoading={trending.isLoading}
            error={trending.error}
          />
        </div>

        {/* Telegram CTA Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1f3c] via-[#0f2a4d] to-[#0d1f3c] border border-blue-800/30 p-8 md:p-12">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 70% 50%, #1d4ed8 0%, transparent 50%)"
          }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">Also available on Telegram</p>
              <h3 className="text-3xl font-black text-white mb-2">Shop on the Go! 🚀</h3>
              <p className="text-gray-400">Get exclusive deals, instant updates, and shop directly from Telegram. Admins update products in real-time!</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="https://t.me/LuxoraShoppingBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 whitespace-nowrap"
              >
                <Send className="w-5 h-5" />
                Open on Telegram
              </a>
              <p className="text-blue-400/60 text-xs text-center">@LuxoraShoppingBot</p>
            </div>
          </div>
        </div>

        {/* Why Luxora */}
        <div>
          <SectionHeader title="Why Choose Luxora?" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🛡️", title: "Verified Products", desc: "Every product is manually verified by our team" },
              { emoji: "⚡", title: "Real-time Updates", desc: "Products sync instantly between Telegram & Web" },
              { emoji: "💬", title: "24/7 Support", desc: "Chat with us on Telegram anytime" },
              { emoji: "🎯", title: "Best Prices", desc: "Curated deals and affiliate savings" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 hover:border-amber-500/30 transition-all">
                <div className="text-3xl mb-3">{emoji}</div>
                <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
