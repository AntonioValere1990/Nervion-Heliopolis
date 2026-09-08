import { cn } from "@/lib/utils";

export function Cover({
  src,
  alt,
  className,
  size = "md",
}: {
  src: string;
  alt: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "hero";
}) {
  const sizes = {
    xs: "size-11 rounded-md",
    sm: "size-14 rounded-lg",
    md: "size-16 rounded-xl",
    lg: "size-24 rounded-2xl",
    hero: "w-full aspect-square rounded-3xl",
  };
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={cn(
        "object-cover bg-secondary shadow-[0_8px_28px_rgba(0,0,0,0.35)]",
        sizes[size],
        className,
      )}
    />
  );
}
