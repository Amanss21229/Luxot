import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Orders & Shopping",
    items: [
      {
        q: "How do I place an order on LUXORA?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. Fill in your delivery address, review your order, and click 'Place Order'. You'll receive an order confirmation with your unique Order ID.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! After placing your order, you'll receive an Order ID. Contact us on our Telegram bot @LuxoraShoppingBot with your Order ID for real-time tracking updates.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 24 hours of placement. Contact us immediately via Telegram @LuxoraShoppingBot or email us at contact.sansafeel@gmail.com.",
      },
      {
        q: "Is there a minimum order value?",
        a: "There is no minimum order value. However, orders below ₹499 are subject to a ₹49 delivery fee. Orders above ₹499 enjoy free delivery.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods does LUXORA accept?",
        a: "We accept UPI, Net Banking, Credit/Debit Cards, and popular digital wallets through Razorpay — India's most trusted payment gateway. All transactions are 256-bit SSL encrypted and completely secure.",
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. We use Razorpay, a PCI DSS compliant payment gateway, to handle all transactions. Your card details are never stored on our servers. Every transaction is encrypted and secure.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payments may be declined due to incorrect card details, insufficient funds, or bank security restrictions. Try using a different payment method or contact your bank. You can also reach us on Telegram for help.",
      },
      {
        q: "When will I be charged?",
        a: "Payment is processed immediately at the time of order placement. You will receive a confirmation from Razorpay and from LUXORA once the payment is successful.",
      },
    ],
  },
  {
    category: "Delivery & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–7 business days across India. Metro cities may receive faster delivery (2–4 days). We ship through trusted courier partners including BlueDart, Delhivery, and DTDC.",
      },
      {
        q: "Do you deliver across all of India?",
        a: "Yes, we deliver pan-India. Some remote pin codes may take an additional 2–3 days. Enter your pincode at checkout to confirm deliverability.",
      },
      {
        q: "What are the shipping charges?",
        a: "Free shipping on all orders above ₹499. A flat ₹49 delivery fee applies for orders below ₹499.",
      },
      {
        q: "Will I get a tracking link?",
        a: "Yes, a tracking link is shared via Telegram/SMS once your order is dispatched from our warehouse.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is LUXORA's return policy?",
        a: "We offer a 7-day return window from the date of delivery. Items must be unused, in original packaging, and with all tags intact. Digital products are non-refundable.",
      },
      {
        q: "How do I initiate a return?",
        a: "Message us on Telegram @LuxoraShoppingBot with your Order ID and reason for return. Our team will guide you through the process within 24 hours.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. Razorpay processes refunds directly to your original payment method.",
      },
      {
        q: "Are there any items that cannot be returned?",
        a: "Digital products (PDFs, courses), intimate apparel, and items purchased on final sale cannot be returned. Damaged or used products will not be accepted for return.",
      },
    ],
  },
  {
    category: "LUXORA Telegram Bot",
    items: [
      {
        q: "What is the LUXORA Telegram Bot?",
        a: "The LUXORA Telegram Bot (@LuxoraShoppingBot) is our shopping assistant on Telegram. You can browse products, add to cart, get deals, and contact support — all from within Telegram.",
      },
      {
        q: "Does the Telegram bot show the same products as the website?",
        a: "Yes! Both the website and Telegram bot share the same product catalog in real-time. When our admins add or update products on the bot, they instantly appear on the website too.",
      },
      {
        q: "Can I get customer support on Telegram?",
        a: "Yes, our Telegram bot provides 24/7 customer support. Message @LuxoraShoppingBot for order tracking, returns, product inquiries, and more.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "border border-[#1f1f1f] rounded-xl overflow-hidden transition-all duration-200",
        open ? "bg-[#141414] border-amber-500/20" : "bg-[#111] hover:border-[#2a2a2a]"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
      >
        <span className="text-white font-medium text-sm leading-relaxed">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-amber-400 shrink-0 mt-0.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed border-t border-[#1f1f1f] pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory
    ? faqs.filter((f) => f.category === activeCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Help Center</span>
        <h1 className="text-4xl font-black text-white mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-400 max-w-lg mx-auto">Find quick answers to the most common questions about shopping, payments, and delivery at LUXORA.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              !activeCategory ? "bg-amber-500 text-black border-amber-500" : "bg-[#111] text-gray-400 border-[#1f1f1f] hover:border-amber-500/40 hover:text-amber-400"
            )}
          >
            All Topics
          </button>
          {faqs.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category === activeCategory ? null : cat.category)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                activeCategory === cat.category ? "bg-amber-500 text-black border-amber-500" : "bg-[#111] text-gray-400 border-[#1f1f1f] hover:border-amber-500/40 hover:text-amber-400"
              )}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {filtered.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-400 rounded-full" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-14 bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 text-center">
          <h3 className="text-white font-black text-xl mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-6">Our support team is available on Telegram 24/7</p>
          <a
            href="https://t.me/LuxoraShoppingBot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            💬 Chat on Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
