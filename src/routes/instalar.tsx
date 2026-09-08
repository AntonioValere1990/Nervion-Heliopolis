import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Share, Smartphone } from "lucide-react";
import { BrandPill, Logo, LogoStack } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useInstall } from "@/lib/install";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { toast } from "sonner";

export const Route = createFileRoute("/instalar")({ component: Instalar });

function Instalar() {
  const { canInstall, installed, install } = useInstall();

  async function onInstall() {
    const ok = await install();
    if (ok) toast.success(`${APP_NAME} está en tu pantalla de inicio.`);
  }

  return (
    <div>
      <BrandPill />
      <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-tight text-foreground">
        Llévala en el teléfono
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
        {APP_NAME} se instala como una aplicación. Reproductor a pantalla completa,
        descargas sin conexión y un icono en tu pantalla de inicio — en Android y
        en iPhone.
      </p>

      <LogoStack className="mt-8" />

      <div className="mt-6 flex items-center gap-4 rounded-3xl bg-card p-4">
        <Logo size={72} className="rounded-2xl" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg uppercase leading-none tracking-wide">
            Nervión <span className="text-accent">&</span> Heliópolis
          </p>
          <p className="mt-2 text-xs text-muted">{APP_TAGLINE}</p>
          <p className="mt-2 text-xs text-muted">Libre · Sin anuncios · Sin cuenta</p>
        </div>
      </div>

      {installed ? (
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm">
          <Check className="size-4 text-accent" />
          Ya está instalada en este dispositivo.
        </div>
      ) : canInstall ? (
        <Button size="lg" className="mt-6 w-full" onClick={() => void onInstall()}>
          <Download className="size-4" />
          Instalar la app
        </Button>
      ) : (
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => {
            toast.message("Abre el menú del navegador y elige Instalar aplicación.");
          }}
        >
          <Smartphone className="size-4" />
          Instalar la app
        </Button>
      )}

      <ol className="mt-10 space-y-6">
        <Step n="01" title="En Android">
          Abre esta página en Chrome. Toca el menú (tres puntos) y elige{" "}
          <strong className="font-medium text-foreground">Instalar aplicación</strong> o{" "}
          <strong className="font-medium text-foreground">Añadir a la pantalla de inicio</strong>.
          El icono de {APP_NAME} queda junto al resto de apps, lista para abrirla sin el
          navegador.
        </Step>
        <Step n="02" title="En iPhone">
          En Safari, toca el botón de compartir{" "}
          <Share className="inline size-3.5 align-text-bottom" /> y elige{" "}
          <strong className="font-medium text-foreground">Añadir a pantalla de inicio</strong>.
        </Step>
        <Step n="03" title="Sin conexión">
          Dentro de un episodio, toca descargar. El audio queda en el teléfono y se oye
          aunque no haya red — igual que una app de podcasts de toda la vida.
        </Step>
      </ol>

      <section className="mt-12 border-t border-hairline pt-8">
        <h2 className="font-display text-2xl uppercase tracking-tight">El programa</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {APP_NAME} es un podcast independiente sobre Sevilla y Betis.{" "}
          {APP_TAGLINE} Antonio cubre jornada, derbi y calle. Junto al programa,
          las series Nervión, Heliópolis y Derbi.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Si tienes el RSS o los audios originales de cada episodio, dímelo y los
          conectamos al reproductor.
        </p>
      </section>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="w-8 shrink-0 font-display text-xl text-accent">{n}</span>
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
      </div>
    </li>
  );
}
