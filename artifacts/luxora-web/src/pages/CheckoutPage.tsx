import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { postJSON, type Order } from "@/lib/api";
import { Loader2, CheckCircle, ShoppingBag, MapPin, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
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
      });

      clearCart();
      navTo(`/order-success?orderId=${order.orderId}`);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
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
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
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

              {/* Payment method (info only) */}
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-gray-500 text-xs">Pay when your order arrives</p>
                  </div>
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
                        {item.image && (item.image.startsWith("http://") || item.image.startsWith("https://")) ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                  ) : (
                    <><CheckCircle className="w-5 h-5" /> Place Order</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
