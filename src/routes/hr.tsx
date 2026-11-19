import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Copy, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { prints } from "@/data/prints";
import {
  createOrder,
  getOrder,
  listOrders,
  setOrderClosed,
} from "@/lib/orders.functions";

type OrderRow = Awaited<ReturnType<typeof listOrders>>[number];
type OrderDetail = Awaited<ReturnType<typeof getOrder>>;

export const Route = createFileRoute("/hr")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "לוח בקרה למשאבי אנוש · דן ריזינגר" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content:
          "הקימו הזמנת מתנות לחברה, שתפו קוד התחברות עם העובדים ועקבו אחרי הבחירות בזמן אמת.",
      },
      { property: "og:title", content: "לוח בקרה למשאבי אנוש · דן ריזינגר" },
      {
        property: "og:description",
        content: "מעקב אחרי השתתפות, בחירות וההזמנה הסופית לגלריה.",
      },
    ],
  }),
  component: HrPage,
});

function HrPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [wizard, setWizard] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!signedIn) return;
    try {
      setOrders(await listOrders());
    } catch {
      setOrders([]);
    }
  }, [signedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (!ready) return <main className="min-h-screen" />;

  if (!signedIn) return <EntryGate />;

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg tracking-wide">
          דן ריזינגר
        </Link>
        <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">
          יציאה
        </button>
      </header>

      {openId ? (
        <OrderView id={openId} onBack={() => { setOpenId(null); void refresh(); }} />
      ) : (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">הגדרת הזמנה HR</p>
              <h1 className="mt-2 text-4xl sm:text-5xl">ההזמנות שלי</h1>
            </div>
            <Button size="lg" onClick={() => setWizard(true)}>
              <Plus /> הזמנה חדשה
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setOpenId(o.id)}
                className="border border-border bg-card p-6 text-start transition-colors hover:border-foreground/40"
              >
                <p className="eyebrow">{o.closed ? "הזמנה סגורה" : "פעילה"}</p>
                <h2 className="mt-2 text-2xl">{o.companyName}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {o.selectionCount} מתוך {o.employeeCount} עובדים בחרו
                </p>
                <Progress
                  value={o.employeeCount ? (o.selectionCount / o.employeeCount) * 100 : 0}
                  className="mt-3 h-1.5"
                />
                <p className="mt-4 text-xs text-muted-foreground">
                  קוד התחברות: <span dir="ltr">{o.accessCode}</span>
                </p>
              </button>
            ))}
            {orders.length === 0 && (
              <div className="border border-dashed border-border p-10 text-sm text-muted-foreground sm:col-span-2">
                עדיין אין הזמנות. פתחו הזמנה חדשה, הזינו את מספר העובדים וקבלו קוד התחברות לשיתוף.
              </div>
            )}
          </div>
        </section>
      )}

      {wizard && (
        <NewOrderDialog
          onClose={() => setWizard(false)}
          onCreated={async (id) => {
            setWizard(false);
            await refresh();
            setOpenId(id);
          }}
        />
      )}
    </main>
  );
}

function EntryGate() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg tracking-wide">
          דן ריזינגר
        </Link>
      </header>
      <Dialog open onOpenChange={(open) => { if (!open) navigate({ to: "/" }); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">הגדרת הזמנה HR</DialogTitle>
            <DialogDescription>
              הקימו הזמנת מתנות חדשה לחברה שלכם, או התחברו לחשבון קיים.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid gap-3">
            <Button size="lg" onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}>
              צור הזמנה חדשה
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: "/auth", search: { mode: "login" } })}
            >
              התחברות
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function suggestCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

const GALLERY_CONTACT = {
  email: "ilan.reisinger@gmail.com",
  phone: "054-574-1983",
};

const PRICE_TIERS = [
  { min: 101, price: 85, label: "החל מ‑100 כרזות" },
  { min: 51, price: 95, label: "עד 100 כרזות" },
  { min: 21, price: 115, label: "עד 50 כרזות" },
  { min: 0, price: 140, label: "עד 20 כרזות" },
] as const;

function tierFor(quantity: number) {
  return PRICE_TIERS.find((t) => quantity >= t.min) ?? null;
}

const ils = (n: number) => `₪${n.toLocaleString("he-IL")}`;

