import { prints } from "@/data/prints";

const base = [...prints, ...prints];
const strip = [...base, ...base];

export function PosterStrip() {
  return (
    <div dir="ltr" className="w-full overflow-hidden border-y border-border py-8">
      <div className="flex w-max gap-6 marquee-slow">
        {strip.map((p, i) => (
          <img
            key={`s-${i}`}
            src={p.image}
            alt=""
            aria-hidden
            width={900}
            height={1200}
            loading="lazy"
            className="h-32 w-auto shrink-0 object-cover sm:h-44"
          />
        ))}
      </div>
    </div>
  );
}
