"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavEvent = {
  slug: string;
  city: string;
  dates: string;
};

type Props = {
  priceLabel: string;
  events: NavEvent[];
};

export default function Nav({ priceLabel, events }: Props) {
  const [open, setOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const close = () => {
    setOpen(false);
    setEventsOpen(false);
  };
  const onEventPage = events.some((event) => pathname === `/${event.slug}`);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!eventsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdown.current?.contains(e.target as Node)) setEventsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEventsOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [eventsOpen]);

  return (
    <header className="site-nav">
      <div className="wrap nav-row">
        <Link href="/" className="brand" onClick={close}>
          ATH<em>X</em> PREP
        </Link>
        <button
          className="burger"
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          <Link href="/#format" onClick={close}>
            Le format
          </Link>
          {events.length > 0 && (
            <div className={`nav-dropdown${eventsOpen ? " open" : ""}`} ref={dropdown}>
              <button
                type="button"
                className={`nav-dropdown-toggle${onEventPage ? " active" : ""}`}
                aria-expanded={eventsOpen}
                aria-controls="navEvents"
                onClick={() => setEventsOpen(!eventsOpen)}
              >
                Compétitions <span aria-hidden>▾</span>
              </button>
              <div className="nav-dropdown-menu" id="navEvents">
                <div className="nav-dropdown-title">Prochains ATHX en France</div>
                {events.map((event) => (
                  <Link
                    key={event.slug}
                    href={`/${event.slug}`}
                    onClick={close}
                    className={pathname === `/${event.slug}` ? "active" : undefined}
                  >
                    <strong>ATHX {event.city}</strong>
                    <span>{event.dates}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Link
            href="/calculateur-1rm"
            onClick={close}
            className={pathname === "/calculateur-1rm" ? "active" : undefined}
          >
            Calculateur 1RM
          </Link>
          <Link
            href="/blog"
            onClick={close}
            className={pathname.startsWith("/blog") ? "active" : undefined}
          >
            Blog
          </Link>
          <Link
            href="/qui-suis-je"
            onClick={close}
            className={pathname === "/qui-suis-je" ? "active" : undefined}
          >
            Qui suis-je
          </Link>
          <Link href="/#cta" className="nav-cta" onClick={close}>
            Mon programme — {priceLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
