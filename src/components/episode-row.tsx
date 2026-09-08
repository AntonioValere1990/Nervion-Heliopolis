import { Download, Pause, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { episodeCode, getShow, type Episode } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { usePlayer } from "@/lib/player";
import { cn } from "@/lib/utils";

export function EpisodeRow({
  episode,
  showShow = true,
}: {
  episode: Episode;
  showShow?: boolean;
}) {
  const currentId = usePlayer((s) => s.currentId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const playEpisode = usePlayer((s) => s.playEpisode);
  const toggle = usePlayer((s) => s.toggle);
  const progress = usePlayer((s) => s.progress[episode.id]);
  const downloaded = usePlayer((s) => s.downloaded.includes(episode.id));
  const show = getShow(episode.showId);
  const active = currentId === episode.id;
  const playing = active && isPlaying;
  const pct =
    progress && progress.duration > 0
      ? Math.min(1, progress.position / progress.duration)
      : 0;

  return (
    <div className="group relative flex items-center gap-3 py-2.5">
      <button
        type="button"
        aria-label={playing ? "Pausar" : "Reproducir"}
        onClick={() => (active ? toggle() : playEpisode(episode.id))}
        className="relative shrink-0"
      >
        <Cover src={episode.cover} alt="" size="sm" />
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {playing ? (
            <Pause className="size-5 fill-foreground text-foreground" />
          ) : (
            <Play className="size-5 fill-foreground text-foreground" />
          )}
        </span>
        {playing ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/35 md:hidden">
            <Pause className="size-5 fill-foreground text-foreground" />
          </span>
        ) : null}
      </button>
      <Link
        to="/episode/$episodeId"
        params={{ episodeId: episode.id }}
        className="min-w-0 flex-1"
      >
        <p className="truncate text-sm font-medium text-foreground text-pretty">
          {episode.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {showShow && show ? `${show.title} · ` : null}
          {episodeCode(episode)} · {formatTime(episode.durationSec)}
        </p>
        {pct > 0.02 && pct < 0.97 ? (
          <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-secondary">
            <span
              className="block h-full bg-accent"
              style={{ width: `${pct * 100}%` }}
            />
          </span>
        ) : null}
      </Link>
      {downloaded ? (
        <Download className="size-3.5 shrink-0 text-muted" aria-label="Descargado" />
      ) : null}
      <span
        className={cn(
          "absolute inset-x-0 -bottom-px h-px bg-hairline",
          "group-last:hidden",
        )}
      />
    </div>
  );
}
