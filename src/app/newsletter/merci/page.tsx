import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: true },
};

const CONTENT: Record<string, { title: string; text: string }> = {
  ok: { title: "Bienvenue !", text: "Votre inscription est confirmée. Le prochain e-mail arrive très vite." },
  confirm: {
    title: "Vérifiez votre boîte mail",
    text: "Nous venons de vous envoyer un e-mail : cliquez sur le lien pour confirmer votre inscription (pensez aux spams).",
  },
  confirme: { title: "Inscription confirmée", text: "Merci ! Vous recevrez la newsletter ATHX PREP chaque semaine." },
  invalid: { title: "Adresse invalide", text: "Cette adresse e-mail ne semble pas valide. Revenez en arrière pour la corriger." },
  consent: { title: "Une case à cocher", text: "Merci de cocher la case d'acceptation pour vous inscrire." },
  unavailable: { title: "Bientôt disponible", text: "L'inscription à la newsletter ouvre très bientôt." },
  error: { title: "Oups", text: "Une erreur est survenue. Réessayez dans quelques instants." },
};

export default function NewsletterThanks({ searchParams }: { searchParams: { statut?: string } }) {
  const content = CONTENT[searchParams.statut ?? "ok"] ?? CONTENT.ok;
  return (
    <main>
      <section className="page-hero last">
        <div className="wrap">
          <div className="kicker">Newsletter ATHX PREP</div>
          <h1 className="h-page">{content.title}</h1>
          <p className="lede">{content.text}</p>
          <div className="hero-ctas">
            <Link href="/semaine-athx-gratuite" className="btn btn-signal">
              Voir la semaine d&apos;entraînement gratuite
            </Link>
            <Link href="/blog" className="btn btn-ghost">
              Lire le blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
