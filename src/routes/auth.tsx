import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search["mode"] === "signup" ? ("signup" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "כניסת משאבי אנוש · דן ריזינגר" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content: "התחברות או פתיחת חשבון חדש לניהול הזמנות מתנה של הדפסי דן ריזינגר.",
      },
      { property: "og:title", content: "כניסת משאבי אנוש · דן ריזינגר" },
      { property: "og:description", content: "ניהול הזמנות מתנה לעובדים." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.session) navigate({ to: "/hr" });
        else {
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInErr) throw signInErr;
          navigate({ to: "/hr" });
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/hr" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "משהו השתבש. נסו שוב.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-lg tracking-wide">
          דן ריזינגר
        </Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          חזרה לעמוד הבית
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="rise-in w-full max-w-sm">
          <p className="eyebrow">הגדרת הזמנה HR</p>
          <h1 className="mt-3 text-4xl">
            {mode === "signup" ? "פתיחת חשבון." : "התחברות."}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mode === "signup"
              ? "פתחו חשבון כדי להקים הזמנה חדשה לחברה שלכם."
              : "התחברו כדי לנהל את ההזמנות הקיימות שלכם."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל ארגוני</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            {notice && <p className="text-xs text-muted-foreground">{notice}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "רגע…" : mode === "signup" ? "יצירת חשבון" : "כניסה"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
              setNotice("");
            }}
            className="mt-5 w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {mode === "signup" ? "כבר יש לי חשבון — להתחברות" : "אין לי חשבון — פתיחת חשבון"}
          </button>
        </div>
      </div>
    </main>
  );
}
