"use client";

import { useEffect, useState } from "react";
import { createPublicSupabaseClient } from "../../lib/supabase";

type Stats = {
  profiles: number;
  generations: number;
  trialsUsed: number;
  activeReservations: number;
  geminiEnabled: boolean;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  useEffect(() => {
    const supabase = createPublicSupabaseClient();
    void supabase.auth.getSession().then(({ data }) => {
      setConnected(Boolean(data.session));
      if (data.session) void loadStats(data.session.access_token);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnected(Boolean(session));
      if (!session) setStats(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!siteKey || connected) return;
    // hCaptcha invisible mode: on a protected Preview, a manual login may require CAPTCHA.
    // This form leaves the token empty if no verification widget is configured.
    let widget: number | null = null;
    const render = () => {
      const host = document.getElementById("admin-captcha");
      const captcha = (window as unknown as { hcaptcha?: { render: (host: HTMLElement, settings: Record<string, unknown>) => number; remove: (id: number) => void } }).hcaptcha;
      if (host && captcha && widget === null) widget = captcha.render(host, { sitekey: siteKey, callback: (token: string) => setCaptchaToken(token), "expired-callback": () => setCaptchaToken("") });
    };
    const scriptId = "admin-hcaptcha-script";
    if ((window as unknown as { hcaptcha?: unknown }).hcaptcha) render();
    else {
      const previous = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (previous) previous.addEventListener("load", render);
      else {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
        script.async = true;
        script.addEventListener("load", render);
        document.head.appendChild(script);
      }
    }
    return () => { if (widget !== null) { const api = (window as unknown as { hcaptcha?: { remove: (id: number) => void } }).hcaptcha; api?.remove(widget); } };
  }, [connected, siteKey]);

  async function loadStats(token: string) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (response.ok) {
        setStats((await response.json()) as Stats);
        setMessage("");
      } else {
        setStats(null);
        setMessage(response.status === 403 ? "Accès refusé : ce compte n'est pas administrateur." : response.status === 503 ? "Configuration Admin ou statistiques indisponibles." : "Accès non autorisé.");
      }
    } catch { setMessage("Connexion au serveur impossible."); }
    finally { setLoading(false); }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage("");
    try {
      const supabase = createPublicSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password, options: captchaToken ? { captchaToken } : undefined });
      if (error || !data.session) { setMessage(error?.message ?? "Échec de connexion."); return; }
      setConnected(true);
      await loadStats(data.session.access_token);
    } catch { setMessage("Connexion impossible."); }
    finally { setLoading(false); }
  }

  async function logout() {
    await createPublicSupabaseClient().auth.signOut();
    setStats(null); setConnected(false); setMessage("");
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px", border: "1px solid #a0a0a0", borderRadius: 8, background: "white", color: "#111" };
  const buttonStyle: React.CSSProperties = { padding: "12px 20px", background: "#1b5df5", borderRadius: 8, color: "white", cursor: "pointer", border: "none" };

  return <main dir="ltr" style={{ maxWidth: 960, margin: "40px auto", padding: 20, fontFamily: "Arial, sans-serif", color: "#1d2939" }}>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <h1 style={{ margin: 0 }}>VOIX DZ — Administration</h1>
      <a href="/">Retour au site</a>
    </header>
    <p>Accès réservé aux administrateurs autorisés. Les vérifications sont effectuées par le serveur.</p>
    {!connected && <form onSubmit={login} style={{ display: "grid", gap: 14, maxWidth: 420, marginTop: 24 }}>
      <label>Adresse e-mail<input style={inputStyle} type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" /></label>
      <label>Mot de passe<input style={inputStyle} type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>
      {siteKey && <div id="admin-captcha" style={{ minHeight: 80 }} />}
      <button style={buttonStyle} disabled={loading} type="submit">{loading ? "Connexion…" : "Connexion administrateur"}</button>
    </form>}
    {connected && <div style={{ display: "flex", gap: 12, margin: "20px 0" }}>
      <button style={buttonStyle} disabled={loading} onClick={async () => { const { data } = await createPublicSupabaseClient().auth.getSession(); if (data.session) await loadStats(data.session.access_token); }}>Actualiser</button>
      <button style={{ ...buttonStyle, background: "#475467" }} onClick={logout}>Déconnexion</button>
    </div>}
    {message && <p role="alert" style={{ color: "#b42318" }}>{message}</p>}
    {stats && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginTop: 20 }}>
      {[ ["Profils", stats.profiles], ["Générations", stats.generations], ["Essais consommés", stats.trialsUsed], ["Réservations actives", stats.activeReservations] ].map(([label, val]) => <article key={label} style={{ padding: 22, border: "1px solid #ddd", borderRadius: 12, background: "#fff" }}><p>{label}</p><strong style={{ fontSize: 32 }}>{val}</strong></article>)}
      <article style={{ padding: 22, border: "1px solid #ddd", borderRadius: 12, background: "#fff" }}><p>Gemini TTS</p><strong>Désactivé</strong></article>
    </div>}
  </main>;
}
