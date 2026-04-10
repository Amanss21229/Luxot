import { CheckCircle, ShoppingBag, Home, Send, Package } from "lucide-react";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

interface OrderSuccessPageProps {
  orderId?: string;
}

export default function OrderSuccessPage({ orderId }: OrderSuccessPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-6 inline-block">
          <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <div className="absolute inset-0 animate-ping w-24 h-24 bg-green-500/10 rounded-full mx-auto" style={{ animationDuration: "2s" }} />
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-400 mb-2">Thank you for shopping with LUXORA</p>

        {orderId && (
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-3 mb-6 inline-block">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-amber-400 font-mono font-bold text-sm">{orderId}</p>
          </div>
        )}

        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            { emoji: "📞", text: "We'll contact you on your provided phone number" },
            { emoji: "📦", text: "Your order will be processed within 1-2 business days" },
            { emoji: "🚚", text: "Delivery typically takes 3-7 business days" },
            { emoji: "💳", text: "Cash on delivery — pay when you receive your order" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{emoji}</span>
              <p className="text-gray-400 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navTo("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-white font-medium py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => navTo("/shop")}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Shop More
          </button>
        </div>

        <button
          onClick={() => navTo("/my-orders")}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#111] border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-bold py-3 rounded-xl transition-all"
        >
          <Package className="w-4 h-4" /> Track My Orders
        </button>

        <a
          href="https://t.me/LuxoraShoppingBot"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <Send className="w-4 h-4" /> Track order & get support on Telegram
        </a>
      </div>
    </div>
  );
}
