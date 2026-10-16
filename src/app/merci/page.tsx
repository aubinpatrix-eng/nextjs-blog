import { isEn } from "@/lib/i18n";
import { Metadata } from "next";
import Link from "next/link";

// Use this page as the Stripe Payment Link confirmation URL: https://preparation-athx.fr/merci
// (https://en.preparation-athx.fr/thank-you on the English site).
export const metadata: Metadata = {
  title: isEn ? "Thank you for your purchase" : "Merci pour votre achat",
  robots: { index: false, follow: true },
};

const COPY = isEn
  ? {
      kicker: "Payment confirmed",
      title: "Thank you, let's go.",
      lede: "Your program, built on your PRs, will arrive by email at the address you gave at checkout. The program is written in French. Remember to check your spam folder.",
      blog: "Read the training tips",
    }
  : {
      kicker: "Paiement confirmé",
      title: "Merci, c'est parti.",
      lede: "Votre programme, calculé sur vos PR, arrive par e-mail à l'adresse indiquée lors du paiement. Pensez à vérifier vos spams.",
      blog: "Lire les conseils de préparation",
    };

export default function ThankYou() {
  return (
    <main>
      <section className="page-hero last">
        <div className="wrap">
          <div className="kicker">{COPY.kicker}</div>
          <h1 className="h-page">{COPY.title}</h1>
          <p className="lede">{COPY.lede}</p>
          <div className="hero-ctas">
            <Link href="/blog" className="btn btn-ghost">
              {COPY.blog}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
