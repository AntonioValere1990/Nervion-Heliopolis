import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Check, Download, LoaderCircle, Pause, Play } from "lucide-react";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import { episodeCode, getEpisode, getShow } from "@/lib/catalog";
import { formatDate, formatTime } from "@/lib/format";
import { downloadEpisode, removeDownload, usePlayer } from "@/lib/player";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/episode/$episodeId")({ component: EpisodePage });

function EpisodePage() {
  const { episodeId } = Route.useParams();
  const ep = getEpisode(episodeId);
  const show = ep ? getShow(ep.showId) : undefined;
  const currentId = usePlayer((s) => s.currentId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const playEpisode = usePlayer((s) => s.playEpisode);
  const toggle = usePlayer((s) => s.toggle);
  const saved = usePlayer((s) => s.saved.includes(episodeId));
  const downloaded = usePlayer((s) => s.downloaded.includes(episodeId));
  const toggleSaved = usePlayer((s) => s.toggleSaved);
  const [busy, setBusy] = useState(false);

  if (!ep || !show) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted">No encontramos este episodio.</p>
        <Link to="/" className="mt-3 inline-block text-sm underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const playing = currentId === ep.id && isPlaying;
  const id = ep.id;

  async function onDownload() {
    if (busy) return;
    if (downloaded) {
      await removeDownload(id);
      toast.message("Descarga eliminada.");
      return;
    }
    setBusy(true);
    const ok = await downloadEpisode(id);
    setBusy(false);
    if (ok) toast.success("Descarga lista. Disponible sin conexión.");
    else toast.error("No se pudo descargar.");
  }

  return (
    <div>
      <Link
        to="/show/$showId"
        params={{ showId: show.id }}
        className="font-display text-kicker uppercase tracking-kicker text-muted"
      >
        {show.title}
      </Link>
      <div className="mt-4 flex gap-4">
        <Cover src={ep.cover} alt="" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">
            {episodeCode(ep)} · {formatDate(ep.publishedAt)}
          </p>
          <h1 className="mt-1 font-display text-3xl uppercase leading-none tracking-tight text-foreground">
            {ep.title}
          </h1>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">{ep.description}</p>
      <p className="mt-3 text-xs text-muted">
        {show.host} · {formatTime(ep.durationSec)} · {ep.category}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          size="pill"
          onClick={() => (currentId === ep.id ? toggle() : playEpisode(ep.id))}
        >
          {playing ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
          {playing ? "Pausar" : "Reproducir"}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label={saved ? "Quitar de guardados" : "Guardar"}
          onClick={() => toggleSaved(ep.id)}
        >
          <Bookmark className={cn("size-4", saved && "fill-accent text-accent")} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label={downloaded ? "Eliminar descarga" : "Descargar"}
          onClick={() => void onDownload()}
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : downloaded ? (
            <Check className="size-4" />
          ) : (
            <Download className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
