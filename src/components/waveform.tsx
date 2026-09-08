import { barsFor } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Waveform({
  id,
  progress,
  onSeek,
  className,
}: {
  id: string;
  progress: number;
  onSeek?: (ratio: number) => void;
  className?: string;
}) {
  const bars = barsFor(id, 52);
  return (
    <div
      role={onSeek ? "slider" : undefined}
      tabIndex={onSeek ? 0 : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Posición"
      className={cn("flex h-12 w-full items-end gap-0.5", className)}
      onClick={
        onSeek
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSeek((e.clientX - rect.left) / rect.width);
            }
          : undefined
      }
    >
      {bars.map((h, i) => {
        const ratio = (i + 0.5) / bars.length;
        const active = ratio <= progress;
        return (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-full transition-colors duration-150",
              active ? "bg-accent" : "bg-border",
            )}
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        );
      })}
    </div>
  );
}
