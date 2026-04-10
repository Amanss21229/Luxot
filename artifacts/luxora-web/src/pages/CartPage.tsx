import { Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5">
        <div className="text-7xl">🛒</div>
        <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
        <p className="text-gray-500 text-center max-w-sm">Looks like you haven't added anything yet. Explore our collection!</p>
        <button
          onClick={() => navTo("/shop")}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" /> Start Shopping
        </button>
      </div>
    );
  }

  const deliveryFee = totalPrice() >= 499 ? 0 : 49;
  const grandTotal = totalPrice() + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-8">
          Shopping Cart <span className="text-gray-500 text-xl font-normal">({totalItems()} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isValidImg = item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"));
              return (
                <div key={item.productId} className="flex gap-4 bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                  {/* Image */}
                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden bg-[#1a1a1a] shrink-0 cursor-pointer"
                    onClick={() => navTo(`/product/${item.productId}`)}
                  >
                    {isValidImg ? (
                      <img src={item.image!} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🛍</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-white font-medium text-sm leading-snug mb-1 cursor-pointer hover:text-amber-300 transition-colors line-clamp-2"
                      onClick={() => navTo(`/product/${item.productId}`)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-amber-400 font-bold text-base">₹{item.price.toLocaleString("en-IN")}</p>
                    <p className="text-gray-600 text-xs mt-0.5">Subtotal: ₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>

                  {/* Qty & remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => { removeItem(item.productId); toast("Removed from cart"); }}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-0 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 text-gray-400 hover:text-white hover:bg-[#252525] transition-all text-base"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-white text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 text-gray-400 hover:text-white hover:bg-[#252525] transition-all text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => { clearCart(); toast("Cart cleared"); }}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-black text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal ({totalItems()} items)</span>
                  <span className="text-white font-medium">₹{totalPrice().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-400 font-medium" : "text-white font-medium"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-600">Add ₹{(499 - totalPrice()).toFixed(0)} more for free delivery</p>
                )}
                <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-amber-400 font-black text-xl">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => navTo("/checkout")}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navTo("/shop")}
                className="w-full mt-3 text-sm text-gray-500 hover:text-amber-400 transition-colors py-2"
              >
                ← Continue Shopping
              </button>

              <div className="mt-6 p-3 bg-[#1a1a1a] rounded-xl">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free delivery on orders above ₹499</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
