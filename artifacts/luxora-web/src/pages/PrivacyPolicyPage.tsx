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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Legal</span>
        <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: April 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">

          <Section title="Introduction">
            <p>
              LUXORA ("we", "us", "our"), a product of Sansa Feel, is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit luxora.shop or use the @LuxoraShoppingBot on Telegram.
            </p>
            <p>This policy complies with the Information Technology Act 2000 and the IT (Amendment) Act 2008 of India, and is aligned with global data protection best practices.</p>
          </Section>

          <Section title="Information We Collect">
            <p><strong className="text-white">When you place an order (Website):</strong></p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address (optional)</li>
              <li>Delivery address (house/flat, street, city, state, PIN code)</li>
              <li>Order details (products, quantities, total amount)</li>
            </ul>

            <p className="mt-3"><strong className="text-white">When you use our Telegram bot:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Telegram User ID, username, first name, last name</li>
              <li>Messages sent to the bot (for support purposes)</li>
              <li>Cart and wishlist data</li>
            </ul>

            <p className="mt-3"><strong className="text-white">Automatically collected:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>IP address (for fraud prevention)</li>
              <li>Device information (for optimizing your experience)</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2 mt-1">
              <li><strong className="text-white">Order fulfillment:</strong> To process, confirm, and deliver your orders</li>
              <li><strong className="text-white">Customer support:</strong> To respond to your queries and complaints</li>
              <li><strong className="text-white">Communications:</strong> To send order updates, tracking info, and promotional offers (with your consent)</li>
              <li><strong className="text-white">Fraud prevention:</strong> To detect and prevent fraudulent transactions</li>
              <li><strong className="text-white">Platform improvement:</strong> To analyze usage and improve our services</li>
              <li><strong className="text-white">Legal compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </Section>

          <Section title="Razorpay & Payment Data">
            <p>All payment transactions are processed by Razorpay Payments Pvt. Ltd., an RBI-authorized payment aggregator. LUXORA does not collect, store, or process your payment card details.</p>
            <p>Razorpay collects and processes your payment data under its own Privacy Policy. We strongly recommend reviewing Razorpay's privacy policy at razorpay.com. By making a payment on LUXORA, you consent to Razorpay's data processing terms.</p>
            <p>Razorpay is PCI DSS Level 1 compliant — the highest level of security certification for payment processors.</p>
          </Section>

          <Section title="Data Sharing & Disclosure">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-white">Delivery partners</strong> (name, phone, address) to fulfill your orders</li>
              <li><strong className="text-white">Razorpay</strong> for payment processing</li>
              <li><strong className="text-white">Google Firebase</strong> (our cloud database) for secure data storage</li>
              <li><strong className="text-white">Law enforcement</strong> if required by applicable law or legal process</li>
            </ul>
          </Section>

          <Section title="Data Storage & Security">
            <p>Your data is stored on Google Firebase Firestore — a highly secure, encrypted cloud database infrastructure. We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>256-bit SSL/TLS encryption for all data transmission</li>
              <li>Access controls and authentication for admin systems</li>
              <li>Regular security reviews and audits</li>
            </ul>
            <p className="mt-2">While we take all reasonable precautions, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.</p>
          </Section>

          <Section title="Cookies">
            <p>Our website uses minimal cookies for essential functionality:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Cart & Wishlist:</strong> Stored in your browser's localStorage to remember your selections</li>
              <li><strong className="text-white">Session data:</strong> For security and fraud prevention</li>
            </ul>
            <p className="mt-2">We do not use tracking cookies for advertising purposes. You can clear localStorage data from your browser settings at any time.</p>
          </Section>

          <Section title="Your Rights">
            <p>As a user, you have the following rights regarding your data:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data we hold</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
              <li><strong className="text-white">Opt-out:</strong> Unsubscribe from promotional communications at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at support@luxora.shop or via Telegram @LuxoraShoppingBot.</p>
          </Section>

          <Section title="Children's Privacy">
            <p>LUXORA is not directed at children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal data, we will delete it immediately.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after any changes constitutes your acceptance of the revised policy.</p>
          </Section>

          <Section title="Contact Us">
            <p>For privacy-related concerns or data requests:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Email: support@luxora.shop</li>
              <li>Telegram: @LuxoraShoppingBot</li>
              <li>Brand: LUXORA — A Product of Sansa Feel</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