function PricingPanel({ quantity }: { quantity: number }) {
  const tier = quantity > 0 ? tierFor(quantity) : null;
  return (
    <div className="rounded-md border border-border/70 bg-muted/40 p-4 sm:col-span-2">
      <p className="text-sm font-medium">מחירון</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {[...PRICE_TIERS].reverse().map((t) => (
          <li
            key={t.min}
            className={`flex items-center justify-between ${
              tier?.min === t.min
                ? "font-medium text-foreground"
                : "text-muted-foreground/50"
            }`}
          >
            <span>{t.label}</span>
            <span>{ils(t.price)} ליחידה</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-border/70 pt-3 text-sm">
        {quantity > 0 && tier ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {quantity} כרזות × {ils(tier.price)}
            </span>
            <span className="font-display text-xl">{ils(quantity * tier.price)}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            עדכנו מספר עובדים והדפסים לעובד לחישוב עלות.
          </p>
        )}
      </div>
    </div>
  );
}

function NewOrderDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void | Promise<void>;
}) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    employeeCount: "50",
    printsPerEmployee: "1",
    accessCode: suggestCode(),
    deadline: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await createOrder({
        data: {
          companyName: form.companyName.trim(),
          contactName: form.contactName.trim(),
          contactEmail: form.contactEmail.trim(),
          employeeCount: Number(form.employeeCount) || 0,
          printsPerEmployee: Number(form.printsPerEmployee) || 1,
          accessCode: form.accessCode.trim().toUpperCase(),
          deadline: form.deadline || null,
        },
      });
      await onCreated(res.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.includes("code_taken")
          ? "הקוד הזה כבר תפוס. בחרו קוד אחר."
          : "לא הצלחנו ליצור את ההזמנה. בדקו את הפרטים ונסו שוב.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto overscroll-contain sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">הזמנה חדשה</DialogTitle>
          <DialogDescription>
            כמה פרטים על החברה, מספר העובדים וקוד ההתחברות שתשתפו איתם.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-2 grid gap-4 sm:grid-cols-2">
          <Field
            id="company"
            label="שם החברה"
            value={form.companyName}
            onChange={(v) => setForm({ ...form, companyName: v })}
          />
          <Field
            id="contact"
            label="איש קשר"
            value={form.contactName}
            onChange={(v) => setForm({ ...form, contactName: v })}
          />
          <Field
            id="contact-email"
            label="אימייל ליצירת קשר"
            type="email"
            ltr
            value={form.contactEmail}
            onChange={(v) => setForm({ ...form, contactEmail: v })}
          />
          <Field
            id="employees"
            label="מספר עובדים"
            type="number"
            ltr
            value={form.employeeCount}
            onChange={(v) => setForm({ ...form, employeeCount: v })}
          />
          <Field
            id="per-employee"
            label="הדפסים לעובד"
            type="number"
            ltr
            value={form.printsPerEmployee}
            onChange={(v) => setForm({ ...form, printsPerEmployee: v })}
          />
          <Field
            id="code"
            label="קוד התחברות לעובדים"
            ltr
            value={form.accessCode}
            onChange={(v) => setForm({ ...form, accessCode: v.toUpperCase() })}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="deadline">תאריך אחרון לבחירת העובדים (אופציונלי)</Label>
            <Input
              id="deadline"
              type="date"
              dir="ltr"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              אחרי התאריך הזה העובדים לא יוכלו עוד להזין בחירה.
            </p>
          </div>
          <PricingPanel
            quantity={
              (Number(form.employeeCount) || 0) * (Number(form.printsPerEmployee) || 0)
            }
          />
          {error && <p className="text-xs text-destructive sm:col-span-2">{error}</p>}
          <div className="mt-2 flex gap-3 sm:col-span-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? "יוצר…" : "יצירת הזמנה"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OrderView({ id, onBack }: { id: string; onBack: () => void }) {
  const [data, setData] = useState<OrderDetail | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const load = useCallback(async () => {
    setData(await getOrder({ data: { id } }));
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const titleFor = (printId: string) =>
    prints.find((p) => p.id === printId)?.title ?? "לא ידוע";

  const tally = useMemo(() => {
    const map = new Map<string, number>();
    (data?.selections ?? []).forEach((s) => map.set(s.printId, (map.get(s.printId) ?? 0) + 1));
    return [...map.entries()]
      .map(([printId, qty]) => ({ printId, qty, title: titleFor(printId) }))
      .sort((a, b) => b.qty - a.qty);
  }, [data]);

  if (!data) return <div className="mx-auto max-w-6xl px-6 py-10 text-muted-foreground">טוען…</div>;

  const { order, selections } = data;
  const pct = order.employeeCount
    ? Math.min(100, (selections.length / order.employeeCount) * 100)
    : 0;
  const shareLink =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/employee?code=${order.accessCode}`;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" /> כל ההזמנות
      </button>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{order.companyName}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">לוח בקרת המתנות</h1>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <Copy /> {copied ? "הועתק" : "העתקת קישור לעובדים"}
        </Button>
      </div>

      <div className="mt-8 border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl">
            {selections.length} מתוך {order.employeeCount} עובדים כבר בחרו
          </h2>
          <span className="text-sm text-muted-foreground">{Math.round(pct)}%</span>
        </div>
        <Progress value={pct} className="mt-4 h-2" />
        <p className="mt-3 text-xs text-muted-foreground">
          {order.printsPerEmployee} הדפסים לעובד · קוד התחברות{" "}
          <span dir="ltr">{order.accessCode}</span>
          {order.deadline
            ? ` · תאריך אחרון לבחירה: ${new Date(order.deadline).toLocaleDateString("he-IL")}`
            : ""}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="text-2xl">הבחירות</h2>
          <div className="mt-4 border border-border bg-card">
            <div className="max-h-[26rem] overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {selections.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {s.firstName} {s.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground" dir="ltr">
                          {s.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        {titleFor(s.printId)}
                      </td>
                    </tr>
                  ))}
                  {selections.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-muted-foreground">עדיין אין בחירות.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl">סיכום ההזמנה</h2>
          <div className="mt-4 border border-border bg-card p-5">
            <ul className="space-y-3">
              {tally.map((t) => (
                <li key={t.printId} className="flex items-baseline justify-between gap-4">
                  <span>{t.title}</span>
                  <span className="text-muted-foreground">כמות: {t.qty}</span>
                </li>
              ))}
              {tally.length === 0 && (
                <li className="text-sm text-muted-foreground">אין עדיין מה להזמין.</li>
              )}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4 text-sm">
              <span className="eyebrow">סה״כ הדפסים</span>
              <span>{selections.length}</span>
            </div>
          </div>

          {order.closed ? (
            <div className="mt-6 border border-border bg-secondary p-5 text-sm leading-relaxed">
              <p className="eyebrow">ההזמנה נסגרה</p>
              <p className="mt-3">
                סיכום סופי עבור {order.companyName}: {selections.length} הדפסים מתוך{" "}
                {tally.length} מהדורות. נשלח לגלריה, לידי {order.contactName} (
                <span dir="ltr">{order.contactEmail}</span>).
              </p>
              <Button
                variant="ghost"
                className="mt-4 w-full"
                onClick={async () => {
                  await setOrderClosed({ data: { id: order.id, closed: false } });
                  await load();
                }}
              >
                פתיחה מחדש
              </Button>
            </div>
          ) : (
            <Button size="lg" className="mt-6 w-full" onClick={() => setConfirmClose(true)}>
              סגירת ההזמנה
            </Button>
          )}
        </section>
      </div>

      <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">סגירת ההזמנה</DialogTitle>
            <DialogDescription>
              לאחר הסגירה העובדים לא יוכלו עוד לבחור. הסיכום נשלח לגלריה — לכל שאלה או שינוי
              אפשר ליצור קשר ישירות:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-2 border border-border bg-secondary p-4 text-sm">
            <p>
              דוא״ל:{" "}
              <a className="underline" dir="ltr" href={`mailto:${GALLERY_CONTACT.email}`}>
                {GALLERY_CONTACT.email}
              </a>
            </p>
            <p>
              טלפון:{" "}
              <a className="underline" dir="ltr" href={`tel:${GALLERY_CONTACT.phone}`}>
                {GALLERY_CONTACT.phone}
              </a>
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setConfirmClose(false)}>
              ביטול
            </Button>
            <Button
              className="flex-1"
              onClick={async () => {
                await setOrderClosed({ data: { id: order.id, closed: true } });
                setConfirmClose(false);
                await load();
              }}
            >
              סגירה סופית
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  ltr = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  ltr?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required
        dir={ltr ? "ltr" : "rtl"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
