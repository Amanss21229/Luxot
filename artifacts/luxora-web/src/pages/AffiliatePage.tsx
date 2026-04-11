import { useState, useEffect } from "react";
import { fetchJSON, postJSON } from "@/lib/api";
import {
  Link2, Users, TrendingUp, DollarSign, Copy, Check,
  ChevronDown, ChevronUp, BarChart2, Loader2, Send,
  ShieldCheck, Clock, AlertCircle, ExternalLink, Package,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EARNINGS_PER_SALE = 50;
const CONTACT_EMAIL = "contact.sansafeel@gmail.com";

function navTo(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.href = `${base}${path}`;
}

function getSiteBase(): string {
  return window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
}

interface AffiliateLink {
  linkCode: string;
  productId: string;
  productTitle: string;
  clicks: number;
  orders: number;
  earnings: number;
  createdAt: string;
}

interface AffiliateData {
  phone: string;
  name: string;
  email: string;
  isVerified: boolean;
  registeredAt: string;
  autoVerifyAt: string;
  earnings: number;
  totalOrders: number;
  totalClicks: number;
}

interface StatsResponse {
  affiliate: AffiliateData;
  links: AffiliateLink[];
  stats: { totalClicks: number; totalOrders: number; totalEarnings: number };
}

interface CreateLinkResponse {
  linkCode: string;
  productId: string;
  productTitle: string;
  clicks: number;
  orders: number;
  earnings: number;
  createdAt: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0",
        copied
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
      )}
    >
      {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
    </button>
  );
}

