import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import g1 from "@/assets/gallery/img_20260814_112454.jpg.asset.json";
import g2 from "@/assets/gallery/reisinger_gallery_1.jpg.asset.json";
import g3 from "@/assets/gallery/reisinger_gallery_2.png.asset.json";
import g4 from "@/assets/gallery/reisinger_gallery_4.jpg.asset.json";
import g5 from "@/assets/gallery/reisinger_gallery_5_1.png.asset.json";
import g6 from "@/assets/gallery/reisinger_gallery_6.png.asset.json";

const shots = [
  { src: g4.url, caption: "דוגמה: ״אני צועד לבריאותי״ ממוסגר על שידה בסלון." },
  { src: g5.url, caption: "דוגמה: ״To Israel · M.V. Bilu״ נשען על מדף ספרים." },
  { src: g3.url, caption: "דוגמה: קיר גלריה עם ארבעה הדפסים חתומים." },
  { src: g2.url, caption: "דוגמה: הדפסים בסטודיו — סברה, נופש ו־Bilu." },
  { src: g6.url, caption: "דוגמה: פינת עבודה ביתית עם הדפס בפורמט קטן." },
  { src: g1.url, caption: "דוגמה: מהדורות מודפסות כפי שהן מגיעות אליכם." },
];

export function InSituGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = window.innerWidth < 640 ? 280 : 360;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex items-start justify-between gap-4">
          <div className="text-right">
            <p className="eyebrow">דוגמאות</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">איך זה נראה בבית ובמשרד</h2>
          </div>
          <div className="mt-10 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="גלול ימינה"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="גלול שמאלה"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          התמונות הבאות הן דוגמאות בלבד — הן ממחישות איך ההדפסים של דן ריזינגר משתלבים
          בחללים אמיתיים אצל אנשים: על קיר, על מדף או ממוסגרים בפינת עבודה.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="mt-8 overflow-x-auto pb-16"
      >
        <div className="mx-auto flex w-max gap-5 px-6">
          {shots.map((s, i) => (
            <figure key={i} className="w-[260px] shrink-0 sm:w-[340px]">
              <div className="overflow-hidden bg-secondary">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-right text-xs leading-relaxed text-muted-foreground">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
