import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Plus, RotateCcw, Star, Trash2, Upload } from "lucide-react";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import {
  AUDIO_OPTIONS,
  COVER_OPTIONS,
  newEpisodeDraft,
  useCatalog,
  useStudio,
} from "@/lib/studio";
import { LOGO_OPTIONS } from "@/lib/logos";
import { CATEGORIES, episodeCode, type Episode, type Show } from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { usePlayer } from "@/lib/player";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/estudio")({ component: Estudio });

function Estudio() {
  const { shows, episodes } = useCatalog();
  const saveEpisode = useStudio((s) => s.saveEpisode);
  const removeEpisode = useStudio((s) => s.removeEpisode);
  const setFeatured = useStudio((s) => s.setFeatured);
  const saveShow = useStudio((s) => s.saveShow);
  const setPodcastCover = useStudio((s) => s.setPodcastCover);
  const setLogo = useStudio((s) => s.setLogo);
  const logoId = useStudio((s) => s.logoId);
  const reset = useStudio((s) => s.reset);
  const downloaded = usePlayer((s) => s.downloaded);
  const progress = usePlayer((s) => s.progress);

  const [tab, setTab] = useState<"logo" | "portada" | "episodios" | "programas">("logo");
  const [editing, setEditing] = useState<Episode | null>(null);

  const sorted = useMemo(
    () => [...episodes].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)),
    [episodes],
  );
  const inCourse = Object.values(progress).filter((p) => p.position > 5 && p.position < p.duration - 5).length;
  const featured = episodes.find((e) => e.featured);
  const mainShow = shows.find((s) => s.id === "despues") ?? shows[0];
  const podcastCover = mainShow?.cover ?? "/covers/portada.jpg";

  function onNew() {
    setEditing(newEpisodeDraft(shows[0]?.id ?? "despues"));
  }

  function onReset() {
    reset();
    setEditing(null);
    toast.message("Catálogo restaurado.");
  }

  return (
    <div>
      <p className="font-display text-kicker uppercase tracking-kicker text-accent">Estudio</p>
      <h1 className="mt-1 font-display text-4xl uppercase leading-none tracking-tight text-foreground">
        Centro de control
      </h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        Aquí se monta el podcast. La portada oficial, los episodios y los programas.
        Lo que publiques sale en Inicio y Explorar.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Programas" value={String(shows.length)} />
        <Stat label="Episodios" value={String(episodes.length)} />
        <Stat label="Descargas" value={String(downloaded.length)} />
        <Stat label="En curso" value={String(inCourse)} />
      </div>

      {featured ? (
        <p className="mt-4 text-sm text-muted">
          Destacado: <span className="text-foreground">{featured.title}</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button size="pill" onClick={onNew}>
          <Plus className="size-4" />
          Nuevo episodio
        </Button>
        <Button size="pill" variant="outline" onClick={onReset}>
          <RotateCcw className="size-4" />
          Restaurar
        </Button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
        <TabChip active={tab === "logo"} onClick={() => setTab("logo")}>
          Logo
        </TabChip>
        <TabChip active={tab === "portada"} onClick={() => setTab("portada")}>
          Portada
        </TabChip>
        <TabChip active={tab === "episodios"} onClick={() => setTab("episodios")}>
          Episodios
        </TabChip>
        <TabChip active={tab === "programas"} onClick={() => setTab("programas")}>
          Programas
        </TabChip>
      </div>

      {editing ? (
        <EpisodeForm
          key={editing.id}
          episode={editing}
          shows={shows}
          onCancel={() => setEditing(null)}
          onSave={(ep) => {
            saveEpisode(ep);
            setEditing(null);
            toast.success("Episodio publicado.");
          }}
        />
      ) : null}

      {tab === "logo" ? (
        <section className="mt-6">
          <p className="mb-3 font-display text-kicker uppercase tracking-kicker text-accent">
            Versión en blanco y negro
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {LOGO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setLogo(opt.id);
                  toast.success(`Logo: ${opt.label}`);
                }}
                className={cn(
                  "overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-background",
                  logoId === opt.id ? "ring-accent" : "ring-transparent",
                )}
              >
                <img src={opt.src} alt={opt.label} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <img
            src={LOGO_OPTIONS.find((l) => l.id === logoId)?.stack ?? "/logos/bn-stack.png"}
            alt="Logo de Nervión & Heliópolis"
            className="mx-auto mt-6 w-full max-w-sm rounded-3xl"
            decoding="async"
          />
          <img
            src={LOGO_OPTIONS.find((l) => l.id === logoId)?.lockup ?? "/logos/bn-lockup.png"}
            alt=""
            className="mt-6 w-full rounded-2xl"
            decoding="async"
          />
          <p className="mt-4 text-center text-sm text-muted">
            B/N para la app. B/N claro para imprimir. El sello de color sigue disponible.
          </p>
          <div className="mt-6 space-y-2">
            <p className="font-display text-kicker uppercase tracking-kicker text-muted">
              Descargar JPG
            </p>
            <a
              href="/download/nervion-heliopolis-logo.jpg"
              download="nervion-heliopolis-logo.jpg"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground"
            >
              <Download className="size-4" />
              Sello B/N
            </a>
            <a
              href="/download/nervion-heliopolis-logo-completo.jpg"
              download="nervion-heliopolis-logo-completo.jpg"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-secondary text-sm font-medium"
            >
              <Download className="size-4" />
              Logo completo
            </a>
            <a
              href="/download/nervion-heliopolis-logo-claro.jpg"
              download="nervion-heliopolis-logo-claro.jpg"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-secondary text-sm font-medium"
            >
              <Download className="size-4" />
              Versión clara
            </a>
          </div>
        </section>
      ) : null}

      {tab === "portada" ? (
        <section className="mt-6">
          <Cover
            src={podcastCover}
            alt="Portada de Nervión & Heliópolis"
            size="hero"
            className="mx-auto max-w-sm rounded-2xl shadow-lg"
          />
          <p className="mt-4 text-center font-display text-xl uppercase tracking-tight">
            Nervión & Heliópolis
          </p>
          <p className="mt-1 text-center text-sm text-muted">
            Esta es la portada del programa. Sale en el inicio, al instalar y en el reproductor.
          </p>
          <div className="mt-6">
            <CoverPicker value={podcastCover} onChange={setPodcastCover} />
          </div>
          <label className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary text-sm font-medium">
            <Upload className="size-4" />
            Subir una portada
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                void fileToCover(file).then((src) => {
                  setPodcastCover(src);
                  toast.success("Portada actualizada.");
                });
              }}
            />
          </label>
        </section>
      ) : null}

      {tab === "episodios" ? (
        <section className="mt-6">
          {sorted.map((ep) => {
            const show = shows.find((s) => s.id === ep.showId);
            return (
              <div
                key={ep.id}
                className="flex items-center gap-3 border-b border-hairline py-3"
              >
                <Cover src={ep.cover} alt="" size="sm" />
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => setEditing({ ...ep })}
                >
                  <p className="truncate text-sm font-medium text-foreground">{ep.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {show?.title} · {episodeCode(ep)} · {formatTime(ep.durationSec)}
                    {ep.featured ? " · Destacado" : ""}
                  </p>
                </button>
                <button
                  type="button"
                  aria-label="Destacar"
                  onClick={() => setFeatured(ep.id)}
                  className="flex size-11 items-center justify-center text-foreground"
                >
                  <Star
                    className={cn("size-4", ep.featured && "fill-accent text-accent")}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => {
                    removeEpisode(ep.id);
                    if (editing?.id === ep.id) setEditing(null);
                    toast.message("Episodio fuera del aire.");
                  }}
                  className="flex size-11 items-center justify-center text-muted hover:text-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </section>
      ) : null}

      {tab === "programas" ? (
        <section className="mt-6 space-y-6">
          {shows.map((show) => (
            <ShowForm key={show.id} show={show} onSave={saveShow} />
          ))}
        </section>
      ) : null}

      <p className="mt-10 text-xs text-muted">
        Los cambios quedan en este teléfono.{" "}
        <Link to="/" className="text-foreground underline">
          Ver como oyente
        </Link>
        .
      </p>
    </div>
  );
}

function CoverPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (src: string) => void;
}) {
  const list = [value, ...COVER_OPTIONS].filter((c, i, a) => Boolean(c) && a.indexOf(c) === i);
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {list.map((src) => (
        <button
          key={src.slice(0, 48)}
          type="button"
          onClick={() => onChange(src)}
          className={cn(
            "overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-background",
            value === src ? "ring-accent" : "ring-transparent",
          )}
        >
          <Cover src={src} alt="" size="hero" className="rounded-lg" />
        </button>
      ))}
    </div>
  );
}

