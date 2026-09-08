import { createFileRoute, Link } from "@tanstack/react-router";
import { EpisodeRow } from "@/components/episode-row";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import { getEpisode, type Episode } from "@/lib/catalog";
import { usePlayer } from "@/lib/player";
import { useCatalog } from "@/lib/studio";

export const Route = createFileRoute("/biblioteca")({ component: Biblioteca });

function asEpisode(id: string): Episode | undefined {
  return getEpisode(id);
}

function Biblioteca() {
  const saved = usePlayer((s) => s.saved);
  const downloaded = usePlayer((s) => s.downloaded);
  const followed = usePlayer((s) => s.followed);
  const progress = usePlayer((s) => s.progress);
  const hydrated = usePlayer((s) => s.hydrated);
  const { shows } = useCatalog();

  const savedEps = saved.map(asEpisode).filter((e): e is Episode => Boolean(e));
  const dlEps = downloaded.map(asEpisode).filter((e): e is Episode => Boolean(e));
  const inProgress = Object.entries(progress)
    .filter(([, p]) => p.position > 5 && p.position < p.duration - 5)
    .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
    .map(([id]) => asEpisode(id))
    .filter((e): e is Episode => Boolean(e));
  const followedShows = shows.filter((s) => followed.includes(s.id));

  if (!hydrated) {
    return (
      <div>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Archivo</h1>
        <p className="mt-4 text-sm text-muted">Cargando tu archivo…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-foreground">Archivo</h1>
      <p className="mt-1 text-sm text-muted">Guardados, descargas, en curso.</p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-kicker uppercase tracking-kicker text-muted">
          Siguiendo
        </h2>
        {followedShows.length === 0 ? (
          <Empty />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {followedShows.map((s) => (
              <Link
                key={s.id}
                to="/show/$showId"
                params={{ showId: s.id }}
                className="w-28 shrink-0"
              >
                <Cover src={s.cover} alt="" size="hero" className="rounded-2xl" />
                <p className="mt-2 truncate text-sm">{s.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 font-display text-kicker uppercase tracking-kicker text-muted">
          En curso
        </h2>
        {inProgress.length === 0 ? (
          <p className="py-4 text-sm text-muted">Cuando empieces un episodio, aparece aquí.</p>
        ) : (
          inProgress.map((ep) => <EpisodeRow key={ep.id} episode={ep} />)
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 font-display text-kicker uppercase tracking-kicker text-muted">
          Guardados
        </h2>
        {savedEps.length === 0 ? (
          <p className="py-4 text-sm text-muted">Marca un episodio con el marcador para volver.</p>
        ) : (
          savedEps.map((ep) => <EpisodeRow key={ep.id} episode={ep} />)
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 font-display text-kicker uppercase tracking-kicker text-muted">
          Descargas
        </h2>
        {dlEps.length === 0 ? (
          <p className="py-4 text-sm text-muted">Descarga un episodio para oírlo sin conexión.</p>
        ) : (
          dlEps.map((ep) => <EpisodeRow key={ep.id} episode={ep} />)
        )}
      </section>
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl bg-card px-4 py-6">
      <p className="text-sm text-muted">Aún no sigues ningún programa.</p>
      <Button size="sm" className="mt-3" asChild>
        <Link to="/explorar">Explorar</Link>
      </Button>
    </div>
  );
}
