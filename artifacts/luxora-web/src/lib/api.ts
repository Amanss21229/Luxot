const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${BASE}/api${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const url = `${BASE}/api${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export interface Product {
  productId: string;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  video?: string;
  affiliateLink?: string;
  clicks?: number;
  rating?: number;
  totalReviews?: number;
  createdAt?: string;
}

export interface DigitalProduct {
  productId: string;
  title: string;
  price: number;
  description: string;
  fileLink: string;
  createdAt?: string;
}

export interface Review {
  userId: number;
  productId: string;
  rating: number;
  createdAt?: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  address: Address;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  affiliateLink?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export const CATEGORIES = [
  { id: "electronics", name: "Electronics", emoji: "📱" },
  { id: "fashion", name: "Fashion", emoji: "👗" },
  { id: "shoes", name: "Shoes", emoji: "👟" },
  { id: "gadgets", name: "Gadgets", emoji: "🔧" },
  { id: "stationery", name: "Stationery", emoji: "📝" },
  { id: "home", name: "Home", emoji: "🏠" },
  { id: "accessories", name: "Accessories", emoji: "💎" },
  { id: "digital", name: "Digital Store", emoji: "🎓" },
];
