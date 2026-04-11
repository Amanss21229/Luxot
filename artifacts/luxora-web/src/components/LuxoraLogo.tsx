import { useId } from "react";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LuxoraLogoMark({ size = 40, className = "" }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `lg-${uid}`;
  const grad2Id = `lg2-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={grad2Id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Dark background with subtle gold border */}
      <rect width="48" height="48" rx="10" fill="#0a0a0a" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="9.5" fill="none" stroke="#fbbf24" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* L — vertical bar */}
      <rect x="9" y="6" width="11" height="30" rx="1.5" fill={`url(#${gradId})`} />
      {/* L — horizontal bar */}
      <rect x="9" y="32" width="30" height="9" rx="1.5" fill={`url(#${gradId})`} />

      {/* Thin inner inset line on vertical bar for luxury depth */}
      <rect x="10.5" y="7.5" width="8" height="27" rx="1" fill="none" stroke="#0a0a0a" strokeOpacity="0.35" strokeWidth="1" />

      {/* "UXORA" letters stacked in the vertical bar */}
      <text x="14.5" y="13.5"  fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.2" fontWeight="bold" fill="#0a0a0a" textAnchor="middle" dominantBaseline="middle">U</text>
      <text x="14.5" y="19.5"  fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.2" fontWeight="bold" fill="#0a0a0a" textAnchor="middle" dominantBaseline="middle">X</text>
      <text x="14.5" y="25.5"  fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.2" fontWeight="bold" fill="#0a0a0a" textAnchor="middle" dominantBaseline="middle">O</text>
      <text x="14.5" y="31.5"  fontFamily="Georgia, 'Times New Roman', serif" fontSize="5.2" fontWeight="bold" fill="#0a0a0a" textAnchor="middle" dominantBaseline="middle">R</text>

      {/* "A" in the horizontal bar — completing "UXORA" */}
      <text x="30"   y="36.5"  fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" fontWeight="bold" fill="#0a0a0a" textAnchor="middle" dominantBaseline="middle">A</text>

      {/* Tiny decorative dot at inner corner junction */}
      <circle cx="20" cy="33" r="1.6" fill="#0a0a0a" opacity="0.5" />
    </svg>
  );
}

export function LuxoraWordmark({
  iconSize = 36,
  textSize = "xl",
  className = "",
}: {
  iconSize?: number;
  textSize?: "lg" | "xl" | "2xl";
  className?: string;
}) {
  const textClass = {
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }[textSize];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LuxoraLogoMark size={iconSize} />
      <span
        className={`font-black ${textClass} tracking-tight text-white`}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.06em" }}
      >
        LUXORA
      </span>
    </div>
  );
}
