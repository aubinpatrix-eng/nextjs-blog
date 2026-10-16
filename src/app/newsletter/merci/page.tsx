import { isEn } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: true },
};

type Content = Record<string, { title: string; text: string }>;

const COPY = isEn
  ? {
      content: {
        ok: { title: "Welcome!", text: "You're subscribed. Download your free training week below." },
        confirm: {
          title: "Check your inbox",
          text: "We've just sent you an email: click the link to confirm your subscription (check your spam folder too).",
        },
        confirme: {
          title: "Subscription confirmed",
          text: "Thank you! Your free training week is ready: download it below. You'll then receive the ATHX PREP newsletter every week.",
        },
        invalid: { title: "Invalid address", text: "This email address doesn't look valid. Go back to correct it." },
        consent: { title: "One box to tick", text: "Please tick the consent box to subscribe." },
        unavailable: { title: "Coming soon", text: "Newsletter sign-ups open very soon." },
        error: { title: "Oops", text: "Something went wrong. Please try again in a moment." },
      } as Content,
      pdf: "/downloads/free-athx-training-week-athx-prep.pdf",
      download: "Download the free week (PDF)",
      seeWeek: "See the free training week",
      blog: "Read the blog",
    }
  : {
      content: {
        ok: {
          title: "Bienvenue !",
          text: "Votre inscription est confirmée. Téléchargez votre semaine d'entraînement gratuite ci-dessous.",
        },
        confirm: {
          title: "Vérifiez votre boîte mail",
          text: "Nous venons de vous envoyer un e-mail : cliquez sur le lien pour confirmer votre inscription (pensez aux spams).",
        },
        confirme: {
          title: "Inscription confirmée",
          text: "Merci ! Votre semaine d'entraînement gratuite est prête : téléchargez-la ci-dessous. Vous recevrez ensuite la newsletter ATHX PREP chaque semaine.",
        },
        invalid: { title: "Adresse invalide", text: "Cette adresse e-mail ne semble pas valide. Revenez en arrière pour la corriger." },
        consent: { title: "Une case à cocher", text: "Merci de cocher la case d'acceptation pour vous inscrire." },
        unavailable: { title: "Bientôt disponible", text: "L'inscription à la newsletter ouvre très bientôt." },
        error: { title: "Oups", text: "Une erreur est survenue. Réessayez dans quelques instants." },
      } as Content,
      pdf: "/downloads/semaine-athx-gratuite-athx-prep.pdf",
      download: "Télécharger la semaine gratuite (PDF)",
      seeWeek: "Voir la semaine d'entraînement gratuite",
      blog: "Lire le blog",
    };

// The free week PDF is the reward for a confirmed subscription.
export default function NewsletterThanks({ searchParams }: { searchParams: { statut?: string } }) {
  const statut = searchParams.statut ?? "ok";
  const content = COPY.content[statut] ?? COPY.content.ok;
  const subscribed = statut === "ok" || statut === "confirme";
  return (
    <main>
      <section className="page-hero last">
        <div className="wrap">
          <div className="kicker">Newsletter ATHX PREP</div>
          <h1 className="h-page">{content.title}</h1>
          <p className="lede">{content.text}</p>
          <div className="hero-ctas">
            {subscribed ? (
              <a href={COPY.pdf} download className="btn btn-signal">
                {COPY.download}
              </a>
            ) : (
              <>
                <Link href={localPath("/semaine-athx-gratuite")} className="btn btn-signal">
                  {COPY.seeWeek}
                </Link>
                <Link href="/blog" className="btn btn-ghost">
                  {COPY.blog}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
