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

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-b border-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Legal</span>
        <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
        <p className="text-gray-500 text-sm">Last updated: April 2025</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">

          <Section title="Agreement to Terms">
            <p>
              By accessing and using the LUXORA website (luxora.shop) or the LUXORA Telegram bot (@LuxoraShoppingBot), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
            <p>LUXORA is a product of Sansa Feel. These terms apply to all users, customers, and visitors of our platform.</p>
          </Section>

          <Section title="Use of Platform">
            <p>You may use LUXORA only for lawful purposes. You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Use the platform for any fraudulent or illegal activity</li>
              <li>Attempt to gain unauthorized access to any portion of the platform</li>
              <li>Transmit any harmful, offensive, or inappropriate content</li>
              <li>Use automated tools to scrape or extract data from our platform</li>
              <li>Impersonate any person or entity</li>
              <li>Violate any applicable local, state, national, or international law</li>
            </ul>
          </Section>

          <Section title="Account & Orders">
            <p>LUXORA does not require account registration to browse. You provide your personal information (name, phone, address) solely at the time of placing an order. You are responsible for ensuring that all information provided is accurate and up-to-date.</p>
            <p>LUXORA reserves the right to cancel or refuse any order at our discretion, including orders suspected of fraud.</p>
          </Section>

          <Section title="Products & Pricing">
            <p>All product descriptions, images, and prices are as accurate as possible. However, we reserve the right to correct any errors or inaccuracies and to change or update information at any time without notice.</p>
            <p>Prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless otherwise stated.</p>
            <p>LUXORA reserves the right to limit quantities of products available for purchase.</p>
          </Section>

          <Section title="Payments via Razorpay">
            <p>All payments on LUXORA are processed securely through Razorpay, a RBI-authorized payment aggregator. By making a payment, you agree to Razorpay's Terms of Service and Privacy Policy.</p>
            <p>LUXORA does not store your payment card information. All financial transactions are handled by Razorpay's PCI DSS compliant infrastructure.</p>
            <p>In case of a failed payment, amounts debited will be refunded to the original payment method within 5–7 business days.</p>
          </Section>

          <Section title="Intellectual Property">
            <p>The LUXORA name, logo, website design, content, and all associated materials are the property of Sansa Feel. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
          </Section>

          <Section title="Third-Party Links">
            <p>Our platform may contain links to third-party websites (including affiliate product links). These links are provided for convenience. LUXORA has no control over the content or practices of third-party sites and accepts no responsibility for them.</p>
          </Section>

          <Section title="Disclaimer of Warranties">
            <p>LUXORA provides its services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the platform or products listed thereon.</p>
          </Section>

          <Section title="Limitation of Liability">
            <p>To the fullest extent permitted by law, LUXORA / Sansa Feel shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our platform.</p>
          </Section>

          <Section title="Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts located in India.</p>
          </Section>

          <Section title="Changes to Terms">
            <p>We reserve the right to update these Terms at any time. Continued use of LUXORA after changes constitutes your acceptance of the revised Terms.</p>
          </Section>

          <Section title="Contact">
            <p>For questions about these Terms, contact us:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Telegram: @LuxoraShoppingBot</li>
              <li>Email: contact.sansafeel@gmail.com</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
