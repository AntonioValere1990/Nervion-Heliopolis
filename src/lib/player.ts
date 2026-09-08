import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { APP_NAME } from "./brand";
import { getEpisode, getShow, nextEpisode, type Episode } from "./catalog";

const CACHE = "despues-audio-v1";

type Progress = { position: number; duration: number; updatedAt: number };

type PlayerState = {
  hydrated: boolean;
  currentId: string | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  buffered: number;
  speed: number;
  expanded: boolean;
  sleepEndsAt: number | null;
  progress: Record<string, Progress>;
  saved: string[];
  downloaded: string[];
  followed: string[];
  setHydrated: (v: boolean) => void;
  setExpanded: (v: boolean) => void;
  setSpeed: (v: number) => void;
  toggleSaved: (id: string) => void;
  toggleFollowed: (id: string) => void;
  markDownloaded: (id: string, on: boolean) => void;
  setSleepEndsAt: (v: number | null) => void;
  playEpisode: (id: string) => void;
  toggle: () => void;
  seek: (t: number) => void;
  skip: (delta: number) => void;
  pause: () => void;
};

let audio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let sleepTimer: number | null = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onTime);
    audio.addEventListener("progress", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", () => usePlayer.setState({ isPlaying: true }));
    audio.addEventListener("pause", () => usePlayer.setState({ isPlaying: false }));
    audio.addEventListener("error", () => usePlayer.setState({ isPlaying: false }));
  }
  return audio;
}

function onTime() {
  if (!audio) return;
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  let buffered = 0;
  if (audio.buffered.length > 0) {
    buffered = audio.buffered.end(audio.buffered.length - 1);
  }
  const currentId = usePlayer.getState().currentId;
  const position = audio.currentTime;
  usePlayer.setState({ position, duration, buffered });
  if (currentId && duration > 0) {
    usePlayer.setState((s) => ({
      progress: {
        ...s.progress,
        [currentId]: { position, duration, updatedAt: Date.now() },
      },
    }));
  }
  updateMediaPosition();
}

function onEnded() {
  const id = usePlayer.getState().currentId;
  if (!id) return;
  const nxt = nextEpisode(id);
  if (nxt && nxt.id !== id) {
    void loadAndPlay(nxt);
  } else {
    usePlayer.setState({ isPlaying: false, position: 0 });
  }
}

function updateMediaPosition() {
  if (!audio || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.setPositionState({
      duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      playbackRate: audio.playbackRate,
      position: audio.currentTime,
    });
  } catch {
    /* ignore */
  }
}

function setMediaSession(ep: Episode) {
  if (!("mediaSession" in navigator)) return;
  const showTitle = getShow(ep.showId)?.title ?? APP_NAME;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: ep.title,
    artist: showTitle,
    album: APP_NAME,
    artwork: [
      {
        src: new URL(ep.cover, window.location.origin).href,
        sizes: "900x900",
        type: "image/jpeg",
      },
    ],
  });
  navigator.mediaSession.setActionHandler("play", () => void getAudio()?.play());
  navigator.mediaSession.setActionHandler("pause", () => getAudio()?.pause());
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    const a = getAudio();
    if (a) a.currentTime = Math.max(0, a.currentTime - 15);
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    const a = getAudio();
    if (a) a.currentTime = Math.min(a.duration || 0, a.currentTime + 15);
  });
  navigator.mediaSession.setActionHandler("seekbackward", () => {
    const a = getAudio();
    if (a) a.currentTime = Math.max(0, a.currentTime - 15);
  });
  navigator.mediaSession.setActionHandler("seekforward", () => {
    const a = getAudio();
    if (a) a.currentTime = Math.min(a.duration || 0, a.currentTime + 15);
  });
}

async function cachedUrl(path: string): Promise<string | null> {
  if (!("caches" in window)) return null;
  try {
    const cache = await caches.open(CACHE);
    const res = await cache.match(path);
    if (!res) return null;
    const blob = await res.blob();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  } catch {
    return null;
  }
}

