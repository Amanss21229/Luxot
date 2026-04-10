import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
}

export function StarRating({ rating, max = 5, size = "sm", showValue = false, count }: StarRatingProps) {
  const sizeClass = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(sizeClass, filled || partial ? "fill-amber-400 text-amber-400" : "text-gray-600")}
          />
        );
      })}
      {showValue && (
        <span className="text-xs text-gray-400 ml-1">
          {rating.toFixed(1)}{count !== undefined ? ` (${count})` : ""}
        </span>
      )}
    </div>
  );
}
