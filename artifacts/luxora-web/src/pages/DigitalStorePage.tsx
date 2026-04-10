import { useDigitalProducts } from "@/hooks/use-products";
import { BookOpen, Download, Loader2, PackageSearch, ExternalLink } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function DigitalStorePage() {
  const { data: products, isLoading, error } = useDigitalProducts();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0d1a0d] via-amber-950/20 to-[#0d1a0d] border-b border-[#1a1a1a] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Digital Products</span>
          <h1 className="text-4xl font-black text-white mb-3">Luxora Learn 🎓</h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Premium digital products — courses, PDFs, guides and more. Knowledge at your fingertips.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-gray-500 text-sm">Loading digital products...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-20 gap-3">
            <PackageSearch className="w-12 h-12 text-gray-600" />
            <p className="text-gray-400 font-medium">Failed to load products</p>
          </div>
        )}

        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-xl font-black text-white">Coming Soon!</h2>
            <p className="text-gray-500 text-center max-w-sm">
              Digital products are being added. Check our Telegram bot for the latest updates.
            </p>
            <a
              href="https://t.me/LuxoraShoppingBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Check on Telegram →
            </a>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 group"
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-amber-900/30 to-[#111] p-6 border-b border-[#1f1f1f]">
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-3">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400/70">Digital Product</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-amber-300 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-400">₹{product.price.toLocaleString("en-IN")}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addItem({ productId: product.productId, title: product.title, price: product.price });
                          toast.success("Added to cart!", { description: product.title });
                        }}
                        className="text-xs bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold px-3 py-2 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all"
                      >
                        + Cart
                      </button>
                      {product.fileLink && (
                        <a
                          href={product.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white font-semibold px-3 py-2 rounded-lg border border-blue-500/30 hover:border-blue-500 transition-all flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Preview
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
