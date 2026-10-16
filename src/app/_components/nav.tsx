"use client";

import { href, isEn, publicPath } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavItem = { href: string; label: string; hint?: string };
export type NavMenu = { id: string; label: string; title: string; items: NavItem[] };

type Props = {
  priceLabel: string;
  menus: NavMenu[];
  freeWeekHref: string;
  // Page path on this site => same page on the other-language site, for the language switch.
  switchMap: Record<string, string>;
  switchHome: string;
};

const COPY = isEn
  ? { home: "ATHX PREP — home", menu: "Menu", freeWeek: "Free week", about: "About", program: "My program", switchLabel: "FR", switchTitle: "Version française" }
  : { home: "ATHX PREP — accueil", menu: "Menu", freeWeek: "Semaine gratuite", about: "Qui suis-je", program: "Mon programme", switchLabel: "EN", switchTitle: "English version" };

function Dropdown({ menu, open, onToggle, onNavigate }: { menu: NavMenu; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const pathname = publicPath(usePathname());
  const active = menu.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return (
    <div className={`nav-dropdown${open ? " open" : ""}`} data-menu={menu.id}>
      <button
        type="button"
        className={`nav-dropdown-toggle${active ? " active" : ""}`}
        aria-expanded={open}
        aria-controls={`nav-${menu.id}`}
        onClick={onToggle}
      >
        {menu.label} <span aria-hidden>▾</span>
      </button>
      <div className="nav-dropdown-menu" id={`nav-${menu.id}`}>
        <div className="nav-dropdown-title">{menu.title}</div>
        {menu.items.map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate} className={pathname === item.href ? "active" : undefined}>
            <strong>{item.label}</strong>
            {item.hint && <span>{item.hint}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Nav({ priceLabel, menus, freeWeekHref, switchMap, switchHome }: Props) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const pathname = publicPath(usePathname());
  const switchHref = switchMap[pathname] ?? switchHome;
  const close = () => {
    setOpen(false);
    setOpenMenu(null);
  };

  // Close dropdowns on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.(".nav-dropdown")) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <header className="site-nav">
      <div className="wrap nav-row">
        <Link href="/" className="brand" onClick={close} aria-label={COPY.home}>
          <span className="brand-mark">ATH<em>X</em></span>
          <span className="brand-rule" aria-hidden />
          <span className="brand-word">PREP</span>
        </Link>
        <button className="burger" aria-expanded={open} aria-controls="navLinks" onClick={() => setOpen(!open)}>
          {COPY.menu}
        </button>
        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks" ref={nav}>
          {menus
            .filter((menu) => menu.items.length > 0)
            .map((menu) => (
              <Dropdown
                key={menu.id}
                menu={menu}
                open={openMenu === menu.id}
                onToggle={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
                onNavigate={close}
              />
            ))}
          <Link href={freeWeekHref} onClick={close} className={`nav-free${pathname === freeWeekHref ? " active" : ""}`}>
            {COPY.freeWeek} <span className="nav-badge">PDF</span>
          </Link>
          <Link href="/blog" onClick={close} className={pathname.startsWith("/blog") ? "active" : undefined}>
            Blog
          </Link>
          <Link href={href("/qui-suis-je")} onClick={close} className={pathname === href("/qui-suis-je") ? "active" : undefined}>
            {COPY.about}
          </Link>
          <a href={switchHref} className="nav-lang" hrefLang={isEn ? "fr" : "en"} title={COPY.switchTitle} onClick={close}>
            {COPY.switchLabel}
          </a>
          <Link href="/#cta" className="nav-cta" onClick={close}>
            {COPY.program} — {priceLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
