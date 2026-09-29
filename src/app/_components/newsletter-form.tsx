"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  id?: string;
  title?: string;
  text?: string;
  button?: string;
  source?: string;
};

const MESSAGES: Record<string, string> = {
  ok: "C'est noté : vous êtes inscrit·e. À très vite dans votre boîte mail.",
  confirm: "Presque fini : cliquez sur le lien de confirmation que nous venons de vous envoyer par e-mail.",
  invalid: "Cette adresse e-mail ne semble pas valide.",
  consent: "Merci de cocher la case pour accepter de recevoir la newsletter.",
  unavailable: "L'inscription n'est pas encore ouverte. Revenez très bientôt !",
  error: "Une erreur est survenue. Réessayez dans quelques instants.",
};

// Plain HTML form (works without JavaScript), enhanced with an inline confirmation when JS is available.
export default function NewsletterForm({
  id,
  button = "Je m'inscris",
  title = "La prépa ATHX dans votre boîte mail",
  text = "Un e-mail par semaine : séances, conseils de préparation et dates des prochaines compétitions. Pas de spam, désinscription en un clic.",
  source,
}: Props) {
  const [state, setState] = useState<{ result?: string; pending: boolean }>({ pending: false });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ pending: true });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { accept: "application/json" },
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();
      setState({ result: data.result, pending: false });
    } catch {
      setState({ result: "error", pending: false });
    }
  }

  const done = state.result === "ok" || state.result === "confirm";

  return (
    <aside id={id} className="newsletter-block" aria-labelledby={`nl-${id ?? source ?? "form"}`}>
      <div>
        <div className="kicker">Newsletter</div>
        <h2 id={`nl-${id ?? source ?? "form"}`}>{title}</h2>
        <p>{text}</p>
      </div>
      {done ? (
        <p className="nl-message nl-ok" role="status">
          {MESSAGES[state.result as string]}
        </p>
      ) : (
        <form action="/api/newsletter" method="post" onSubmit={onSubmit} className="nl-form">
          <div className="nl-row">
            <label htmlFor={`nl-email-${id ?? source ?? "form"}`} className="sr-only">
              Adresse e-mail
            </label>
            <input
              id={`nl-email-${id ?? source ?? "form"}`}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
            />
            <button type="submit" className="btn btn-signal" disabled={state.pending}>
              {state.pending ? "Envoi…" : button}
            </button>
          </div>
          {/* Honeypot: hidden from people, filled by bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="nl-hp" aria-hidden />
          <input type="hidden" name="source" value={source ?? ""} />
          <label className="nl-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>
              J&apos;accepte de recevoir la newsletter ATHX PREP. Désinscription à tout moment.{" "}
              <Link href="/confidentialite">Politique de confidentialité</Link>
            </span>
          </label>
          {state.result && !done && (
            <p className="nl-message nl-error" role="alert">
              Erreur : {MESSAGES[state.result] ?? MESSAGES.error}
            </p>
          )}
        </form>
      )}
    </aside>
  );
}
