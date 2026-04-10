import { useState } from "react";
import { useProduct, useProductReviews, useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { StarRating } from "@/components/StarRating";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ShoppingCart, Heart, ExternalLink, ChevronLeft, ChevronRight, Share2, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

interface ProductPageProps {
  productId: string;
}

export default function ProductPage({ productId }: ProductPageProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading, error } = useProduct(productId);
  const { data: reviews } = useProductReviews(productId);
  const { data: related } = useProducts({ category: product?.category, limit: 8 });
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg font-medium">Product not found</p>
        <button onClick={() => navTo("/shop")} className="text-amber-400 hover:text-amber-300 text-sm">
          ← Back to shop
        </button>
      </div>
    );
  }

  const isWishlisted = hasItem(product.productId);
  const validImages = product.images?.filter((img) => img.startsWith("http://") || img.startsWith("https://")) ?? [];
  const currentImg = validImages[imgIndex];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.productId,
        title: product.title,
        price: product.price,
        affiliateLink: product.affiliateLink,
        image: validImages[0],
      });
    }
    setAddedToCart(true);
    toast.success("Added to cart!", { description: `${qty}x ${product.title}` });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedFiltered = related?.filter((p) => p.productId !== product.productId).slice(0, 8) ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navTo("/")} className="hover:text-amber-400 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navTo("/shop")} className="hover:text-amber-400 transition-colors">Shop</button>
          <span>/</span>
          <button onClick={() => navTo(`/shop/${product.category}`)} className="hover:text-amber-400 transition-colors capitalize">{product.category}</button>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Product detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square bg-[#111] rounded-2xl overflow-hidden border border-[#1f1f1f]">
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-20">🛍</span>
                </div>
              )}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + validImages.length) % validImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % validImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {validImages.length > 1 && (
              <div className="flex gap-2">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? "border-amber-500" : "border-[#222] hover:border-[#333]"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold px-3 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating!} size="md" showValue count={product.totalReviews} />
                <span className="text-gray-500 text-sm">({reviews?.length ?? 0} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-400">₹{product.price.toLocaleString("en-IN")}</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed border-t border-[#1f1f1f] pt-4">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-medium">Quantity:</span>
              <div className="flex items-center gap-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#252525] transition-all text-lg font-medium">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 text-gray-400 hover:text-white hover:bg-[#252525] transition-all text-lg font-medium">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-black"
                }`}
              >
                {addedToCart ? <CheckCircle className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={() => { toggleItem(product.productId); toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist"); }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-red-400 hover:text-red-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="w-12 h-12 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-gray-400 hover:text-white hover:border-[#3a3a3a] flex items-center justify-center transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Buy now / affiliate */}
            {product.affiliateLink && (
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 font-medium transition-all text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Buy from Partner Site
              </a>
            )}

            {/* Info boxes */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1f1f1f]">
              {[
                { emoji: "🚚", label: "Free Shipping", desc: "On orders ₹499+" },
                { emoji: "↩️", label: "Easy Return", desc: "7 days policy" },
                { emoji: "🔒", label: "Secure Pay", desc: "100% safe" },
              ].map(({ emoji, label, desc }) => (
                <div key={label} className="text-center p-2">
                  <div className="text-xl mb-1">{emoji}</div>
                  <p className="text-white text-[11px] font-bold">{label}</p>
                  <p className="text-gray-600 text-[10px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="mb-16">
            <SectionHeader title="Customer Reviews" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {reviews.map((review, i) => (
                <div key={i} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-3">
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-gray-500 text-xs mt-1">User #{review.userId}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {relatedFiltered.length > 0 && (
          <div>
            <SectionHeader
              title="You May Also Like"
              action={{ label: "View more", onClick: () => navTo(`/shop/${product.category}`) }}
            />
            <ProductGrid products={relatedFiltered} />
          </div>
        )}
      </div>
    </div>
  );
}
