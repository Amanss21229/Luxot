import { useWishlist } from "@/hooks/use-wishlist";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlist();
  const { data: allProducts, isLoading } = useProducts({ limit: 200 });

  const wishlistProducts = allProducts?.filter((p) => wishlistIds.includes(p.productId)) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (wishlistIds.length === 0 || wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5">
        <div className="w-24 h-24 bg-[#111] border border-[#1f1f1f] rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-black text-white">Your wishlist is empty</h2>
        <p className="text-gray-500 text-center max-w-sm">Save products you love and come back to them anytime</p>
        <button
          onClick={() => navTo("/shop")}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-2">
          My Wishlist <Heart className="inline w-7 h-7 text-red-400 fill-current" />
        </h1>
        <p className="text-gray-500 text-sm mb-8">{wishlistProducts.length} saved items</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
