import { useState } from "react";
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { type Product } from "@/lib/api";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function getImageUrl(img: string): string {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/api/images/${encodeURIComponent(img)}`;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressing, setPressing] = useState(false);
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const isWishlisted = hasItem(product.productId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      productId: product.productId,
      title: product.title,
      price: product.price,
      affiliateLink: product.affiliateLink,
      image: product.images?.[0],
    });
    toast.success("Added to cart!", { description: product.title });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleItem(product.productId);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist", { description: product.title });
  };

  const handleClick = () => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    window.location.href = `${base}/product/${product.productId}`;
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.affiliateLink) {
      window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
    } else {
      addItem({
        productId: product.productId,
        title: product.title,
        price: product.price,
        affiliateLink: product.affiliateLink,
        image: product.images?.[0],
      });
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/checkout`;
    }
  };

  const firstImage = product.images?.[0];
  const imageSrc = !imgError && firstImage ? getImageUrl(firstImage) : "";

  return (
    <div
      className={cn(
        "group relative bg-[#141414] border border-[#252525] rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#0f0f0f] overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#252525]">
            <span className="text-6xl opacity-20">🛍</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-3 gap-2 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}>
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 hover:bg-amber-500 hover:border-amber-500 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-400 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border",
            isWishlisted
              ? "bg-red-500 border-red-500 text-white"
              : "bg-black/50 backdrop-blur-sm border-white/10 text-gray-400 hover:border-red-400 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-all", isWishlisted && "fill-current scale-110")} />
        </button>

        {/* Category */}
        <span className="absolute top-3 left-3 text-[10px] bg-black/60 backdrop-blur-sm text-amber-400 font-semibold px-2 py-0.5 rounded-full capitalize border border-amber-500/20">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-100 line-clamp-2 leading-snug mb-2 group-hover:text-amber-300 transition-colors">
          {product.title}
        </h3>

        {(product.rating ?? 0) > 0 && (
          <div className="mb-2">
            <StarRating rating={product.rating!} showValue count={product.totalReviews} />
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-amber-400">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-xs bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all duration-200"
          >
            + Cart
          </button>
        </div>

        {/* BUY NOW 3D Button */}
        <button
          onClick={handleBuyNow}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          style={{
            transform: pressing ? "translateY(4px)" : "translateY(0px)",
            boxShadow: pressing
              ? "0 2px 0 #92400e, 0 2px 4px rgba(0,0,0,0.5)"
              : "0 6px 0 #92400e, 0 8px 12px rgba(0,0,0,0.5)",
            background: "linear-gradient(to bottom, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
            transition: "transform 0.1s, box-shadow 0.1s",
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-black font-black text-sm uppercase tracking-wider"
        >
          <Zap className="w-4 h-4" fill="currentColor" />
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
