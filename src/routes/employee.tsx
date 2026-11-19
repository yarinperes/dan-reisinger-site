import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrintLightbox } from "@/components/PrintLightbox";
import { prints, type Print } from "@/data/prints";
import { lookupOrder, submitSelection } from "@/lib/orders.functions";

export const Route = createFileRoute("/employee")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search["code"] === "string" ? (search["code"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "גלריית כרזות · דן ריזינגר" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content: "הזינו את קוד ההתחברות ובחרו את הדפס האמנות שלכם מאת דן ריזינגר.",
      },
      { property: "og:title", content: "גלריית כרזות · דן ריזינגר" },
      {
        property: "og:description",
        content: "עיינו בארכיון ובחרו את ההדפס שתרצו לקבל.",
      },
    ],
  }),
  component: EmployeePage,
});

function EmployeePage() {
  const { code: codeFromLink } = Route.useSearch();
  const [code, setCode] = useState(codeFromLink);
  const [activeCode, setActiveCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [picked, setPicked] = useState<Print[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [quota, setQuota] = useState(1);
  const isPicked = (p: Print) => picked.some((x) => x.id === p.id);
  const togglePick = (p: Print) => {
    if (isPicked(p)) {
      setPicked(picked.filter((x) => x.id !== p.id));
      return;
    }
    if (picked.length >= quota) return;
    const next = [...picked, p];
    setPicked(next);
    setOpenIndex(null);
    if (next.length === quota) setFormOpen(true);
  };

  const tryCode = async (value: string) => {
    const clean = value.trim().toUpperCase();
    if (clean.length < 3) return;
    setBusy(true);
    setError("");
    try {
      const res = await lookupOrder({ data: { code: clean } });
      if (!res.found) {
        setError("קוד ההתחברות אינו מזוהה. בדקו מול משאבי אנוש.");
        return;
      }
      if (res.closed) {
        setError("ההזמנה של החברה נסגרה. פנו למשאבי אנוש.");
        return;
      }
      setCompanyName(res.companyName);
      setQuota(res.printsPerEmployee);
      setActiveCode(clean);
    } catch {
      setError("לא הצלחנו לבדוק את הקוד כרגע. נסו שוב.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (codeFromLink) void tryCode(codeFromLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromLink]);

  if (!activeCode) {
    return (
      <main className="flex min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void tryCode(code);
            }}
            className="rise-in w-full max-w-sm"
          >
            <p className="eyebrow">לבחירת כרזה</p>
            <h1 className="mt-3 text-4xl">ברוכים הבאים.</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              הזינו את קוד ההתחברות שקיבלתם ממשאבי אנוש כדי להיכנס לגלריה.
            </p>
            <div className="mt-8 space-y-2">
              <Label htmlFor="code">קוד התחברות</Label>
              <Input
                id="code"
                value={code}
                autoFocus
                dir="ltr"
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center tracking-[0.2em] uppercase"
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>
              {busy ? "בודק…" : "כניסה לגלריה"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <TopBar />
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <p className="eyebrow">{companyName} · מתנה לעובדים</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">גלריית כרזות</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {prints.length} הדפסים רשמיים. קחו את הזמן — הקישו על כל יצירה כדי לראות אותה בגדול,
          ואז בחרו {quota === 1 ? "את זו שתרצו לקבל" : `${quota} כרזות שתרצו לקבל`}.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-3 gap-x-4 gap-y-8 px-4 pb-24 sm:px-6 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
        {prints.map((p, i) => (
          <button key={p.id} onClick={() => setOpenIndex(i)} className="group text-start">
            <div
              className={`relative overflow-hidden bg-secondary ${isPicked(p) ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
            >
              {isPicked(p) && (
                <span className="absolute top-2 start-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs text-background">
                  {picked.findIndex((x) => x.id === p.id) + 1}
                </span>
              )}
              <img
                src={p.image}
                alt={p.title}
                width={900}
                height={1200}
                loading="lazy"
                className="aspect-[27/40] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h2 className="mt-3 truncate text-sm leading-tight sm:text-lg">{p.title}</h2>
            {p.year && <p className="text-xs text-muted-foreground">{p.year}</p>}
          </button>
        ))}
      </section>

      {openIndex !== null && (
        <PrintLightbox
          prints={prints}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onSelect={togglePick}
          selectLabel={(p) =>
            isPicked(p)
              ? "הסרה מהבחירה"
              : picked.length >= quota
                ? `כבר בחרתם ${quota} כרזות`
                : quota === 1
                  ? "בחירת ההדפס הזה"
                  : `בחירה (${picked.length + 1} מתוך ${quota})`
          }
        />
      )}

      {picked.length > 0 && !formOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <p className="text-sm">
              נבחרו {picked.length} מתוך {quota} כרזות
            </p>
            <Button disabled={picked.length !== quota} onClick={() => setFormOpen(true)}>
              {picked.length === quota ? "המשך לאישור" : `בחרו עוד ${quota - picked.length}`}
            </Button>
          </div>
        </div>
      )}

      {formOpen && picked.length === quota && (
        <SelectionDialog
          prints={picked}
          code={activeCode}
          onClose={() => setFormOpen(false)}
        />
      )}
    </main>
  );
}

function TopBar() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="font-display text-lg tracking-wide">
        דן ריזינגר
      </Link>
      <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
        יציאה
      </Link>
    </header>
  );
}

function SelectionDialog({
  prints: chosen,
  code,
  onClose,
}: {
  prints: Print[];
  code: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate({ to: "/" }), 3500);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await submitSelection({
        data: {
          code,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          prints: chosen.map((p) => ({ id: p.id, title: p.title })),
        },
      });
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("order_closed")
          ? "ההזמנה נסגרה בינתיים."
          : "לא הצלחנו לשמור את הבחירה. נסו שוב.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm">
      <div className="rise-in w-full max-w-md border border-border bg-card p-7 shadow-2xl">
        {done ? (
          <div className="py-6 text-center">
            <h2 className="text-3xl">תיהנו!</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              הבחירה שלכם נקלטה והועברה להזמנה של החברה.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">חוזרים לעמוד הבית…</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="eyebrow">הבחירה שלכם</p>
            {chosen.length === 1 ? (
              <h2 className="mt-2 text-2xl">{chosen[0]?.title}</h2>
            ) : (
              <ul className="mt-2 space-y-1">
                {chosen.map((p, i) => (
                  <li key={p.id} className="text-lg">
                    {i + 1}. {p.title}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                id="first-name"
                label="שם פרטי"
                value={form.firstName}
                onChange={(v) => setForm({ ...form, firstName: v })}
              />
              <Field
                id="last-name"
                label="שם משפחה"
                value={form.lastName}
                onChange={(v) => setForm({ ...form, lastName: v })}
              />
              <Field
                id="phone"
                label="טלפון"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <Field
                id="email"
                label="אימייל"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
            </div>
            {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
            <div className="mt-7 flex gap-3">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                חזרה לגלריה
              </Button>
              <Button type="submit" className="flex-1" disabled={busy}>
                {busy ? "שולח…" : "אישור"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required
        dir={type === "text" ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
