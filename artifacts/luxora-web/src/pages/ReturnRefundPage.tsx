function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-black text-white mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-amber-400 rounded-full shrink-0" />
        {title}
      </h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-3 pl-3">{children}</div>
    </div>
  );
}

export default function ReturnRefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Legal</span>
        <h1 className="text-4xl font-black text-white mb-3">Return & Refund Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: April 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">

          <Section title="Our Return Promise">
            <p>
              At LUXORA, we want you to be completely satisfied with your purchase. If for any reason you are not happy, we offer a hassle-free 7-day return policy from the date of delivery.
            </p>
          </Section>

          <Section title="Eligibility for Returns">
            <p>To be eligible for a return, your item must meet all of the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Returned within 7 days of delivery date</li>
              <li>Item is unused, unworn, and unwashed</li>
              <li>Original packaging, tags, and labels are intact</li>
              <li>Item is not from the non-returnable category (see below)</li>
              <li>Accompanied by proof of purchase (Order ID)</li>
            </ul>
          </Section>

          <Section title="Non-Returnable Items">
            <p>The following items cannot be returned or exchanged:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Digital products (PDFs, courses, Luxora Learn items)</li>
              <li>Intimate apparel and swimwear</li>
              <li>Perishable goods</li>
              <li>Customized or personalized items</li>
              <li>Items marked as "Final Sale" or "Non-Returnable"</li>
              <li>Items that have been used, damaged, or altered</li>
            </ul>
          </Section>

          <Section title="How to Initiate a Return">
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>Contact us on Telegram @LuxoraShoppingBot or email support@luxora.shop within 7 days of delivery</li>
              <li>Share your Order ID and reason for return with photos if the item is damaged</li>
              <li>Our team will review your request within 24 business hours</li>
              <li>If approved, we will arrange a pickup from your address (in select cities) or share a drop-off location</li>
              <li>Once we receive and inspect the item, the refund will be initiated</li>
            </ol>
          </Section>

          <Section title="Refund Process">
            <p>Refunds are processed to your original payment method via Razorpay:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-white">UPI / Net Banking / Debit Card:</strong> 5–7 business days</li>
              <li><strong className="text-white">Credit Card:</strong> 7–10 business days (depending on your bank)</li>
              <li><strong className="text-white">Digital Wallet:</strong> 2–3 business days</li>
            </ul>
            <p className="mt-3">You will receive a refund confirmation from Razorpay once the refund is processed. Shipping charges (₹49, if applicable) are non-refundable unless the return is due to our error or a defective product.</p>
          </Section>

          <Section title="Damaged or Defective Products">
            <p>If you receive a damaged, defective, or wrong item, contact us within 48 hours of delivery with photos/video evidence. In such cases, we will:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Arrange a free replacement, OR</li>
              <li>Issue a full refund including shipping charges</li>
            </ul>
          </Section>

          <Section title="Exchanges">
            <p>We currently do not offer direct exchanges. If you wish to exchange a product, please initiate a return and place a new order for the desired item.</p>
          </Section>

          <Section title="Contact Us">
            <p>For any return or refund queries:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Telegram: @LuxoraShoppingBot (fastest response)</li>
              <li>Email: support@luxora.shop</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
