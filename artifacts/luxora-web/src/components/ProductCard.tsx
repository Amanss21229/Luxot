import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { GetProductsResponseItem } from "@workspace/api-client-react";

interface ProductCardProps {
  product: GetProductsResponseItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlist();
  const { toast } = useToast();
  const inWishlist = hasItem(product.productId);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.productId,
      title: product.title,
      price: product.price,
      affiliateLink: product.affiliateLink,
    });
    toast({ title: "Added to cart", description: product.title });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleItem(product.productId);
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.title,
    });
  }

  const imageUrl = product.images?.[0] && !imgError ? product.images[0] : null;
  const isValidUrl = imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

  return (
    <div className="group border border-border bg-card hover:border-foreground/30 transition-all duration-200" data-testid={`card-product-${product.productId}`}>
      {/* Image */}
      <Link href={`/products/${product.productId}`}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
          {isValidUrl ? (
            <img
              src={imageUrl!}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              data-testid={`img-product-${product.productId}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-4xl font-bold text-muted-foreground/30" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {product.title[0]?.toUpperCase()}
              </span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {product.category}
            </Badge>
          </div>
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all ${inWishlist ? "bg-foreground text-white" : "bg-white/90 text-foreground hover:bg-foreground hover:text-white"}`}
            data-testid={`button-wishlist-${product.productId}`}
          >
            <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.productId}`}>
          <p className="text-sm font-medium leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors mb-1" data-testid={`text-title-${product.productId}`}>
            {product.title}
          </p>
        </Link>

        {/* Rating */}
        {product.rating != null && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3" fill={s <= Math.round(product.rating!) ? "hsl(43,74%,49%)" : "none"} stroke={s <= Math.round(product.rating!) ? "hsl(43,74%,49%)" : "currentColor"} />
              ))}
            </div>
            {product.totalReviews != null && (
              <span className="text-[10px] text-muted-foreground">({product.totalReviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <p className="text-base font-bold text-foreground mb-3" data-testid={`text-price-${product.productId}`}>
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddToCart} className="flex-1 h-8 text-xs" data-testid={`button-addcart-${product.productId}`}>
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
          <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button size="sm" variant="outline" className="w-full h-8 text-xs border-accent text-accent hover:bg-accent hover:text-white" data-testid={`button-buynow-${product.productId}`}>
              <ExternalLink className="w-3 h-3 mr-1" />
              Buy Now
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
