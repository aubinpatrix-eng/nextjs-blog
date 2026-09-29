"use client";

import { CONSENT_KEY } from "@/lib/consent";
import Link from "next/link";
import { useEffect, useState } from "react";

// Google Analytics runs in consent mode, denied by default (CNIL): this banner records the visitor's choice.
const OPEN_EVENT = "athx-consent-open";

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Private browsing: the choice only lasts for this page.
  }
  const w = window as unknown as { dataLayer?: unknown[] };
  const dataLayer = (w.dataLayer = w.dataLayer || []);
  // gtag.js reads the arguments object, not an array: same as the gtag() helper in the layout.
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  }
  gtag("consent", "update", { analytics_storage: choice });
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readChoice()) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  if (!open) return null;

  const choose = (choice: Choice) => {
    saveChoice(choice);
    setOpen(false);
  };

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookies de mesure d'audience">
      <p>
        Nous aimerions mesurer l&apos;audience du site avec Google Analytics (statistiques anonymes, pas de publicité).{" "}
        <Link href="/confidentialite">En savoir plus</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn btn-ghost" onClick={() => choose("denied")}>
          Refuser
        </button>
        <button type="button" className="btn btn-signal" onClick={() => choose("granted")}>
          Accepter
        </button>
      </div>
    </div>
  );
}

export function ConsentSettingsButton() {
  return (
    <button type="button" className="foot-link-btn" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Gérer les cookies
    </button>
  );
}
