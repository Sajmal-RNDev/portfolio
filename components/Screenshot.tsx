type Props = {
  src: string;
  alt: string;
  /** Sizes by height so a row stays uniform despite differing aspect ratios. */
  className?: string;
  priority?: boolean;
  /** Used to stagger the reveal when a rail animates in. */
  style?: React.CSSProperties;
};

/**
 * A store screenshot presented as a flat rounded card.
 *
 * Deliberately no device bezel: Play Store listings mix raw screen captures
 * with marketing graphics that already contain a rendered phone, so adding a
 * frame would nest a phone inside a phone on half the set.
 */
export default function Screenshot({
  src,
  alt,
  className = "h-[360px] sm:h-[440px]",
  priority = false,
  style,
}: Props) {
  return (
    <div
      style={style}
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-line bg-bg-elev shadow-[var(--shadow)] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-auto max-w-none"
      />
    </div>
  );
}
