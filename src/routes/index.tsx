import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Splash } from "@/components/Splash";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/dan-portrait-square.jpg.asset.json";
import { PosterStrip } from "@/components/PosterStrip";
import { InSituGallery } from "@/components/InSituGallery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "דן ריזינגר · מתנות אמנות לעובדים" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content:
          "הדפסי אמנות רשמיים של המעצב דן ריזינגר כמתנה ארגונית. כל עובד בוחר את ההדפס שלו, ומשאבי אנוש עוקבים אחרי כל הבחירות.",
      },
      { property: "og:title", content: "דן ריזינגר · מתנות אמנות לעובדים" },
      {
        property: "og:description",
        content: "תוכנית מתנות אמנות אוצרותית לחברות ולאנשים שלהן.",
      },
    ],
  }),
  component: Index,
});


function Ctas() {
  return (
    <>
      <Button asChild size="lg" className="sm:min-w-52">
        <Link to="/employee" search={{ code: "" }}>
          לבחירת כרזה
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="sm:min-w-52">
        <Link to="/hr">הגדרת הזמנה HR</Link>
      </Button>
    </>
  );
}

function Index() {
  const [splash, setSplash] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setSplash(false), 2400);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <Splash visible={splash} onReady={() => setReady(true)} />



      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-display text-lg tracking-wide">דן ריזינגר</span>
          <span className="eyebrow hidden sm:block">מהדורות לארגונים</span>
        </header>

        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-6 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-16">
          <div className="rise-in">
            <p className="eyebrow">מתנות אמנות לארגונים</p>
            <h1 className="mt-4 text-[2.75rem] leading-[1.15] sm:text-6xl">
              תנו יצירת אמנות,
              <br />
              לא עוד מארז מתנה.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              דן ריזינגר עיצב את השפה החזותית של מדינה שלמה — כרזות, סמלים וצבע שנשארו
              עכשוויים גם חצי מאה אחר כך. התוכנית הזו מאפשרת לכל עובדת ועובד לבחור הדפס
              רשמי מתוך הארכיון ולתלות בבית פיסה מהמורשת הזו.
            </p>
            <div className="mt-10 hidden flex-col gap-3 lg:flex lg:flex-row">
              <Ctas />
            </div>
          </div>

          <div className="rise-in" style={{ animationDelay: "120ms" }}>
            <figure>
              <img
                src={portrait.url}
                alt="דן ריזינגר, דיוקן"
                width={1000}
                height={1000}
                className="w-full object-cover shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)]"
              />
              <figcaption className="mt-3 text-xs text-muted-foreground">
                דן ריזינגר (1934–2019) · מעצב, אמן וחתן פרס ישראל לעיצוב
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:hidden">
            <Ctas />
          </div>

        </section>


        <section>
          <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-10 pb-16 sm:grid-cols-3">
            {[
              ["01", "משאבי אנוש מגדירים", "פרטי החברה, מספר העובדים וכמות ההדפסים לעובד."],
              ["02", "העובדים בוחרים", "גלריה פרטית, קוד חברה אחד, הדפס אחד אהוב."],
              ["03", "הזמנה אחת לגלריה", "כל הבחירות מתאחדות להזמנה אחת שניתן לסגור."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <p className="eyebrow">{n}</p>
                <h3 className="mt-3 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <PosterStrip />

        <InSituGallery />

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-muted-foreground">
            דן ריזינגר · מהדורות · הדפסי ארכיון המיוצרים ברישיון · נתוני הדגמה
          </div>
        </footer>
      </main>
    </>
  );
}
