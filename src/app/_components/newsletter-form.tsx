"use client";

import { isEn, PRIVACY_PATH } from "@/lib/i18n";
import Link from "next/link";
import { useState } from "react";

type Props = {
  id?: string;
  title?: string;
  text?: string;
  button?: string;
  source?: string;
};

const COPY = isEn
  ? {
      messages: {
        ok: "Done: you're subscribed. See you soon in your inbox.",
        confirm: "Almost there: click the confirmation link we just emailed you.",
        invalid: "This email address doesn't look valid.",
        consent: "Please tick the box to agree to receive the newsletter.",
        unavailable: "Sign-ups aren't open yet. Check back soon!",
        error: "Something went wrong. Please try again in a moment.",
      } as Record<string, string>,
      button: "Subscribe",
      title: "ATHX prep in your inbox",
      text: "One email a week: sessions, training tips and upcoming competition dates. No spam, unsubscribe in one click.",
      email: "Email address",
      placeholder: "you@example.com",
      sending: "Sending…",
      consent: "I agree to receive the ATHX PREP newsletter. Unsubscribe at any time.",
      privacy: "Privacy policy",
      error: "Error:",
    }
  : {
      messages: {
        ok: "C'est noté : vous êtes inscrit·e. À très vite dans votre boîte mail.",
        confirm: "Presque fini : cliquez sur le lien de confirmation que nous venons de vous envoyer par e-mail.",
        invalid: "Cette adresse e-mail ne semble pas valide.",
        consent: "Merci de cocher la case pour accepter de recevoir la newsletter.",
        unavailable: "L'inscription n'est pas encore ouverte. Revenez très bientôt !",
        error: "Une erreur est survenue. Réessayez dans quelques instants.",
      } as Record<string, string>,
      button: "Je m'inscris",
      title: "La prépa ATHX dans votre boîte mail",
      text: "Un e-mail par semaine : séances, conseils de préparation et dates des prochaines compétitions. Pas de spam, désinscription en un clic.",
      email: "Adresse e-mail",
      placeholder: "vous@exemple.fr",
      sending: "Envoi…",
      consent: "J'accepte de recevoir la newsletter ATHX PREP. Désinscription à tout moment.",
      privacy: "Politique de confidentialité",
      error: "Erreur :",
    };
const MESSAGES = COPY.messages;

// Plain HTML form (works without JavaScript), enhanced with an inline confirmation when JS is available.
export default function NewsletterForm({
  id,
  button = COPY.button,
  title = COPY.title,
  text = COPY.text,
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
              {COPY.email}
            </label>
            <input
              id={`nl-email-${id ?? source ?? "form"}`}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={COPY.placeholder}
            />
            <button type="submit" className="btn btn-signal" disabled={state.pending}>
              {state.pending ? COPY.sending : button}
            </button>
          </div>
          {/* Honeypot: hidden from people, filled by bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="nl-hp" aria-hidden />
          <input type="hidden" name="source" value={source ?? ""} />
          <label className="nl-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>
              {COPY.consent} <Link href={PRIVACY_PATH}>{COPY.privacy}</Link>
            </span>
          </label>
          {state.result && !done && (
            <p className="nl-message nl-error" role="alert">
              {COPY.error} {MESSAGES[state.result] ?? MESSAGES.error}
            </p>
          )}
        </form>
      )}
    </aside>
  );
}
