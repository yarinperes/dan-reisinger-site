import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Print } from "@/data/prints";

type Props = {
  prints: Print[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onSelect: (print: Print) => void;
  selectLabel?: (print: Print) => string;
};

export function PrintLightbox({ prints, index, onIndex, onClose, onSelect, selectLabel }: Props) {
  const print = prints[index];
  const touchX = useRef<number | null>(null);

  const go = (delta: number) => {
    onIndex((index + delta + prints.length) % prints.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // RTL: right arrow moves to the previous item
      if (e.key === "ArrowRight") go(-1);
      if (e.key === "ArrowLeft") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  if (!print) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background/97 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-8">
        <span className="eyebrow">
          {index + 1} / {prints.length}
        </span>
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="flex flex-1 flex-col items-center gap-8 overflow-y-auto px-4 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;

          if (Math.abs(dx) > 50) go(dx < 0 ? -1 : 1);
          touchX.current = null;
        }}
      >
        <div className="relative flex w-full min-w-0 flex-1 items-center justify-center gap-2 sm:gap-6">
          <button
            onClick={() => go(-1)}
            aria-label="ההדפס הקודם"
            className="absolute start-0 top-1/2 z-10 -translate-y-1/2 shrink-0 rounded-full border border-border bg-card/90 p-3 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary sm:static sm:translate-y-0 sm:bg-card sm:shadow-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <img
            key={print.id}
            src={print.image}
            alt={print.title}
            width={900}
            height={1200}
            className="print-swap max-h-[52vh] w-auto max-w-full min-w-0 object-contain shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] lg:max-h-[72vh]"
          />

          <button
            onClick={() => go(1)}
            aria-label="ההדפס הבא"
            className="absolute end-0 top-1/2 z-10 -translate-y-1/2 shrink-0 rounded-full border border-border bg-card/90 p-3 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary sm:static sm:translate-y-0 sm:bg-card sm:shadow-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full max-w-md lg:shrink-0">
          {print.year && <p className="eyebrow">{print.year}</p>}
          <h2 className="mt-2 text-3xl sm:text-4xl">{print.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{print.technique}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-foreground/80">
            {print.description}
          </p>
          <Button className="mt-8 w-full" size="lg" onClick={() => onSelect(print)}>
            {selectLabel ? selectLabel(print) : "בחירת ההדפס הזה"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
            החליקו לדפדוף
          </p>
        </div>
      </div>
    </div>
  );
}
