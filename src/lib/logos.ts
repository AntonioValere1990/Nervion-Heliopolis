export const LOGO_OPTIONS = [
  {
    id: "bn",
    label: "B/N",
    src: "/logos/bn.png",
    lockup: "/logos/bn-lockup.png",
    stack: "/logos/bn-stack.png",
    shape: "circle" as const,
    mono: true,
  },
  {
    id: "bn-claro",
    label: "B/N claro",
    src: "/logos/bn-claro.png",
    lockup: "/logos/bn-claro-lockup.png",
    stack: "/logos/bn-claro-stack.png",
    shape: "circle" as const,
    mono: true,
  },
  {
    id: "sello",
    label: "Sello",
    src: "/logos/sello.png",
    lockup: "/logos/sello-lockup.png",
    stack: "/logos/sello-stack.png",
    shape: "circle" as const,
    mono: false,
  },
  {
    id: "micro",
    label: "Micro",
    src: "/logos/micro.png",
    lockup: "/logos/micro-lockup.png",
    stack: "/logos/micro-stack.png",
    shape: "square" as const,
    mono: false,
  },
  {
    id: "nh",
    label: "N & H",
    src: "/logos/nh.png",
    lockup: "/logos/nh-lockup.png",
    stack: "/logos/nh-stack.png",
    shape: "square" as const,
    mono: false,
  },
  {
    id: "cancha",
    label: "Cancha",
    src: "/logos/cancha.png",
    lockup: "/logos/cancha-lockup.png",
    stack: "/logos/cancha-stack.png",
    shape: "square" as const,
    mono: false,
  },
] as const;

export type LogoId = (typeof LOGO_OPTIONS)[number]["id"];

export const DEFAULT_LOGO_ID: LogoId = "bn";

export function getLogo(id?: string) {
  return LOGO_OPTIONS.find((l) => l.id === id) ?? LOGO_OPTIONS[0];
}
