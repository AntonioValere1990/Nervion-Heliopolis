import { cn } from "@/lib/utils";
import { APP_NAME, APP_PILL } from "@/lib/brand";
import { getLogo } from "@/lib/logos";
import { useStudio } from "@/lib/studio";

export function useActiveLogo() {
  const id = useStudio((s) => s.logoId);
  return getLogo(id);
}

export function BrandPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border border-accent/50 px-3 font-display text-kicker uppercase tracking-kicker text-accent",
        className,
      )}
    >
      {APP_PILL}
    </span>
  );
}

export function Logo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const logo = useActiveLogo();
  return (
    <img
      src={logo.src}
      alt=""
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-cover",
        logo.shape === "circle" ? "rounded-full" : "rounded-lg",
        className,
      )}
      decoding="async"
    />
  );
}

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = useActiveLogo();
  const amp = APP_NAME.indexOf("&");
  const left = amp > 0 ? APP_NAME.slice(0, amp).trim() : APP_NAME;
  const right = amp > 0 ? APP_NAME.slice(amp + 1).trim() : "";
  return (
    <span
      className={cn(
        "font-display uppercase leading-none tracking-wide text-foreground",
        size === "lg" && "text-4xl",
        size === "md" && "text-xl",
        size === "sm" && "text-lg",
        className,
      )}
    >
      {left} {right ? <span className={logo.mono ? "text-foreground" : "text-accent"}>&</span> : null} {right}
    </span>
  );
}

export function BrandLockup({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? 56 : size === "sm" ? 28 : 36;
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo size={px} className={size === "lg" ? "rounded-2xl" : undefined} />
      <BrandMark size={size} />
    </span>
  );
}

export function LogoLockup({
  className,
}: {
  className?: string;
}) {
  const logo = useActiveLogo();
  return (
    <img
      src={logo.lockup}
      alt="Nervión & Heliópolis"
      className={cn("h-auto w-full max-w-lg object-contain object-left", className)}
      decoding="async"
    />
  );
}

export function LogoStack({
  className,
}: {
  className?: string;
}) {
  const logo = useActiveLogo();
  return (
    <img
      src={logo.stack}
      alt="Nervión & Heliópolis"
      className={cn("w-full max-w-sm rounded-3xl", className)}
      decoding="async"
    />
  );
}

export function TaglineStack({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        "font-display text-5xl uppercase leading-display tracking-tight text-foreground sm:text-6xl md:text-7xl",
        className,
      )}
    >
      <span className="block">Dos colores.</span>
      <span className="block text-accent">Una ciudad.</span>
      <span className="block">Todo el fútbol.</span>
    </h1>
  );
}
