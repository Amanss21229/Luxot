import { useQuery } from "@tanstack/react-query";
import { fetchJSON, type Product, type DigitalProduct, type Review } from "@/lib/api";

export function useProducts(options: { category?: string; search?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.search) params.set("search", options.search);
  if (options.limit) params.set("limit", String(options.limit));
  const qs = params.toString();

  return useQuery<Product[]>({
    queryKey: ["products", options],
    queryFn: () => fetchJSON<Product[]>(`/products${qs ? `?${qs}` : ""}`),
    staleTime: 1000 * 30,
  });
}

export function useTrendingProducts(limit = 8) {
  return useQuery<Product[]>({
    queryKey: ["products", "trending", limit],
    queryFn: () => fetchJSON<Product[]>(`/products/trending?limit=${limit}`),
    staleTime: 1000 * 60,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: () => fetchJSON<Product[]>(`/products/featured`),
    staleTime: 1000 * 60,
  });
}

export function useProduct(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchJSON<Product>(`/products/${productId}`),
    enabled: !!productId,
  });
}

export function useProductReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () => fetchJSON<Review[]>(`/products/${productId}/reviews`),
    enabled: !!productId,
  });
}

export function useDigitalProducts() {
  return useQuery<DigitalProduct[]>({
    queryKey: ["digital-products"],
    queryFn: () => fetchJSON<DigitalProduct[]>(`/digital-products`),
    staleTime: 1000 * 60,
  });
}
