import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useParams, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const DigitalStorePage = lazy(() => import("@/pages/DigitalStorePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
    </div>
  );
}

function ShopPageWrapper() {
  const params = useParams<{ category?: string }>();
  return <ShopPage category={params.category} />;
}

function ProductPageWrapper() {
  const params = useParams<{ id: string }>();
  return <ProductPage productId={params.id} />;
}

function OrderSuccessWrapper() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId") ?? undefined;
  return <OrderSuccessPage orderId={orderId} />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5">
      <div className="text-7xl">🔍</div>
      <h1 className="text-3xl font-black text-white">Page Not Found</h1>
      <p className="text-gray-500">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
      >
        Go Home
      </button>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const hideFooter = ["/cart", "/checkout"].some((p) => location.startsWith(p));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/shop" component={() => <ShopPage />} />
        <Route path="/shop/:category" component={ShopPageWrapper} />
        <Route path="/product/:id" component={ProductPageWrapper} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/order-success" component={OrderSuccessWrapper} />
        <Route path="/wishlist" component={WishlistPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/digital" component={DigitalStorePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#fff",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
