"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  priceLabel: string;
};

export default function Nav({ priceLabel }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

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
          <Link href="/#programme" onClick={close}>
            Le programme
          </Link>
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
          <Link href="/#cta" className="nav-cta" onClick={close}>
            Mon programme — {priceLabel}
          </Link>
        </nav>
      </div>
    </header>
  );
}
