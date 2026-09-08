import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, House, Radio, SlidersHorizontal, Smartphone } from "lucide-react";
import { BrandMark, Logo } from "@/components/brand";
import { FullPlayer } from "@/components/full-player";
import { MiniPlayer } from "@/components/mini-player";
import { usePlayer } from "@/lib/player";
import { useStudio } from "@/lib/studio";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio", icon: House },
  { to: "/explorar", label: "Explorar", icon: Radio },
  { to: "/biblioteca", label: "Archivo", icon: Bookmark },
  { to: "/estudio", label: "Control", icon: SlidersHorizontal },
  { to: "/instalar", label: "Instalar", icon: Smartphone },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentId = usePlayer((s) => s.currentId);
  const expanded = usePlayer((s) => s.expanded);
  const hasMini = Boolean(currentId) && !expanded;

  useEffect(() => {
    void usePlayer.persist.rehydrate();
    void useStudio.persist.rehydrate();
    const t = window.setTimeout(() => {
      if (!usePlayer.getState().hydrated) usePlayer.setState({ hydrated: true });
      if (!useStudio.getState().hydrated) useStudio.setState({ hydrated: true });
    }, 200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-hairline bg-background px-3 py-6 md:flex">
        <Link to="/" className="mb-8 px-3">
          <Logo size={48} />
          <BrandMark size="md" className="mt-3 block" />
          <span className="derby-bar mt-3" />
          <span className="mt-3 block font-display text-kicker uppercase tracking-kicker text-muted">
            Sevilla y Betis
          </span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-56">
        <main
          className={cn(
            "mx-auto min-h-dvh w-full max-w-xl px-4 pt-[max(1rem,env(safe-area-inset-top))] md:max-w-5xl md:px-8",
            hasMini ? "pb-36" : "pb-24",
          )}
        >
          {children}
        </main>
      </div>

      <div className={cn("fixed inset-x-0 bottom-0 z-40 md:left-56", expanded && "hidden")}>
        <MiniPlayer />
        <nav className="flex border-t border-hairline bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-14 flex-1 flex-col items-center justify-center gap-0.5 font-display text-kicker uppercase tracking-kicker",
                  active ? "text-foreground" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <FullPlayer />
    </div>
  );
}
