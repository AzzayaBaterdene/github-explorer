type AvatarProps = {
  src: string;
  alt: string; // required on purpose: every use must decide, "" (decorative) or a description
  size?: number;
};

export function Avatar({ src, alt, size = 100 }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-bg"
    />
  );
}
