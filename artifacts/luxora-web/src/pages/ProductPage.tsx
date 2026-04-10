import { useState } from "react";
import { useProduct, useProductReviews, useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { StarRating } from "@/components/StarRating";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Share2, Loader2, CheckCircle, Zap } from "lucide-react";
import { toast } from "sonner";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

function getImageUrl(img: string): string {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/api/images/${encodeURIComponent(img)}`;
}

interface ProductPageProps {
  productId: string;
}

export default function ProductPage({ productId }: ProductPageProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pressing, setPressing] = useState(false);

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
  const allImages = product.images ?? [];
  const imageUrls = allImages.map(getImageUrl).filter(Boolean);
  const currentImg = imageUrls[imgIndex];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.productId,
        title: product.title,
        price: product.price,
        affiliateLink: product.affiliateLink,
        image: allImages[0],
      });
    }
    setAddedToCart(true);
    toast.success("Added to cart!", { description: `${qty}x ${product.title}` });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
    } else {
      for (let i = 0; i < qty; i++) {
        addItem({
          productId: product.productId,
          title: product.title,
          price: product.price,
          affiliateLink: product.affiliateLink,
          image: allImages[0],
        });
      }
      navTo("/checkout");
    }
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
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % imageUrls.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-2">
                {imageUrls.map((img, i) => (
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

            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating!} size="md" showValue count={product.totalReviews} />
                <span className="text-gray-500 text-sm">({reviews?.length ?? 0} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-400">₹{product.price.toLocaleString("en-IN")}</span>
            </div>

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

            {/* BUY NOW 3D button */}
            <button
              onClick={handleBuyNow}
              onMouseDown={() => setPressing(true)}
              onMouseUp={() => setPressing(false)}
              onMouseLeave={() => setPressing(false)}
              onTouchStart={() => setPressing(true)}
              onTouchEnd={() => setPressing(false)}
              style={{
                transform: pressing ? "translateY(5px)" : "translateY(0px)",
                boxShadow: pressing
                  ? "0 2px 0 #78350f, 0 2px 6px rgba(0,0,0,0.5)"
                  : "0 7px 0 #78350f, 0 10px 16px rgba(0,0,0,0.5)",
                background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-black font-black text-lg uppercase tracking-widest"
            >
              <Zap className="w-6 h-6" fill="currentColor" />
              Buy Now
              <Zap className="w-6 h-6" fill="currentColor" />
            </button>

            {/* Add to Cart + Wishlist row */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[#1e1e1e] hover:bg-[#252525] text-amber-400 border border-amber-500/30 hover:border-amber-500/60"
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
