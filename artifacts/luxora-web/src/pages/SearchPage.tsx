import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductGrid } from "@/components/ProductGrid";
import { Search, X } from "lucide-react";

function getSearchQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") ?? "";
}

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function SearchPage() {
  const [inputQuery, setInputQuery] = useState(getSearchQuery);
  const [searchQuery, setSearchQuery] = useState(getSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: products, isLoading, error } = useProducts({
    search: searchQuery.trim() || undefined,
    limit: 100,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputQuery.trim();
    setSearchQuery(q);
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    window.history.replaceState({}, "", `${base}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search input */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex items-center gap-3 bg-[#111] border border-[#2a2a2a] focus-within:border-amber-500/50 rounded-2xl px-4 py-3 flex-1 transition-all">
              <Search className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="bg-transparent text-white placeholder-gray-500 outline-none flex-1 text-base"
              />
              {inputQuery && (
                <button type="button" onClick={() => { setInputQuery(""); setSearchQuery(""); }} className="text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-2xl transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results header */}
        <div className="mb-6">
          {searchQuery ? (
            <div>
              <h1 className="text-xl font-black text-white">
                Results for &quot;{searchQuery}&quot;
              </h1>
              {!isLoading && (
                <p className="text-gray-500 text-sm mt-1">
                  {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Type something to search products...</p>
          )}
        </div>

        {/* Results */}
        {searchQuery && (
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* No query state */}
        {!searchQuery && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Search for products</p>
            <p className="text-gray-600 text-sm mt-2">Try searching for electronics, fashion, shoes...</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["Electronics", "Fashion", "Shoes", "Gadgets", "Home"].map((term) => (
                <button
                  key={term}
                  onClick={() => { setInputQuery(term); setSearchQuery(term); }}
                  className="px-4 py-2 bg-[#111] border border-[#1f1f1f] rounded-xl text-sm text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
