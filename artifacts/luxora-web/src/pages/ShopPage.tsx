import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductGrid } from "@/components/ProductGrid";
import { CATEGORIES } from "@/lib/api";
import { SlidersHorizontal, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopPageProps {
  category?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function ShopPage({ category }: ShopPageProps) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: products, isLoading, error } = useProducts({
    category: category === "all" || !category ? undefined : category,
    limit: 100,
  });

  const catInfo = CATEGORIES.find((c) => c.id === category);

  // Filter and sort
  const filtered = (products ?? [])
    .filter((p) => {
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <button onClick={() => navTo("/")} className="hover:text-amber-400 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navTo("/shop")} className="hover:text-amber-400 transition-colors">Shop</button>
            {catInfo && <>
              <span>/</span>
              <span className="text-gray-300">{catInfo.emoji} {catInfo.name}</span>
            </>}
          </div>
          <h1 className="text-3xl font-black text-white">
            {catInfo ? `${catInfo.emoji} ${catInfo.name}` : "All Products"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? "Loading..." : `${filtered.length} products`}
          </p>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => navTo("/shop")}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              !category
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-[#111] text-gray-400 border-[#222] hover:border-amber-500/50 hover:text-amber-400"
            )}
          >
            All
          </button>
          {CATEGORIES.filter((c) => c.id !== "digital").map((cat) => (
            <button
              key={cat.id}
              onClick={() => navTo(`/shop/${cat.id}`)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                category === cat.id
                  ? "bg-amber-500 text-black border-amber-500"
                  : "bg-[#111] text-gray-400 border-[#222] hover:border-amber-500/50 hover:text-amber-400"
              )}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Sort & Filter bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#111] border border-[#1f1f1f] rounded-xl px-3 py-2 flex-1 max-w-xs">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent text-sm text-gray-300 outline-none w-full"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              filterOpen
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-[#111] text-gray-400 border-[#1f1f1f] hover:border-amber-500/50"
            )}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          {(priceMin || priceMax) && (
            <button
              onClick={() => { setPriceMin(""); setPriceMax(""); }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-gray-400 bg-[#111] border border-[#222] hover:text-white transition-all"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="mb-6 bg-[#111] border border-[#1f1f1f] rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 text-sm">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50 w-full"
                />
              </div>
              <span className="text-gray-600">—</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-500 text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50 w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <ProductGrid products={filtered} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
