interface Props {
  letter: string;
  name: string;
  size?: number;
}

/** Monogram hãng xe kiểu wordmark đơn sắc - premium, không dùng emoji */
export default function BrandBadge({ letter, name, size = 44 }: Props) {
  return (
    <span className="flex items-center gap-3" title={name}>
      <span
        className="rounded-xl flex items-center justify-center font-extrabold shrink-0"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.45,
          background: 'linear-gradient(135deg, #0b1220 0%, #243b5c 100%)',
          color: '#f5b301',
        }}
      >
        {letter}
      </span>
      <span className="font-bold text-base">{name}</span>
    </span>
  );
}