function LinkCard({ link, siteBase }: { link: AffiliateLink; siteBase: string }) {
  const [open, setOpen] = useState(false);
  const affiliateUrl = `${siteBase}/product/${link.productId}?ref=${link.linkCode}`;

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
          <Link2 className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{link.productTitle}</p>
          <p className="text-gray-500 text-xs mt-0.5">
            {link.clicks} clicks · {link.orders} orders · ₹{link.earnings} earned
          </p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[#1a1a1a] p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Clicks", value: link.clicks, icon: <TrendingUp className="w-4 h-4" />, color: "text-blue-400" },
              { label: "Orders", value: link.orders, icon: <Package className="w-4 h-4" />, color: "text-purple-400" },
              { label: "Earned", value: `₹${link.earnings}`, icon: <DollarSign className="w-4 h-4" />, color: "text-green-400" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-3 text-center">
                <div className={cn("flex justify-center mb-1", color)}>{icon}</div>
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1.5 font-medium">Your Affiliate Link</p>
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-3 py-2">
              <p className="text-amber-400 text-xs font-mono flex-1 truncate">{affiliateUrl}</p>
              <CopyButton text={affiliateUrl} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navTo(`/product/${link.productId}`)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] px-3 py-2 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Product
            </button>
            <CopyButton text={affiliateUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AffiliatePage() {
  const [siteBase] = useState(getSiteBase);

  // ── Create Link Section ──
  const [createPhone, setCreatePhone] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<CreateLinkResponse | null>(null);

  // ── Dashboard Section ──
  const [dashPhone, setDashPhone] = useState("");
  const [dashLoading, setDashLoading] = useState(false);
  const [dashData, setDashData] = useState<StatsResponse | null>(null);
  const [dashError, setDashError] = useState("");

  // ── Register Section ──
  const [regForm, setRegForm] = useState({ name: "", phone: "", email: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [regData, setRegData] = useState<AffiliateData | null>(null);

  // Auto-refresh verification status
  useEffect(() => {
    if (!dashData || dashData.affiliate.isVerified) return;
    const autoVerifyAt = new Date(dashData.affiliate.autoVerifyAt).getTime();
    const now = Date.now();
    const delay = autoVerifyAt - now + 2000;
    if (delay <= 0) return;
    const timer = setTimeout(() => {
      if (dashPhone) handleDashSearch(dashPhone);
    }, delay);
    return () => clearTimeout(timer);
  }, [dashData]);

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{10}$/.test(createPhone.trim())) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!productUrl.trim().includes("/product/")) {
      toast.error("Enter a LUXORA product page URL");
      return;
    }
    setCreateLoading(true);
    try {
      const data = await postJSON<CreateLinkResponse>("/affiliate/create-link", {
        phone: createPhone.trim(),
        productUrl: productUrl.trim(),
      });
      setCreatedLink(data);
      toast.success("Affiliate link created!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDashSearch(phone?: string) {
    const p = (phone ?? dashPhone).trim();
    if (!/^\d{10}$/.test(p)) {
      setDashError("Enter a valid 10-digit phone number");
      return;
    }
    setDashError("");
    setDashLoading(true);
    try {
      const data = await fetchJSON<StatsResponse>(`/affiliate/stats?phone=${encodeURIComponent(p)}`);
      setDashData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Not found";
      if (msg.includes("404") || msg.includes("not_found")) {
        setDashError("No affiliate account found for this number. Please register below.");
      } else {
        setDashError("Failed to load dashboard. Please try again.");
      }
      setDashData(null);
    } finally {
      setDashLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regForm.name.trim()) { toast.error("Enter your full name"); return; }
    if (!/^\d{10}$/.test(regForm.phone.trim())) { toast.error("Enter a valid 10-digit phone number"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) { toast.error("Enter a valid email address"); return; }

    setRegLoading(true);
    try {
      const data = await postJSON<AffiliateData & { alreadyRegistered?: boolean }>("/affiliate/register", {
        name: regForm.name.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email.trim(),
      });
      setRegData(data);
      setRegDone(true);
      toast.success(data.alreadyRegistered ? "Already registered! Check your dashboard." : "Application submitted! You'll be verified within 5 minutes.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setRegLoading(false);
    }
  }

  const affiliateUrl = createdLink
    ? `${siteBase}/product/${createdLink.productId}?ref=${createdLink.linkCode}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-950/30 via-amber-950/10 to-transparent border-b border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-4 py-2 rounded-full mb-5">
            <DollarSign className="w-4 h-4" /> Affiliate Partner Program
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Earn <span className="text-amber-400">₹{EARNINGS_PER_SALE}</span> Per Sale
          </h1>

          {/* Earnings highlight banner */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-green-500/15 border border-green-500/30 rounded-2xl px-6 py-4 mb-6 mt-2">
            <span className="text-2xl">💰</span>
            <div className="text-left">
              <p className="text-green-400 font-black text-xl md:text-2xl leading-tight">
                Earn ₹15,000 – ₹20,000/month
              </p>
              <p className="text-gray-400 text-sm mt-0.5">
                Just 10–15 sales/day through your affiliate links — that's all it takes!
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Share LUXORA products with your audience. Get a unique affiliate link and earn ₹{EARNINGS_PER_SALE} every time someone buys through it.
          </p>

          {/* How much can you earn calculator-style */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { sales: "5 sales/day", monthly: "₹7,500/month" },
              { sales: "10 sales/day", monthly: "₹15,000/month" },
              { sales: "15 sales/day", monthly: "₹22,500/month" },
              { sales: "20 sales/day", monthly: "₹30,000/month" },
            ].map(({ sales, monthly }) => (
              <div key={sales} className="bg-[#111] border border-amber-500/20 rounded-xl px-4 py-3 text-center min-w-[130px]">
                <p className="text-amber-400 font-black text-base">{monthly}</p>
                <p className="text-gray-500 text-xs mt-0.5">{sales}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Link2 className="w-5 h-5" />, text: "Unique link per product" },
              { icon: <TrendingUp className="w-5 h-5" />, text: "Real-time click & order tracking" },
              { icon: <DollarSign className="w-5 h-5" />, text: "₹50 per successful sale" },
              { icon: <Users className="w-5 h-5" />, text: "Auto-verified in 5 minutes" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-amber-400">{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* ── STEP 1: Create Affiliate Link ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center font-black text-sm">1</div>
            <h2 className="text-white text-xl font-black">Create Your Affiliate Link</h2>
          </div>

          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Your Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Product Page URL</label>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder={`${siteBase}/product/abc123`}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
                <p className="text-gray-600 text-xs mt-1.5">
                  Copy a product URL from the <button type="button" onClick={() => navTo("/shop")} className="text-amber-500 hover:text-amber-400 underline">Shop page</button> and paste it here.
                </p>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                style={!createLoading ? {
                  background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                  boxShadow: "0 4px 0 #78350f, 0 6px 10px rgba(0,0,0,0.4)",
                } : {
                  background: "linear-gradient(to bottom, #d4a017 0%, #b8860b 100%)",
                }}
                className="w-full py-3 rounded-xl text-black font-black text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:translate-y-[3px] active:shadow-none"
              >
                {createLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Link2 className="w-4 h-4" /> Create Your Affiliate Link</>}
              </button>
            </form>

            {createdLink && affiliateUrl && (
              <div className="mt-5 border-t border-[#1a1a1a] pt-5">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-3">
                  <Check className="w-4 h-4" /> Affiliate link for "{createdLink.productTitle}"
                </div>
                <div className="bg-[#0f0f0f] border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Your Unique Affiliate Link</p>
                  <div className="flex items-center gap-2">
                    <p className="text-amber-400 text-sm font-mono flex-1 break-all">{affiliateUrl}</p>
                    <CopyButton text={affiliateUrl} />
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-3 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                  You earn <span className="text-green-400 font-bold">₹{EARNINGS_PER_SALE}</span> every time someone purchases through this link.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── STEP 2: Dashboard ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center font-black text-sm">2</div>
            <h2 className="text-white text-xl font-black">My Affiliate Dashboard</h2>
          </div>

          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  value={dashPhone}
                  onChange={(e) => { setDashPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setDashError(""); }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={cn(
                    "w-full bg-[#1a1a1a] border rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all",
                    dashError ? "border-red-500" : "border-[#2a2a2a] focus:border-amber-500/50"
                  )}
                />
              </div>
              <button
                onClick={() => handleDashSearch()}
                disabled={dashLoading}
                style={!dashLoading ? {
                  background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                  boxShadow: "0 4px 0 #78350f",
                } : {
                  background: "linear-gradient(to bottom, #d4a017 0%, #b8860b 100%)",
                }}
                className="px-5 rounded-xl text-black font-black text-sm flex items-center gap-2 disabled:opacity-70 active:translate-y-[2px] active:shadow-none transition-all shrink-0"
              >
                {dashLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                View
              </button>
            </div>
            {dashError && <p className="text-red-400 text-xs mb-3">{dashError}</p>}

            {dashData && (
              <div className="border-t border-[#1a1a1a] pt-5 space-y-5">
                {/* Status */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-white font-bold text-base">{dashData.affiliate.name}</p>
                    <p className="text-gray-500 text-xs">{dashData.affiliate.email}</p>
                  </div>
                  {dashData.affiliate.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Clock className="w-3.5 h-3.5" /> Verification Pending
                    </span>
                  )}
                </div>

                {!dashData.affiliate.isVerified && (
                  <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-400 text-xs">
                      Your account will be automatically verified within 5 minutes of registration. Refresh the page after a moment.
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Clicks", value: dashData.stats.totalClicks, icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Total Orders", value: dashData.stats.totalOrders, icon: <Package className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                    { label: "Total Earned", value: `₹${dashData.stats.totalEarnings}`, icon: <DollarSign className="w-5 h-5" />, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                  ].map(({ label, value, icon, color, bg, border }) => (
                    <div key={label} className={cn("rounded-xl p-3 text-center border", bg, border)}>
                      <div className={cn("flex justify-center mb-1", color)}>{icon}</div>
                      <p className="text-white font-black text-xl">{value}</p>
                      <p className="text-gray-500 text-[11px]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Request Payment Button */}
                {dashData.affiliate.isVerified && (
                  dashData.stats.totalOrders >= 2 ? (
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=LUXORA Affiliate Payment Request&body=Name: ${dashData.affiliate.name}%0APhone: ${dashData.affiliate.phone}%0ATotal Earnings: ₹${dashData.stats.totalEarnings}%0ATotal Orders: ${dashData.stats.totalOrders}%0APlease process my payment. My UPI ID is: [YOUR UPI ID]`}
                      style={{
                        background: "linear-gradient(to bottom, #4ade80 0%, #22c55e 40%, #16a34a 100%)",
                        boxShadow: "0 4px 0 #14532d, 0 6px 10px rgba(0,0,0,0.4)",
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-black font-black text-sm active:translate-y-1 active:shadow-none transition-all"
                    >
                      <DollarSign className="w-4 h-4" /> Request My Payment (₹{dashData.stats.totalEarnings})
                    </a>
                  ) : (
                    <div className="flex items-start gap-2.5 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-gray-400 text-xs">
                        You need <span className="text-amber-400 font-bold">{2 - dashData.stats.totalOrders} more successful sale{2 - dashData.stats.totalOrders > 1 ? "s" : ""}</span> to unlock payment withdrawal. Minimum 2 orders required.
                      </p>
                    </div>
                  )
                )}

                {/* Affiliate Links */}
                {dashData.links.length > 0 && (
                  <div>
                    <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-amber-400" /> Your Affiliate Links ({dashData.links.length})
                    </h3>
                    <div className="space-y-3">
                      {dashData.links.map((link) => (
                        <LinkCard key={link.linkCode} link={link} siteBase={siteBase} />
                      ))}
                    </div>
                  </div>
                )}

                {dashData.links.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No affiliate links yet. Create your first link using the tool above!
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── STEP 3: Register ── */}
        <section id="register">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center font-black text-sm">3</div>
            <h2 className="text-white text-xl font-black">Become a Verified Affiliate Partner</h2>
          </div>

          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            {regDone && regData ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-black text-xl">Application Submitted! 🎉</h3>
                <p className="text-gray-400 text-sm">
                  Welcome <span className="text-white font-bold">{regData.name}</span>!<br />
                  You'll be automatically verified within <span className="text-amber-400 font-bold">5 minutes</span>.
                </p>
                <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 text-left space-y-2 text-sm">
                  <p className="text-gray-400">📱 Phone: <span className="text-white">{regData.phone}</span></p>
                  <p className="text-gray-400">📧 Email: <span className="text-white">{regData.email}</span></p>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-amber-400 text-xs font-medium">
                    Verification is automatic. After 5 minutes, enter your phone number in the Dashboard section above to view your stats.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-5">
                  Fill in your details to become a verified affiliate partner. You'll be auto-verified within 5 minutes and unlock full dashboard analytics.
                </p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={regForm.name}
                      onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                      <input
                        type="tel"
                        value={regForm.phone}
                        onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1.5 block uppercase tracking-wider">Gmail / Email Address</label>
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@gmail.com"
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading}
                    style={!regLoading ? {
                      background: "linear-gradient(to bottom, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
                      boxShadow: "0 4px 0 #78350f, 0 6px 10px rgba(0,0,0,0.4)",
                    } : {
                      background: "linear-gradient(to bottom, #d4a017 0%, #b8860b 100%)",
                    }}
                    className="w-full py-3.5 rounded-xl text-black font-black text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:translate-y-[3px] active:shadow-none"
                  >
                    {regLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Send Application</>}
                  </button>
                </form>
              </>
            )}

            <div className="mt-5 pt-5 border-t border-[#1a1a1a] space-y-2.5">
              {[
                { icon: "⏱️", text: "Auto-verified within 5 minutes after submission" },
                { icon: "📊", text: "Unlock full analytics — clicks, orders, earnings per link" },
                { icon: "💳", text: "Minimum 2 successful sales needed to request payout" },
                { icon: "📧", text: `Payment requests sent to ${CONTACT_EMAIL}` },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-gray-500">
                  <span className="shrink-0">{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Also on Telegram */}
        <section>
          <a
            href="https://t.me/LuxoraShoppingBot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 hover:bg-blue-500/15 transition-all group"
          >
            <div>
              <p className="text-white font-bold text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" /> Also available on Telegram Bot
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Create affiliate links, view dashboard, and request payment — all inside @LuxoraShoppingBot
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
          </a>
        </section>
      </div>
    </div>
  );
}
