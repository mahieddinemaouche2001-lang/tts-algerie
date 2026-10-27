"use client";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="vz-shell">
      <SiteHeader />
      <main className="vz-main">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
}) {
  return (
    <section className="vz-section vz-section--tight" style={{ paddingTop: "clamp(40px, 6vw, 76px)" }}>
      <div className="vz-container">
        <span className="vz-eyebrow">{eyebrow}</span>
        <h1 className="vz-h1" style={{ fontSize: "clamp(30px, 4.6vw, 52px)" }}>
          {title}
        </h1>
        <p className="vz-lead">{lead}</p>
      </div>
    </section>
  );
}
