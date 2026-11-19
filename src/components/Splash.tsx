import { useEffect, useRef, useState } from "react";
import { prints } from "@/data/prints";

// Keep the splash light: a handful of unique prints per row is enough to fill
// any viewport, and few enough images to decode before the animation starts.
const PER_ROW = 7;
const rowA = prints.slice(0, PER_ROW);
const rowB = prints.slice(PER_ROW, PER_ROW * 2);

// Each identical half includes its trailing gap, so -50% lands exactly
// on the next half without a jump at the loop boundary.
const strip = (items: typeof prints) => [...items, ...items, ...items];

const stripA = strip(rowA);
const stripB = strip(rowB);

const preloadList = [...rowA, ...rowB];

export function Splash({
  visible,
  onReady,
}: {
  visible: boolean;
  onReady?: () => void;
}) {
  const [ready, setReady] = useState(false);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (cancelled) return;
      cancelled = true;
      setReady(true);
      readyRef.current?.();
    };

    const loads = preloadList.map(
      (p) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = p.image;
          if (img.decode) img.decode().then(() => resolve()).catch(() => resolve());
        }),
    );

    // Never block longer than 2.5s, even on a slow connection.
    const fallback = setTimeout(done, 2500);
    Promise.all(loads).then(() => {
      // One frame of breathing room so layout settles before animating.
      requestAnimationFrame(() => requestAnimationFrame(done));
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, []);

  const rowClass =
    "flex w-max will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]";
  const playState = ready ? "running" : "paused";

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 flex flex-col justify-center gap-6 overflow-hidden bg-background transition-opacity duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div dir="ltr" className="w-full overflow-hidden">
        <div
          className={`${rowClass} marquee-left`}
          style={{ animationPlayState: playState }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6">
          {stripA.map((p, i) => (
            <img
              key={`a-${i}`}
              src={p.image}
              alt=""
              decoding="async"
               className="h-[min(10rem,24svh)] w-[7.5rem] shrink-0 object-contain sm:h-[min(14rem,26svh)] sm:w-[10.5rem]"
            />
          ))}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 text-center">
        <p className="eyebrow">דן ריזינגר · מהדורות</p>
        <h1 className="mt-2 text-3xl sm:text-5xl">הגלריה שלכם נפתחת…</h1>
      </div>

      <div dir="ltr" className="w-full overflow-hidden">
        <div
          className={`${rowClass} marquee-right`}
          style={{ animationPlayState: playState }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-6 pr-6">
          {stripB.map((p, i) => (
            <img
              key={`b-${i}`}
              src={p.image}
              alt=""
              decoding="async"
               className="h-[min(10rem,24svh)] w-[7.5rem] shrink-0 object-contain sm:h-[min(14rem,26svh)] sm:w-[10.5rem]"
            />
          ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
