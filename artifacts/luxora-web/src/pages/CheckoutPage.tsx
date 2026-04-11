import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { fetchJSON, postJSON, type Order } from "@/lib/api";
import { Loader2, CheckCircle, ShoppingBag, MapPin, User, Lock, Shield, CreditCard, Zap } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", email: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-600" />
        <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
        <button onClick={() => navTo("/shop")} className="bg-amber-500 text-black font-bold px-6 py-3 rounded-xl">
          Start Shopping
        </button>
      </div>
    );
  }

  const deliveryFee = totalPrice() >= 499 ? 0 : 49;
  const grandTotal = totalPrice() + deliveryFee;

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) errs.phone = "Valid 10-digit phone required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.line1.trim()) errs.line1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) errs.pincode = "Valid 6-digit pincode required";
    return errs;
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      await loadRazorpayScript();

      const config = await fetchJSON<{ keyId: string }>("/payment/config");
      if (!config.keyId) {
        toast.error("Payment not configured. Please contact support.");
        setLoading(false);
        return;
      }

      const rzpOrder = await postJSON<{ id: string; amount: number; currency: string }>(
        "/payment/create-order",
        {
          amount: grandTotal,
          receipt: `order_${Date.now()}`,
        }
      );

      setLoading(false);

      const rzp = new window.Razorpay({
        key: config.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "LUXORA",
        description: `Order of ${items.length} item${items.length > 1 ? "s" : ""}`,
        order_id: rzpOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#f59e0b" },
        handler: async (response: RazorpayPaymentResponse) => {
          setLoading(true);
          try {
            const verification = await postJSON<{ valid: boolean }>("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verification.valid) {
              toast.error("Payment verification failed. Please contact support.");
              setLoading(false);
              return;
            }

            const affiliateCode = sessionStorage.getItem("luxora_ref") ?? undefined;
            const order = await postJSON<Order>("/orders", {
              items: items.map((item) => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                affiliateLink: item.affiliateLink,
              })),
              address: {
                line1: form.line1,
                line2: form.line2 || undefined,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                country: "India",
              },
              customerName: form.name,
              customerPhone: form.phone,
              customerEmail: form.email || undefined,
              totalAmount: grandTotal,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              affiliateCode,
            });
            if (affiliateCode) sessionStorage.removeItem("luxora_ref");

            clearCart();
            navTo(`/order-success?orderId=${order.orderId}`);
          } catch {
            toast.error("Something went wrong after payment. Contact support with your payment ID: " + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled. Your cart is intact.");
          },
        },
      });

      rzp.open();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
    "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh",
    "Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep","Puducherry","Andaman and Nicobar Islands"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-2">Checkout</h1>
        <p className="text-amber-400 text-sm font-semibold mb-8 flex items-center gap-2">
          <Zap className="w-4 h-4" fill="currentColor" />
          Advance payment required — 100% secure via Razorpay
        </p>

        <form onSubmit={handlePayNow}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" /> Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your full name"
                      className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.name ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Phone Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.phone ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="your@email.com"
                      className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.email ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" /> Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Address Line 1 *</label>
                    <input
                      type="text"
                      value={form.line1}
                      onChange={update("line1")}
                      placeholder="House/Flat No., Building, Street"
                      className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.line1 ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                    />
                    {errors.line1 && <p className="text-red-400 text-xs mt-1">{errors.line1}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={form.line2}
                      onChange={update("line2")}
                      placeholder="Area, Landmark"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1.5 block">City *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={update("city")}
                        placeholder="City"
                        className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.city ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1.5 block">State *</label>
                      <select
                        value={form.state}
                        onChange={update("state")}
                        className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.state ? "border-red-500 text-white" : "border-[#2a2a2a] focus:border-amber-500/50 text-white"}`}
                      >
                        <option value="" className="bg-[#1a1a1a] text-gray-500">Select State</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1.5 block">PIN Code *</label>
                      <input
                        type="text"
                        value={form.pincode}
                        onChange={update("pincode")}
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all ${errors.pincode ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"}`}
                      />
                      {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" /> Payment
                </h2>

                <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="currentColor" />
                  <div>
                    <p className="text-amber-400 text-sm font-bold">Advance Payment Only</p>
                    <p className="text-gray-500 text-xs mt-0.5">We accept advance payment only. Your order will be confirmed after successful payment.</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-green-400 text-xs font-bold">Secured by Razorpay</p>
                    <p className="text-gray-500 text-[11px]">256-bit SSL encrypted · PCI DSS Level 1 · Your data is never stored</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { label: "UPI (GPay, PhonePe, Paytm, etc.)", icon: "📱" },
                    { label: "Credit / Debit Card (Visa, Mastercard, RuPay)", icon: "💳" },
                    { label: "Net Banking", icon: "🏦" },
                    { label: "Digital Wallets", icon: "👛" },
                    { label: "EMI Options Available", icon: "📆" },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <span className="text-base">{icon}</span> {label}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#1f1f1f]">
                  <Lock className="w-3.5 h-3.5 text-gray-600" />
                  <p className="text-[11px] text-gray-600">
                    Payments processed securely via <span className="text-gray-400 font-semibold">Razorpay</span>. Clicking "Pay Now" will open the Razorpay payment popup.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-black text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={
                              item.image.startsWith("http://") || item.image.startsWith("https://")
                                ? item.image
                                : `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/images/${encodeURIComponent(item.image)}`
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🛍</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        <p className="text-amber-400 text-xs font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2a2a2a] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{totalPrice().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-400" : "text-white"}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t border-[#2a2a2a] pt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-amber-400 font-black text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* PAY NOW 3D Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={!loading ? {
                    background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                    boxShadow: "0 6px 0 #78350f, 0 8px 14px rgba(0,0,0,0.5)",
                    transition: "transform 0.1s, box-shadow 0.1s",
                  } : {
                    background: "linear-gradient(to bottom, #d4a017 0%, #b8860b 100%)",
                    boxShadow: "none",
                  }}
                  className="w-full mt-5 disabled:opacity-70 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider active:translate-y-[4px] active:shadow-none"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><Zap className="w-5 h-5" fill="currentColor" /> Pay ₹{grandTotal.toLocaleString("en-IN")} Now</>
                  )}
                </button>

                <p className="text-center text-gray-600 text-[10px] mt-3">
                  🔒 Secure payment via Razorpay
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
