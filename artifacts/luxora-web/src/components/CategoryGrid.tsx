import { CATEGORIES } from "@/lib/api";
import { cn } from "@/lib/utils";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

const categoryColors: Record<string, string> = {
  electronics: "from-blue-900/50 to-blue-950/30 border-blue-800/30 hover:border-blue-500/50",
  fashion: "from-pink-900/50 to-rose-950/30 border-pink-800/30 hover:border-pink-500/50",
  shoes: "from-orange-900/50 to-amber-950/30 border-orange-800/30 hover:border-orange-500/50",
  gadgets: "from-purple-900/50 to-violet-950/30 border-purple-800/30 hover:border-purple-500/50",
  stationery: "from-teal-900/50 to-cyan-950/30 border-teal-800/30 hover:border-teal-500/50",
  home: "from-emerald-900/50 to-green-950/30 border-emerald-800/30 hover:border-emerald-500/50",
  accessories: "from-yellow-900/50 to-amber-950/30 border-yellow-800/30 hover:border-yellow-500/50",
  digital: "from-amber-900/50 to-yellow-950/30 border-amber-800/30 hover:border-amber-500/50",
};

export function CategoryGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Shop by Category</h2>
        <button
          onClick={() => navTo("/shop")}
          className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navTo(`/shop/${cat.id}`)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left",
              categoryColors[cat.id] ?? "from-gray-900/50 to-gray-950/30 border-gray-800/30 hover:border-gray-500/50"
            )}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 block">
              {cat.emoji}
            </div>
            <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              {cat.name}
            </p>
            <div className="absolute bottom-2 right-2 text-white/10 text-xs font-black uppercase tracking-wider">
              →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
