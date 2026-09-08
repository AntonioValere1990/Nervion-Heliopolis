import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Cover } from "@/components/cover";
import { EpisodeRow } from "@/components/episode-row";
import { Button } from "@/components/ui/button";
import { episodesForShow, getShow } from "@/lib/catalog";
import { usePlayer } from "@/lib/player";
import { useCatalog } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/show/$showId")({ component: ShowPage });

function ShowPage() {
  const { showId } = Route.useParams();
  useCatalog();
  const show = getShow(showId);
  const episodes = episodesForShow(showId);
  const followed = usePlayer((s) => s.followed.includes(showId));
  const toggleFollowed = usePlayer((s) => s.toggleFollowed);
  const playEpisode = usePlayer((s) => s.playEpisode);

  if (!show) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted">No encontramos este programa.</p>
        <Link to="/" className="mt-3 inline-block text-sm text-foreground underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Cover src={show.cover} alt="" size="hero" className="mx-auto mb-6 max-w-72" />
      <p className="text-center font-display text-kicker uppercase tracking-kicker text-muted">
        {show.category} · {show.frequency}
      </p>
      <h1 className="mt-2 text-center font-display text-4xl uppercase leading-none tracking-tight text-foreground">
        {show.title}
      </h1>
      <p className="mt-1 text-center text-sm text-muted">{show.host}</p>
      <p className="mx-auto mt-3 max-w-prose text-center text-sm leading-relaxed text-muted">
        {show.description}
      </p>
      <div className="mt-5 flex justify-center gap-2">
        {episodes[0] ? (
          <Button size="pill" onClick={() => playEpisode(episodes[0].id)}>
            Reproducir
          </Button>
        ) : null}
        <Button
          size="pill"
          variant={followed ? "secondary" : "outline"}
          onClick={() => toggleFollowed(show.id)}
          className={cn(followed && "gap-1.5")}
        >
          {followed ? <Check className="size-3.5" /> : null}
          {followed ? "Siguiendo" : "Seguir"}
        </Button>
      </div>

      <section className="mt-10">
        <h2 className="mb-2 font-display text-kicker uppercase tracking-kicker text-muted">
          {episodes.length} episodios
        </h2>
        {episodes.map((ep) => (
          <EpisodeRow key={ep.id} episode={ep} showShow={false} />
        ))}
      </section>
    </div>
  );
}
