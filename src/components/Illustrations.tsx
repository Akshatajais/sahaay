export function Leaves({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M18 46c8-2 16-12 18-24-10 2-20 10-22 20 6 2 4 4 4 4z"
        fill="#7D9A72"
      />
      <path
        d="M30 40c6-8 16-16 26-18-2 12-10 22-20 26-2-2-6-6-6-8z"
        fill="#C4A15A"
      />
    </svg>
  );
}

export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-navy">
      <span className={large ? "text-[2.4rem] font-bold tracking-tight" : "text-[1.7rem] font-bold tracking-tight"}>
        SAHAAY
      </span>
      <Leaves className={large ? "h-12 w-12" : "h-9 w-9"} />
    </div>
  );
}

export function Pills({ className = "h-24 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 110" aria-hidden="true">
      <ellipse cx="58" cy="62" rx="34" ry="22" fill="#F7FBFA" stroke="#D5E4DC" strokeWidth="2" transform="rotate(-18 58 62)" />
      <ellipse cx="86" cy="48" rx="32" ry="20" fill="#FFFFFF" stroke="#E4EEE8" strokeWidth="2" transform="rotate(12 86 48)" />
      <path d="M70 36c8 4 12 14 10 24" fill="none" stroke="#D7E3DC" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ElderArt({ className = "h-44 w-44" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 200" aria-hidden="true">
      <ellipse cx="110" cy="108" rx="78" ry="70" fill="#F6E7E4" />
      <path d="M62 150c8-28 22-42 48-44 26 2 40 16 48 44" fill="#6E8FB8" />
      <path d="M78 146c10-8 54-8 66 6" fill="#DCEBDD" />
      <ellipse cx="108" cy="86" rx="34" ry="38" fill="#F3C7A8" />
      <path d="M74 84c2-28 18-46 36-48 20 2 34 18 36 42-12-10-24-8-36-4-10 4-24 6-36 10z" fill="#E7DDD4" />
      <circle cx="142" cy="62" r="12" fill="#D9CFC6" />
      <circle cx="96" cy="88" r="2.4" fill="#25304B" />
      <circle cx="120" cy="88" r="2.4" fill="#25304B" />
      <path d="M100 104c4 5 12 5 16 0" fill="none" stroke="#C47B6A" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="158" cy="128" r="11" fill="#F3C7A8" />
      <path d="M150 120c8-10 16-8 18-2" fill="none" stroke="#F3C7A8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="168" cy="46" r="7" fill="#D7E6F7" />
      <circle cx="184" cy="34" r="4.5" fill="#D7E6F7" />
    </svg>
  );
}

export function HomeElder({ className = "h-56 w-48" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 250" aria-hidden="true">
      <path d="M18 118c8-28 28-36 42-22-8 16-18 28-42 22z" fill="#8FB58A" />
      <path d="M168 36c18 4 28 20 22 36-16-2-28-12-22-36z" fill="#7FA67A" />
      <path d="M186 78c16 10 14 28-4 32-8-14-10-26 4-32z" fill="#A9C79A" />
      <ellipse cx="124" cy="132" rx="78" ry="86" fill="#F6E4D2" />
      <ellipse cx="124" cy="214" rx="62" ry="18" fill="#F3D7BC" opacity="0.7" />
      <path d="M78 168c6 34 22 52 46 54 28-2 44-22 48-54-18 10-34 12-48 8-16-4-34-6-46-8z" fill="#F0C14B" />
      <path d="M96 164c8 8 40 10 52 0 2 18-8 28-26 30-16 1-24-10-26-30z" fill="#F7D77A" />
      <path d="M86 150c10-6 22-4 28 2 8-8 22-8 32 0 6 8 4 16-2 20-16 2-28-2-36-8-8 4-18 4-22-14z" fill="#E7A23A" />
      <ellipse cx="124" cy="118" rx="38" ry="42" fill="#F4C7A6" />
      <path d="M88 112c2-36 20-58 38-60 22 2 38 24 38 56-14-16-26-14-40-6-12 6-26 8-36 10z" fill="#D9D3CC" />
      <ellipse cx="154" cy="78" rx="16" ry="14" fill="#C8C2BB" />
      <path d="M108 108c6-8 20-8 28 0" fill="none" stroke="#E7B089" strokeWidth="3" strokeLinecap="round" />
      <path d="M104 112c2 4 6 6 10 4" fill="none" stroke="#25304B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M136 112c2 4 6 6 10 4" fill="none" stroke="#25304B" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="112" cy="116" r="1.6" fill="#25304B" />
      <circle cx="142" cy="116" r="1.6" fill="#25304B" />
      <path d="M122 128c2 3 8 3 10 0" fill="none" stroke="#E09A86" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 138c6 8 18 8 26 0" fill="none" stroke="#C46B62" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="124" cy="96" r="3.2" fill="#C83D42" />
      <circle cx="92" cy="132" r="3" fill="#E7A0A0" opacity="0.7" />
      <circle cx="156" cy="132" r="3" fill="#E7A0A0" opacity="0.7" />
    </svg>
  );
}

export function BottleArt({ className = "h-20 w-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" aria-hidden="true">
      <path d="M8 62c10-18 8-28-2-36 14 2 22 16 16 34-6 2-12 4-14 2z" fill="#8FB58A" />
      <path d="M96 28c14 2 18 16 8 24-10-6-16-14-8-24z" fill="#A9C79A" />
      <rect x="46" y="18" width="22" height="10" rx="3" fill="#D7EDE0" />
      <rect x="50" y="26" width="14" height="8" fill="#EEF7F1" />
      <rect x="34" y="34" width="46" height="52" rx="12" fill="#F7FBFA" stroke="#D5E8DC" />
      <rect x="38" y="48" width="38" height="28" rx="6" fill="#1F8A4D" />
      <path d="M57 55v14M50 62h14" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <ellipse cx="28" cy="78" rx="14" ry="8" fill="#F4F7F5" transform="rotate(-28 28 78)" />
      <ellipse cx="86" cy="80" rx="12" ry="7" fill="#fff" stroke="#E4EEE8" transform="rotate(18 86 80)" />
    </svg>
  );
}

export function WalletArt({ className = "h-20 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 100" aria-hidden="true">
      <path d="M28 38h62c8 0 12 6 10 14l-8 22c-2 6-8 10-16 10H34c-8 0-14-6-14-14V50c0-7 4-12 8-12z" fill="#2E5C9A" />
      <path d="M36 34h48c6 0 10 4 10 10v6H40c-6 0-10-3-12-8 2-5 4-8 8-8z" fill="#3E74B8" />
      <path d="M78 52h22c4 0 6 3 6 6v8c0 3-2 6-6 6H78c-4 0-6-3-6-6v-8c0-3 2-6 6-6z" fill="#1E3F73" />
      <circle cx="92" cy="62" r="2.4" fill="#F7DFAE" />
      <circle cx="108" cy="36" r="16" fill="#F0C14B" />
      <circle cx="108" cy="36" r="12" fill="#F6D36B" />
      <text x="108" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill="#8A5A10">₹</text>
      <path d="M118 58l8 4M120 68l10 2" stroke="#2E5C9A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function CapsuleArt({ className = "h-20 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 100" aria-hidden="true">
      <g transform="rotate(-28 78 52)">
        <rect x="40" y="34" width="78" height="36" rx="18" fill="#F7FBFA" />
        <path d="M79 34h39a18 18 0 0 1 0 36H79z" fill="#1F8A4D" />
      </g>
      <ellipse cx="46" cy="72" rx="18" ry="12" fill="#fff" stroke="#E4EEE8" strokeWidth="2" />
      <path d="M112 22l3 7 7 2-7 3-3 7-2-7-7-3 7-2z" fill="#F0C14B" />
    </svg>
  );
}

export function DayArt({ className = "h-20 w-full" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 90" aria-hidden="true">
      <circle cx="36" cy="28" r="14" fill="#F0C14B" />
      <path d="M36 8v6M36 42v6M16 28h6M50 28h6M22 14l4 4M46 38l4 4M22 42l4-4M46 18l4-4" stroke="#F0C14B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 70c18-16 28-16 40 0 10-18 24-22 40-8 8 6 16 8 28 4v24H8z" fill="#8FB58A" />
      <path d="M70 78c8-20 18-28 28-20 6 5 8 14 6 24H64c0-2 2-3 6-4z" fill="#DCEBDD" />
      <path d="M78 84c10-16 22-16 34 2" fill="none" stroke="#E7D7A8" strokeWidth="4" strokeLinecap="round" />
      <path d="M112 58c6-14 14-16 16-8 4 2 6 8 2 14-6-2-12-2-18-6z" fill="#6E9A68" />
      <rect x="118" y="62" width="3" height="12" rx="1" fill="#8A6A42" />
    </svg>
  );
}

export function HelpArt({ className = "h-20 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 100" aria-hidden="true">
      <path d="M46 28c-16 4-24 20-20 36 2 8 8 12 14 12 4 0 6-2 6-6V48c0-6-2-10 0-20z" fill="#E15B55" />
      <path d="M104 28c16 4 24 20 20 36-2 8-8 12-14 12-4 0-6-2-6-6V48c0-6 2-10 0-20z" fill="#C83D42" />
      <path d="M50 34c8-12 42-12 50 0" fill="none" stroke="#E15B55" strokeWidth="10" strokeLinecap="round" />
      <circle cx="108" cy="30" r="16" fill="#fff" />
      <path d="M108 22v16M100 30h16" stroke="#C83D42" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M28 24l6 4M24 36h8M34 46l-6 4" stroke="#E7A0A0" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const tones = ["bg-care", "bg-money", "bg-amber", "bg-blush"];

export function InitialAvatar({ name, className = "size-14 text-[1.05rem]" }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = (
    parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}` : (parts[0]?.slice(0, 2) ?? "?")
  ).toUpperCase();
  const tone = tones[name.length % tones.length];
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-bold text-navy ${tone} ${className}`} aria-hidden="true">
      {letters}
    </span>
  );
}
