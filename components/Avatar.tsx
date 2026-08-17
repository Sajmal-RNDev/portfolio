/**
 * Animated SVG avatar — a stand-in for a real photo.
 * Pure inline SVG + CSS: no external assets, no network requests.
 * Swap the whole component for an <img> when you have a headshot.
 */
export default function Avatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Illustrated avatar of a developer waving"
    >
      <defs>
        <clipPath id="av-clip">
          <circle cx="120" cy="120" r="112" />
        </clipPath>
        <linearGradient id="av-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient id="av-shirt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="av-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f2438" />
          <stop offset="100%" stopColor="#1b1523" />
        </linearGradient>
        <radialGradient id="av-glow" cx="50%" cy="34%" r="58%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath="url(#av-clip)">
        <circle cx="120" cy="120" r="112" fill="url(#av-bg)" />
        <circle cx="120" cy="120" r="112" fill="url(#av-glow)" />

        {/* shoulders / torso */}
        <path
          d="M32 244c0-42 34-70 88-70s88 28 88 70z"
          fill="url(#av-shirt)"
        />
        {/* collar */}
        <path
          d="M104 176c5 10 11 15 16 15s11-5 16-15l-8-5h-16z"
          fill="#0f172a"
          opacity="0.45"
        />

        {/* neck */}
        <rect x="106" y="150" width="28" height="30" rx="14" fill="#e0a281" />
        <rect x="106" y="150" width="28" height="14" rx="7" fill="#c98a69" />

        {/* head */}
        <ellipse cx="120" cy="112" rx="44" ry="48" fill="#f0b48f" />
        {/* ears */}
        <circle cx="77" cy="116" r="8" fill="#e0a281" />
        <circle cx="163" cy="116" r="8" fill="#e0a281" />

        {/* hair */}
        <path
          d="M74 106c-2-32 20-52 46-52s48 20 46 52c-4-14-10-20-18-22-10 12-52 14-60-2-6 4-11 10-14 24z"
          fill="url(#av-hair)"
        />

        {/* eyebrows */}
        <path
          d="M96 98c5-4 13-4 18-1"
          stroke="#2f2438"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M126 97c5-3 13-3 18 1"
          stroke="#2f2438"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* eyes (blink) */}
        <g className="blink">
          <circle cx="105" cy="114" r="5.5" fill="#1b1523" />
          <circle cx="135" cy="114" r="5.5" fill="#1b1523" />
          <circle cx="106.8" cy="112" r="1.8" fill="#fff" />
          <circle cx="136.8" cy="112" r="1.8" fill="#fff" />
        </g>

        {/* glasses */}
        <g
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
          opacity="0.92"
        >
          <rect x="90" y="103" width="30" height="24" rx="10" />
          <rect x="120" y="103" width="30" height="24" rx="10" />
          <path d="M120 113h0M76 108l14 3M164 108l-14 3" strokeLinecap="round" />
        </g>

        {/* nose + smile */}
        <path
          d="M120 120v8"
          stroke="#d08f6c"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M108 139c7 7 17 7 24 0"
          stroke="#8a4a3a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* waving hand */}
        <g className="wave">
          <rect
            x="176"
            y="176"
            width="20"
            height="42"
            rx="10"
            fill="#f0b48f"
            transform="rotate(18 186 197)"
          />
          <circle cx="192" cy="176" r="14" fill="#f0b48f" />
        </g>
      </g>

      {/* inner rim */}
      <circle
        cx="120"
        cy="120"
        r="111"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.1"
        strokeWidth="2"
      />
    </svg>
  );
}
