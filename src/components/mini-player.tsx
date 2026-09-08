import { Pause, Play } from "lucide-react";
import { Cover } from "@/components/cover";
import { getEpisode, getShow } from "@/lib/catalog";
import { usePlayer } from "@/lib/player";

export function MiniPlayer() {
  const currentId = usePlayer((s) => s.currentId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const toggle = usePlayer((s) => s.toggle);
  const setExpanded = usePlayer((s) => s.setExpanded);
  const ep = currentId ? getEpisode(currentId) : undefined;
  const show = ep ? getShow(ep.showId) : undefined;
  if (!ep) return null;
  const pct = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <div className="border-t border-hairline bg-card/95 backdrop-blur-sm">
      <div className="h-0.5 bg-secondary">
        <div className="h-full bg-accent" style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => setExpanded(true)}
        >
          <Cover src={ep.cover} alt="" size="xs" className="rounded-md" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {ep.title}
            </span>
            <span className="block truncate text-xs text-muted">
              {show?.title}
            </span>
          </span>
        </button>
        <button
          type="button"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          onClick={toggle}
          className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground active:scale-[0.96]"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current pl-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