async function loadAndPlay(ep: Episode) {
  const el = getAudio();
  if (!el) return;
  const downloaded = usePlayer.getState().downloaded.includes(ep.id);
  let src = ep.audio;
  if (downloaded) {
    const cached = await cachedUrl(ep.audio);
    if (cached) src = cached;
  }
  el.src = src;
  el.playbackRate = usePlayer.getState().speed;
  const saved = usePlayer.getState().progress[ep.id];
  const resume =
    saved && saved.position > 3 && saved.position < saved.duration - 5 ? saved.position : 0;
  const onMeta = () => {
    if (resume > 0 && resume < (el.duration || Infinity)) el.currentTime = resume;
    el.removeEventListener("loadedmetadata", onMeta);
  };
  el.addEventListener("loadedmetadata", onMeta);
  usePlayer.setState({ currentId: ep.id, isPlaying: true });
  setMediaSession(ep);
  try {
    await el.play();
  } catch {
    usePlayer.setState({ isPlaying: false });
  }
}

export async function downloadEpisode(id: string): Promise<boolean> {
  const ep = getEpisode(id);
  if (!ep || !("caches" in window)) return false;
  try {
    const cache = await caches.open(CACHE);
    const res = await fetch(ep.audio);
    if (!res.ok) return false;
    await cache.put(ep.audio, res);
    usePlayer.getState().markDownloaded(id, true);
    return true;
  } catch {
    return false;
  }
}

export async function removeDownload(id: string) {
  const ep = getEpisode(id);
  if (!ep || !("caches" in window)) return;
  try {
    const cache = await caches.open(CACHE);
    await cache.delete(ep.audio);
  } catch {
    /* ignore */
  }
  usePlayer.getState().markDownloaded(id, false);
}

function armSleep(endsAt: number | null) {
  if (sleepTimer != null) {
    window.clearTimeout(sleepTimer);
    sleepTimer = null;
  }
  if (endsAt == null) return;
  const wait = Math.max(0, endsAt - Date.now());
  sleepTimer = window.setTimeout(() => {
    getAudio()?.pause();
    usePlayer.setState({ sleepEndsAt: null });
  }, wait);
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentId: null,
      isPlaying: false,
      position: 0,
      duration: 0,
      buffered: 0,
      speed: 1,
      expanded: false,
      sleepEndsAt: null,
      progress: {},
      saved: [],
      downloaded: [],
      followed: ["despues"],
      setHydrated: (v) => set({ hydrated: v }),
      setExpanded: (v) => set({ expanded: v }),
      setSpeed: (v) => {
        set({ speed: v });
        const el = getAudio();
        if (el) el.playbackRate = v;
      },
      toggleSaved: (id) =>
        set((s) => ({
          saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
        })),
      toggleFollowed: (id) =>
        set((s) => ({
          followed: s.followed.includes(id)
            ? s.followed.filter((x) => x !== id)
            : [...s.followed, id],
        })),
      markDownloaded: (id, on) =>
        set((s) => ({
          downloaded: on
            ? s.downloaded.includes(id)
              ? s.downloaded
              : [...s.downloaded, id]
            : s.downloaded.filter((x) => x !== id),
        })),
      setSleepEndsAt: (v) => {
        set({ sleepEndsAt: v });
        if (typeof window !== "undefined") armSleep(v);
      },
      playEpisode: (id) => {
        const ep = getEpisode(id);
        if (!ep) return;
        if (get().currentId === id) {
          const el = getAudio();
          if (el?.paused) void el.play();
          return;
        }
        void loadAndPlay(ep);
      },
      toggle: () => {
        const el = getAudio();
        const id = get().currentId;
        if (!el || !id) {
          const featured = getEpisode("ciudad");
          if (featured) void loadAndPlay(featured);
          return;
        }
        if (el.paused) void el.play();
        else el.pause();
      },
      seek: (t) => {
        const el = getAudio();
        if (!el) return;
        el.currentTime = Math.max(0, Math.min(t, el.duration || t));
        onTime();
      },
      skip: (delta) => {
        const el = getAudio();
        if (!el) return;
        el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
        onTime();
      },
      pause: () => getAudio()?.pause(),
    }),
    {
      name: "despues-player",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        currentId: s.currentId,
        speed: s.speed,
        progress: s.progress,
        saved: s.saved,
        downloaded: s.downloaded,
        followed: s.followed,
      }),
      onRehydrateStorage: () => () => {
        usePlayer.setState({ hydrated: true, isPlaying: false, expanded: false });
      },
    },
  ),
);
