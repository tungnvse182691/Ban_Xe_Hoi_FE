interface Props {
  dark?: boolean;
  size?: number;
}

/**
 * Logo TommyCar - chữ T cách điệu + vệt tốc độ,
 * gradient navy -> blue -> cam trên nền bo tròn.
 */
export default function Logo({ dark = false, size = 36 }: Props) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-label="TommyCar logo"
        className="shrink-0 drop-shadow"
      >
        <defs>
          <linearGradient id="tommycar-g" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2456e6" />
            <stop offset="0.55" stopColor="#0b2a6b" />
            <stop offset="1" stopColor="#ff6b00" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#tommycar-g)" />
        <rect x="2" y="2" width="44" height="44" rx="13" fill="white" fillOpacity="0.06" />
        {/* chữ T */}
        <path d="M11 15.5h26" stroke="white" strokeWidth="5.2" strokeLinecap="round" />
        <path d="M24 15.5V33" stroke="#f5b301" strokeWidth="5.2" strokeLinecap="round" />
        {/* vệt tốc độ */}
        <path d="M30 27.5h8" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <path d="M32.5 33.5h5.5" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      </svg>
      <span
        className="font-extrabold tracking-tight"
        style={{ color: dark ? '#fff' : '#0b1220', fontSize: size * 0.58, lineHeight: 1 }}
      >
        Tommy<span style={{ color: '#ff6b00' }}>Car</span>
      </span>
    </span>
  );
}
