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

function Table({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1f1f1f] mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
            <th className="text-left text-white font-bold px-4 py-3">Destination</th>
            <th className="text-left text-white font-bold px-4 py-3">Delivery Time</th>
            <th className="text-left text-white font-bold px-4 py-3">Shipping Fee</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([dest, time, fee], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-[#111]" : "bg-[#0f0f0f]"}>
              <td className="text-gray-300 px-4 py-3">{dest}</td>
              <td className="text-gray-400 px-4 py-3">{time}</td>
              <td className="text-amber-400 font-medium px-4 py-3">{fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Legal</span>
        <h1 className="text-4xl font-black text-white mb-3">Shipping Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: April 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">

          <Section title="Overview">
            <p>
              LUXORA ("we", "us") is committed to delivering your orders safely and on time. This Shipping Policy outlines our shipping methods, timelines, charges, and terms for all orders placed on luxora.shop or through our Telegram bot @LuxoraShoppingBot.
            </p>
          </Section>

          <Section title="Shipping Coverage">
            <p>We currently ship to all states and union territories across India. We do not offer international shipping at this time.</p>
            <p>Delivery is available to home addresses, offices, and PO boxes (for select pin codes).</p>
          </Section>

          <Section title="Shipping Timelines & Charges">
            <p>We process orders within 1–2 business days (Monday–Saturday, excluding public holidays).</p>
            <Table
              rows={[
                ["Metro Cities (Delhi, Mumbai, Bengaluru, Chennai, etc.)", "2–4 business days", "Free over ₹499, else ₹49"],
                ["Tier-2 / Tier-3 Cities", "3–6 business days", "Free over ₹499, else ₹49"],
                ["Remote / Rural Areas", "5–10 business days", "Free over ₹499, else ₹49"],
                ["North-East India / J&K / Islands", "7–14 business days", "Free over ₹499, else ₹49"],
              ]}
            />
          </Section>

          <Section title="Courier Partners">
            <p>We ship through reputed logistics partners including:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>BlueDart</li>
              <li>Delhivery</li>
              <li>DTDC</li>
              <li>Ekart Logistics</li>
              <li>India Post (for remote areas)</li>
            </ul>
            <p className="mt-3">The courier partner is assigned based on your delivery location and availability.</p>
          </Section>

          <Section title="Order Tracking">
            <p>Once your order is dispatched, you will receive a tracking number via:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>A message on Telegram @LuxoraShoppingBot</li>
              <li>SMS to your registered mobile number</li>
              <li>Email (if provided at checkout)</li>
            </ul>
            <p className="mt-3">You can track your package using the tracking link shared by us or directly on the courier's website.</p>
          </Section>

          <Section title="Failed Deliveries">
            <p>If delivery is unsuccessful after 3 attempts, the package will be returned to our warehouse. We will contact you to rescheduled delivery. Additional re-delivery charges may apply.</p>
            <p>Ensure the delivery address and phone number are correct at the time of checkout to avoid failed deliveries.</p>
          </Section>

          <Section title="Damaged or Lost Shipments">
            <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date. We will investigate with the courier and arrange a replacement or full refund.</p>
          </Section>

          <Section title="Contact Us">
            <p>For shipping-related queries:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Telegram: @LuxoraShoppingBot</li>
              <li>Email: support@luxora.shop</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
