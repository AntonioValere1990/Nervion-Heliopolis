import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CATEGORIES,
  EPISODES,
  SHOWS,
  getCatalogSnapshot,
  setCatalogOverlay,
  subscribeCatalog,
  type Episode,
  type Show,
} from "./catalog";

export const COVER_OPTIONS = [
  "/covers/portada.jpg",
  "/covers/show-nh.jpg",
  "/covers/show-nervion.jpg",
  "/covers/show-heliopolis.jpg",
  "/covers/show-derbi.jpg",
  "/covers/ep-ciudad.jpg",
  "/covers/ep-tejados.jpg",
  "/covers/ep-dormir.jpg",
  "/covers/ep-cine.jpg",
  "/covers/ep-mesa.jpg",
  "/covers/ep-fuego.jpg",
  "/covers/ep-pasillo.jpg",
  "/covers/ep-estadio.jpg",
  "/covers/ep-rio.jpg",
] as const;

export const AUDIO_OPTIONS = [
  "/audio/nocturno.mp3",
  "/audio/golondrinas.mp3",
  "/audio/vivo.mp3",
  "/audio/soneto.mp3",
  "/audio/ars.mp3",
  "/audio/repente.mp3",
  "/audio/platero.mp3",
  "/audio/redondillas.mp3",
  "/audio/a_ti.mp3",
  "/audio/belleza.mp3",
  "/audio/nariz.mp3",
] as const;

import { DEFAULT_LOGO_ID, type LogoId } from "./logos";

export { CATEGORIES };

function cloneShows(): Show[] {
  return SHOWS.map((s) => ({ ...s }));
}

function cloneEpisodes(): Episode[] {
  return EPISODES.map((e) => ({ ...e }));
}

function slugify(title: string) {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return `${base || "episodio"}-${Math.random().toString(36).slice(2, 6)}`;
}

function pushOverlay(shows: Show[], episodes: Episode[]) {
  setCatalogOverlay({ shows, episodes });
}

type StudioState = {
  hydrated: boolean;
  shows: Show[];
  episodes: Episode[];
  logoId: LogoId;
  seenBn: boolean;
  setHydrated: (v: boolean) => void;
  saveEpisode: (ep: Episode) => void;
  removeEpisode: (id: string) => void;
  setFeatured: (id: string) => void;
  saveShow: (show: Show) => void;
  setPodcastCover: (src: string) => void;
  setLogo: (id: LogoId) => void;
  reset: () => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      shows: cloneShows(),
      episodes: cloneEpisodes(),
      logoId: DEFAULT_LOGO_ID,
      seenBn: true,
      setHydrated: (v) => set({ hydrated: v }),
      saveEpisode: (ep) => {
        const episodes = get().episodes.some((e) => e.id === ep.id)
          ? get().episodes.map((e) => (e.id === ep.id ? ep : { ...e, featured: ep.featured ? false : e.featured }))
          : [
              ep,
              ...get().episodes.map((e) => (ep.featured ? { ...e, featured: false } : e)),
            ];
        const shows = get().shows;
        set({ episodes });
        pushOverlay(shows, episodes);
      },
      removeEpisode: (id) => {
        const prev = get().episodes;
        if (prev.length <= 1) return;
        const episodes = prev.filter((e) => e.id !== id);
        if (!episodes.some((e) => e.featured) && episodes[0]) {
          episodes[0] = { ...episodes[0], featured: true };
        }
        const shows = get().shows;
        set({ episodes });
        pushOverlay(shows, episodes);
      },
      setFeatured: (id) => {
        const episodes = get().episodes.map((e) => ({ ...e, featured: e.id === id }));
        const shows = get().shows;
        set({ episodes });
        pushOverlay(shows, episodes);
      },
      saveShow: (show) => {
        const shows = get().shows.map((s) => (s.id === show.id ? show : s));
        const episodes = get().episodes;
        set({ shows });
        pushOverlay(shows, episodes);
      },
      setPodcastCover: (src) => {
        const featuredId = get().episodes.find((e) => e.featured)?.id;
        const shows = get().shows.map((s) => (s.id === "despues" ? { ...s, cover: src } : s));
        const episodes = get().episodes.map((e) => (e.id === featuredId ? { ...e, cover: src } : e));
        set({ shows, episodes });
        pushOverlay(shows, episodes);
      },
      setLogo: (id) => set({ logoId: id }),
      reset: () => {
        const shows = cloneShows();
        const episodes = cloneEpisodes();
        set({ shows, episodes, logoId: DEFAULT_LOGO_ID, seenBn: true });
        pushOverlay(shows, episodes);
      },
    }),
    {
      name: "nh-studio",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        shows: s.shows,
        episodes: s.episodes,
        logoId: s.logoId,
        seenBn: s.seenBn,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const upgrade = (src: string) =>
            src === "/covers/show-nh.jpg" || src === "/covers/show-despues.jpg"
              ? "/covers/portada.jpg"
              : src;
          const shows = state.shows.map((s) =>
            s.id === "despues" ? { ...s, cover: upgrade(s.cover) } : s,
          );
          const featuredId = state.episodes.find((e) => e.featured)?.id;
          const episodes = state.episodes.map((e) =>
            e.id === featuredId ? { ...e, cover: upgrade(e.cover) } : e,
          );
          const logoId = state.seenBn ? (state.logoId ?? DEFAULT_LOGO_ID) : DEFAULT_LOGO_ID;
          useStudio.setState({ shows, episodes, logoId, seenBn: true, hydrated: true });
          pushOverlay(shows, episodes);
        } else {
          useStudio.setState({ hydrated: true });
        }
      },
    },
  ),
);

export function useCatalog() {
  return useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, getCatalogSnapshot);
}

export function newEpisodeDraft(showId = "despues"): Episode {
  const eps = useStudio.getState().episodes.filter((e) => e.showId === showId);
  const number = eps.reduce((m, e) => Math.max(m, e.number), 0) + 1;
  const season = eps[0]?.season ?? 2;
  return {
    id: slugify("nuevo"),
    showId,
    title: "",
    summary: "",
    description: "",
    cover: "/covers/portada.jpg",
    audio: "/audio/nocturno.mp3",
    publishedAt: new Date().toISOString(),
    durationSec: 0,
    season,
    number,
    category: "Fútbol",
    featured: false,
  };
}