async function fileToCover(file: File) {
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const side = Math.min(bmp.width, bmp.height);
  const sx = (bmp.width - side) / 2;
  const sy = (bmp.height - side) / 2;
  ctx.drawImage(bmp, sx, sy, side, side, 0, 0, 900, 900);
  return canvas.toDataURL("image/jpeg", 0.88);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3">
      <p className="font-display text-kicker uppercase tracking-kicker text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl leading-none text-foreground">{value}</p>
    </div>
  );
}

function TabChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-9 rounded-full bg-accent px-4 font-display text-sm uppercase tracking-wide text-accent-foreground"
          : "h-9 rounded-full bg-secondary px-4 font-display text-sm uppercase tracking-wide text-foreground"
      }
    >
      {children}
    </button>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
const areaClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

function EpisodeForm({
  episode,
  shows,
  onSave,
  onCancel,
}: {
  episode: Episode;
  shows: Show[];
  onSave: (ep: Episode) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Episode>(episode);
  const patch = (p: Partial<Episode>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <form
      className="mt-6 space-y-3 rounded-3xl bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) {
          toast.error("Ponle un título.");
          return;
        }
        onSave({
          ...draft,
          title: draft.title.trim(),
          summary: draft.summary.trim(),
          description: draft.description.trim(),
        });
      }}
    >
      <p className="font-display text-kicker uppercase tracking-kicker text-accent">
        {episode.title ? "Editar" : "Nuevo episodio"}
      </p>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Título</span>
        <input
          className={fieldClass}
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Resumen</span>
        <input
          className={fieldClass}
          value={draft.summary}
          onChange={(e) => patch({ summary: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Texto</span>
        <textarea
          className={areaClass}
          rows={4}
          value={draft.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Programa</span>
          <select
            className={fieldClass}
            value={draft.showId}
            onChange={(e) => patch({ showId: e.target.value })}
          >
            {shows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Categoría</span>
          <select
            className={fieldClass}
            value={draft.category}
            onChange={(e) => patch({ category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Temporada</span>
          <input
            className={fieldClass}
            type="number"
            min={1}
            value={draft.season}
            onChange={(e) => patch({ season: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Número</span>
          <input
            className={fieldClass}
            type="number"
            min={1}
            value={draft.number}
            onChange={(e) => patch({ number: Number(e.target.value) || 1 })}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Audio (URL o archivo de la app)</span>
        <input
          className={fieldClass}
          value={draft.audio}
          onChange={(e) => patch({ audio: e.target.value })}
        />
        <select
          className={`${fieldClass} mt-2`}
          value={AUDIO_OPTIONS.some((a) => a === draft.audio) ? draft.audio : ""}
          onChange={(e) => {
            if (e.target.value) patch({ audio: e.target.value });
          }}
        >
          <option value="">Elegir un audio de muestra…</option>
          {AUDIO_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a.replace("/audio/", "")}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-xs text-muted">Portada</span>
        <CoverPicker value={draft.cover} onChange={(cover) => patch({ cover })} />
      </label>
      <label className="flex h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(draft.featured)}
          onChange={(e) => patch({ featured: e.target.checked })}
          className="size-4 accent-accent"
        />
        Destacar en el inicio
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="pill">
          Publicar
        </Button>
        <Button type="button" size="pill" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function ShowForm({ show, onSave }: { show: Show; onSave: (s: Show) => void }) {
  const [draft, setDraft] = useState(show);
  return (
    <form
      className="rounded-3xl bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...draft, title: draft.title.trim() });
        toast.success("Programa actualizado.");
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <Cover src={draft.cover} alt="" size="sm" />
        <p className="font-display text-xl uppercase tracking-tight">{draft.title}</p>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-muted">Título</span>
        <input
          className={fieldClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </label>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-muted">Lema</span>
        <input
          className={fieldClass}
          value={draft.tagline}
          onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
        />
      </label>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs text-muted">Descripción</span>
        <textarea
          className={areaClass}
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>
      <label className="mt-3 block">
        <span className="mb-2 block text-xs text-muted">Portada</span>
        <CoverPicker value={draft.cover} onChange={(cover) => setDraft({ ...draft, cover })} />
      </label>
      <Button type="submit" size="sm" className="mt-4">
        Guardar
      </Button>
    </form>
  );
}
