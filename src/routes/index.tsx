import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Pause, Play } from "lucide-react";
import { BrandLockup, BrandPill, LogoLockup, TaglineStack } from "@/components/brand";
import { Cover } from "@/components/cover";
import { EpisodeRow } from "@/components/episode-row";
import { Button } from "@/components/ui/button";
import {
  episodeCode,
  featuredEpisode,
  getEpisode,
  getShow,
  latestEpisodes,
} from "@/lib/catalog";
import { formatTime } from "@/lib/format";
import { usePlayer } from "@/lib/player";
import { useCatalog } from "@/lib/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = featuredEpisode();
  const show = featured ? getShow(featured.showId) : undefined;
  const { shows } = useCatalog();
  const currentId = usePlayer((s) => s.currentId);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const playEpisode = usePlayer((s) => s.playEpisode);
  const toggle = usePlayer((s) => s.toggle);
  const hydrated = usePlayer((s) => s.hydrated);
  const progress = usePlayer((s) => s.progress);
  const playingFeatured = currentId === featured?.id && isPlaying;

  const continueId =
    hydrated && currentId && progress[currentId] && progress[currentId].position > 5
      ? currentId
      : Object.entries(progress)
          .filter(([, p]) => p.position > 5 && p.position < p.duration - 5)
          .sort((a, b) => b[1].updatedAt - a[1].updatedAt)[0]?.[0];
  const continueEp = continueId ? getEpisode(continueId) : undefined;
  const rest = latestEpisodes(8).filter((e) => e.id !== featured?.id);

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4 md:hidden">
        <BrandLockup size="sm" />
        <Link
          to="/instalar"
          className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground"
          aria-label="Instalar la app"
        >
          <Download className="size-4" />
        </Link>
      </header>

      <section className="hero-stage relative -mx-4 mb-10 overflow-hidden px-4 py-6 md:-mx-8 md:px-8 md:py-8">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <LogoLockup className="mb-5 hidden max-w-md md:block" />
            <BrandPill />
            <TaglineStack className="mt-5" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Podcast independiente. Sevilla y Betis. Jornada, derbi y calle.
            </p>
            {featured ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  size="pill"
                  onClick={() =>
                    currentId === featured.id ? toggle() : playEpisode(featured.id)
                  }
                >
                  {playingFeatured ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 fill-current" />
                  )}
                  {playingFeatured ? "Pausar" : "Reproducir"}
                </Button>
                <Button size="pill" variant="outline" asChild>
                  <Link to="/episode/$episodeId" params={{ episodeId: featured.id }}>
                    Último episodio
                  </Link>
                </Button>
              </div>
            ) : null}
            {featured && show ? (
              <p className="mt-5 text-sm text-muted">
                <span className="font-display text-kicker uppercase tracking-kicker text-accent">
                  {episodeCode(featured)} · Nuevo
                </span>
                <span className="mt-1 block text-foreground">{featured.title}</span>
                <span className="mt-1 block">
                  {show.host} · {formatTime(featured.durationSec)}
                </span>
              </p>
            ) : null}
          </div>
          {featured ? (
            <Cover
              src={featured.cover}
              alt="Nervión & Heliópolis"
              size="hero"
              className="mx-auto max-w-md rounded-2xl shadow-lg md:mx-0"
            />
          ) : null}
        </div>
      </section>

      {continueEp && continueEp.id !== featured?.id ? (
        <section className="mb-10">
          <h3 className="mb-3 font-display text-kicker uppercase tracking-kicker text-muted">
            Seguir escuchando
          </h3>
          <button
            type="button"
            onClick={() => playEpisode(continueEp.id)}
            className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left"
          >
            <Cover src={continueEp.cover} alt="" size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{continueEp.title}</span>
              <span className="mt-1 block text-xs text-muted">
                {formatTime(progress[continueEp.id]?.position ?? 0)} de{" "}
                {formatTime(continueEp.durationSec)}
              </span>
              <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full bg-accent"
                  style={{
                    width: `${Math.min(
                      100,
                      ((progress[continueEp.id]?.position ?? 0) / continueEp.durationSec) * 100,
                    )}%`,
                  }}
                />
              </span>
            </span>
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Play className="size-4 fill-current" />
            </span>
          </button>
        </section>
      ) : null}

      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-kicker uppercase tracking-kicker text-muted">
            Esta semana
          </h3>
          <Link to="/explorar" className="text-xs text-muted hover:text-foreground">
            Ver todo
          </Link>
        </div>
        <div>
          {rest.map((ep) => (
            <EpisodeRow key={ep.id} episode={ep} />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 font-display text-kicker uppercase tracking-kicker text-muted">
          Programas
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shows.map((s) => (
            <Link
              key={s.id}
              to="/show/$showId"
              params={{ showId: s.id }}
              className="group"
            >
              <Cover src={s.cover} alt="" size="hero" className="rounded-2xl" />
              <p className="mt-2 truncate font-display text-sm uppercase tracking-wide">
                {s.title}
              </p>
              <p className="truncate text-xs text-muted">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
