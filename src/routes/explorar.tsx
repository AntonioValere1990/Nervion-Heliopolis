import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Cover } from "@/components/cover";
import { EpisodeRow } from "@/components/episode-row";
import { CATEGORIES, searchEpisodes } from "@/lib/catalog";
import { useCatalog } from "@/lib/studio";

export const Route = createFileRoute("/explorar")({ component: Explorar });

function Explorar() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const { shows } = useCatalog();
  const results = searchEpisodes(q).filter((e) => (cat ? e.category === cat : true));

  return (
    <div>
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-foreground">Explorar</h1>
      <p className="mt-1 text-sm text-muted">Sevilla y Betis. Todo el fútbol.</p>

      <label className="relative mt-6 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar un episodio"
          className="h-12 w-full rounded-2xl border border-border bg-card pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted focus:ring-2 focus:ring-ring"
        />
      </label>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={cat === null} onClick={() => setCat(null)}>
          Todos
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {!q && !cat ? (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-kicker uppercase tracking-kicker text-muted">
            Programas
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {shows.map((s) => (
              <Link
                key={s.id}
                to="/show/$showId"
                params={{ showId: s.id }}
                className="w-36 shrink-0"
              >
                <Cover src={s.cover} alt="" size="hero" className="rounded-2xl" />
                <p className="mt-2 truncate text-sm font-medium">{s.title}</p>
                <p className="truncate text-xs text-muted">{s.frequency}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-2 font-display text-kicker uppercase tracking-kicker text-muted">
          {q ? `${results.length} resultados` : cat ? cat : "Todos los episodios"}
        </h2>
        {results.length === 0 ? (
          <p className="py-10 text-sm text-muted">Nada con esa búsqueda.</p>
        ) : (
          results.map((ep) => <EpisodeRow key={ep.id} episode={ep} />)
        )}
      </section>
    </div>
  );
}

function Chip({
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
          ? "h-9 shrink-0 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
          : "h-9 shrink-0 rounded-full bg-secondary px-4 text-sm font-medium text-foreground"
      }
    >
      {children}
    </button>
  );
}
