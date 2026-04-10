import { useState } from "react";
import { fetchJSON, type Order } from "@/lib/api";
import {
  Package, Search, ChevronDown, ChevronUp, MapPin, Phone,
  Mail, Clock, CheckCircle, Truck, ShoppingBag, XCircle, Loader2, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending:   { label: "Order Placed",  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  icon: <Clock className="w-4 h-4" /> },
  confirmed: { label: "Confirmed",     color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   icon: <CheckCircle className="w-4 h-4" /> },
  shipped:   { label: "Shipped",       color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Delivered",     color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: "Cancelled",     color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    icon: <XCircle className="w-4 h-4" /> },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META["pending"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border", meta.color, meta.bg, meta.border)}>
      {meta.icon} {meta.label}
    </span>
  );
}

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-3">
        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-red-400 text-sm font-medium">This order was cancelled.</span>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-1">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const meta = STATUS_META[step];
        const isLast = idx === STATUS_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                done ? `${meta.border} ${meta.bg} ${meta.color}` : "border-[#2a2a2a] bg-[#111] text-gray-600"
              )}>
                {meta.icon}
              </div>
              <span className={cn("text-[10px] font-medium whitespace-nowrap", done ? meta.color : "text-gray-600")}>
                {meta.label}
              </span>
            </div>
            {!isLast && (
              <div className={cn("h-0.5 flex-1 mb-4 mx-1 rounded transition-all", idx < currentIdx ? "bg-amber-500/50" : "bg-[#2a2a2a]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) : "—";

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Package className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-white font-bold text-sm font-mono">{order.orderId}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 text-xs">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot; ₹{order.totalAmount.toLocaleString("en-IN")} &middot; {date}
          </p>
          <p className="text-gray-600 text-xs mt-0.5 truncate">
            {order.items.map((i) => i.title).join(", ")}
          </p>
        </div>
        <div className="shrink-0 text-gray-500 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#1a1a1a] px-5 pb-5 pt-4 space-y-5">
          {/* Timeline */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Order Progress</p>
            <StatusTimeline status={order.status} />
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Items Ordered</p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-amber-400 text-sm font-bold shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-4 py-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Delivery</span>
              <span className={order.totalAmount > order.items.reduce((s, i) => s + i.price * i.quantity, 0) ? "text-white" : "text-green-400"}>
                {order.totalAmount === order.items.reduce((s, i) => s + i.price * i.quantity, 0) ? "FREE" : `₹${(order.totalAmount - order.items.reduce((s, i) => s + i.price * i.quantity, 0)).toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="border-t border-[#222] pt-2 flex justify-between font-bold">
              <span className="text-white">Total Paid</span>
              <span className="text-amber-400 text-base">₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Delivery Address
            </p>
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-gray-300 leading-relaxed">
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.state} — {order.address.pincode}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-600" /> {order.customerPhone}
            </span>
            {order.customerEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-600" /> {order.customerEmail}
              </span>
            )}
            {order.createdAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-600" /> Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.trim();
    if (!/^\d{10}$/.test(cleaned)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(false);
    try {
      const data = await fetchJSON<Order[]>(`/orders?phone=${encodeURIComponent(cleaned)}`);
      setOrders(data);
      setSubmittedPhone(cleaned);
      setSearched(true);
    } catch {
      setError("Could not fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-3xl font-black text-white">My Orders</h1>
          </div>
          <p className="text-gray-500 text-sm ml-13">Enter your registered mobile number to view all your orders</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5">
            <label className="text-xs text-gray-500 font-medium mb-2 block uppercase tracking-wider">
              Registered Mobile Number
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={cn(
                    "w-full bg-[#1a1a1a] border rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all",
                    error ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={!loading ? {
                  background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                  boxShadow: "0 4px 0 #78350f, 0 6px 10px rgba(0,0,0,0.4)",
                } : {
                  background: "linear-gradient(to bottom, #d4a017 0%, #b8860b 100%)",
                }}
                className="px-5 py-3 rounded-xl text-black font-black text-sm transition-all active:translate-y-[3px] active:shadow-none flex items-center gap-2 disabled:opacity-70 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">
                {orders.length === 0
                  ? "No orders found"
                  : `${orders.length} order${orders.length !== 1 ? "s" : ""} found`}
              </h2>
              {orders.length > 0 && (
                <span className="text-gray-500 text-xs">for +91 {submittedPhone}</span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-20 h-20 bg-[#111] border border-[#1f1f1f] rounded-full flex items-center justify-center">
                  <Package className="w-9 h-9 text-gray-600" />
                </div>
                <div className="text-center">
                  <p className="text-gray-400 font-semibold mb-1">No orders yet</p>
                  <p className="text-gray-600 text-sm">No orders found for +91 {submittedPhone}.<br />Make sure you're using the same number you checked out with.</p>
                </div>
                <button
                  onClick={() => navTo("/shop")}
                  style={{
                    background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                    boxShadow: "0 4px 0 #78350f",
                  }}
                  className="mt-2 px-6 py-3 rounded-xl text-black font-black text-sm active:translate-y-1 active:shadow-none flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.orderId} order={order} />
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm py-3 border border-[#1f1f1f] rounded-xl hover:bg-white/[0.02] transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Orders
                </button>
              </div>
            )}
          </div>
        )}

        {/* First-time hint */}
        {!searched && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-16 h-16 bg-[#111] border border-[#1f1f1f] rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-amber-500/50" />
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Enter the mobile number you used during checkout to view and track all your LUXORA orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
