import { type Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { Loader2, PackageSearch } from "lucide-react";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  error?: Error | null;
  columns?: 2 | 3 | 4 | 5;
}

const colClass: Record<number, string> = {
  2: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  3: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
};

export function ProductGrid({ products, isLoading, error, columns = 4 }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-gray-500 text-sm">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <PackageSearch className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400 font-medium">Failed to load products</p>
        <p className="text-gray-600 text-sm text-center">Make sure the API server is running and try refreshing</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <PackageSearch className="w-12 h-12 text-gray-600" />
        <p className="text-gray-400 font-medium">No products found</p>
        <p className="text-gray-600 text-sm">Check back later or explore other categories</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass[columns] ?? colClass[4]} gap-4`}>
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}
