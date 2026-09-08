import { useEffect, useState } from "react";
import {
  Bookmark,
  Check,
  ChevronDown,
  Download,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Timer,
} from "lucide-react";
import { Cover } from "@/components/cover";
import { Waveform } from "@/components/waveform";
import { Button } from "@/components/ui/button";
import { getEpisode, getShow, nextEpisode } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { downloadEpisode, usePlayer } from "@/lib/player";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SPEEDS = [0.75, 1, 1.2, 1.5, 1.75, 2];
const SLEEP = [
  { label: "Apagado", min: 0 },
  { label: "5 min", min: 5 },
  { label: "15 min", min: 15 },
  { label: "30 min", min: 30 },
  { label: "45 min", min: 45 },
  { label: "1 hora", min: 60 },
];

export function FullPlayer() {
  const expanded = usePlayer((s) => s.expanded);
  const currentId = usePlayer((s) => s.currentId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const position = usePlayer((s) => s.position);
  const duration = usePlayer((s) => s.duration);
  const speed = usePlayer((s) => s.speed);
  const sleepEndsAt = usePlayer((s) => s.sleepEndsAt);
  const saved = usePlayer((s) => s.saved);
  const downloaded = usePlayer((s) => s.downloaded);
  const toggle = usePlayer((s) => s.toggle);
  const seek = usePlayer((s) => s.seek);
  const skip = usePlayer((s) => s.skip);
  const setSpeed = usePlayer((s) => s.setSpeed);
  const setExpanded = usePlayer((s) => s.setExpanded);
  const toggleSaved = usePlayer((s) => s.toggleSaved);
  const setSleepEndsAt = usePlayer((s) => s.setSleepEndsAt);
  const playEpisode = usePlayer((s) => s.playEpisode);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<"speed" | "sleep" | null>(null);
  const [now, setNow] = useState(Date.now());

  const ep = currentId ? getEpisode(currentId) : undefined;
  const show = ep ? getShow(ep.showId) : undefined;
  const nxt = currentId ? nextEpisode(currentId) : undefined;

  useEffect(() => {
    if (!expanded) setSheet(null);
  }, [expanded]);

  useEffect(() => {
    if (!sleepEndsAt) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [sleepEndsAt]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, setExpanded]);

  if (!ep) return null;

  const pct = duration > 0 ? position / duration : 0;
  const isSaved = saved.includes(ep.id);
  const isDl = downloaded.includes(ep.id);
  const sleepLeft = sleepEndsAt ? Math.max(0, sleepEndsAt - now) : 0;
  const episodeId = ep.id;

  async function onDownload() {
    if (isDl || busy) return;
    setBusy(true);
    const ok = await downloadEpisode(episodeId);
    setBusy(false);
    if (ok) toast.success("Descarga lista. Disponible sin conexión.");
    else toast.error("No se pudo descargar.");
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background",
        "transition-[transform,opacity] duration-500 ease-out",
        expanded
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-[8%] opacity-0",
      )}
      aria-hidden={!expanded}
      inert={!expanded}
    >
      <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          aria-label="Cerrar reproductor"
          onClick={() => setExpanded(false)}
          className="flex size-11 items-center justify-center text-foreground"
        >
          <ChevronDown className="size-6" />
        </button>
        <p className="font-display text-kicker uppercase tracking-kicker text-muted">
          {show?.title}
        </p>
        <span className="size-11" />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8">
        <div className="flex flex-1 items-center py-4">
          <Cover src={ep.cover} alt="" size="hero" className="mx-auto max-w-80 shadow-lg" />
        </div>

        <div className="mb-5">
          <h2 className="font-display text-3xl uppercase leading-none tracking-tight text-balance text-foreground">
            {ep.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{show?.host}</p>
        </div>

        <Waveform
          id={ep.id}
          progress={pct}
          onSeek={(r) => seek(r * (duration || 0))}
        />
        <div className="mt-1 flex justify-between text-xs tabular-nums text-muted">
          <span>{formatTime(position)}</span>
          <span>-{formatTime(Math.max(0, duration - position))}</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-8">
          <button
            type="button"
            aria-label="Atrás 15 segundos"
            onClick={() => skip(-15)}
            className="relative flex size-12 items-center justify-center text-foreground"
          >
            <RotateCcw className="size-6" />
            <span className="absolute font-display text-kicker font-semibold tabular-nums">15</span>
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            onClick={toggle}
            className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground active:scale-[0.96]"
          >
            {isPlaying ? (
              <Pause className="size-7 fill-current" />
            ) : (
              <Play className="size-7 fill-current pl-0.5" />
            )}
          </button>
          <button
            type="button"
            aria-label="Adelante 15 segundos"
            onClick={() => skip(15)}
            className="relative flex size-12 items-center justify-center text-foreground"
          >
            <RotateCw className="size-6" />
            <span className="absolute font-display text-kicker font-semibold tabular-nums">15</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSheet(sheet === "speed" ? null : "speed")}
            className="h-9 rounded-full px-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            {speed === 1 ? "1x" : `${speed}x`}
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={isSaved ? "Quitar de guardados" : "Guardar"}
              onClick={() => toggleSaved(ep.id)}
              className="flex size-11 items-center justify-center text-foreground"
            >
              <Bookmark
                className={cn("size-5", isSaved && "fill-accent text-accent")}
              />
            </button>
            <button
              type="button"
              aria-label={isDl ? "Descargado" : "Descargar"}
              onClick={() => void onDownload()}
              className="flex size-11 items-center justify-center text-foreground"
            >
              {busy ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : isDl ? (
                <Check className="size-5 text-accent" />
              ) : (
                <Download className="size-5" />
              )}
            </button>
            <button
              type="button"
              aria-label="Temporizador"
              onClick={() => setSheet(sheet === "sleep" ? null : "sleep")}
              className="flex size-11 items-center justify-center text-foreground"
            >
              <Timer className={cn("size-5", sleepEndsAt && "text-accent")} />
            </button>
          </div>
        </div>

        {sheet === "speed" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {SPEEDS.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={s === speed ? "default" : "secondary"}
                onClick={() => {
                  setSpeed(s);
                  setSheet(null);
                }}
              >
                {s === 1 ? "1x" : `${s}x`}
              </Button>
            ))}
          </div>
        ) : null}

        {sheet === "sleep" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {SLEEP.map((s) => (
              <Button
                key={s.label}
                size="sm"
                variant={
                  (s.min === 0 && !sleepEndsAt) ||
                  (s.min > 0 && sleepEndsAt != null && Math.abs(sleepLeft / 60000 - s.min) < 0.5)
                    ? "default"
                    : "secondary"
                }
                onClick={() => {
                  setSleepEndsAt(s.min === 0 ? null : Date.now() + s.min * 60_000);
                  setSheet(null);
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        ) : null}

        {sleepEndsAt && sleepLeft > 0 ? (
          <p className="mt-3 text-center text-xs tabular-nums text-muted">
            Duerme en {formatTime(sleepLeft / 1000)}
          </p>
        ) : null}

        {nxt && nxt.id !== ep.id ? (
          <button
            type="button"
            onClick={() => playEpisode(nxt.id)}
            className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary p-3 text-left"
          >
            <Cover src={nxt.cover} alt="" size="xs" />
            <span className="min-w-0">
              <span className="block font-display text-kicker uppercase tracking-kicker text-muted">
                A continuación
              </span>
              <span className="block truncate text-sm text-foreground">{nxt.title}</span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
