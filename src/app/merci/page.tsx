import { Metadata } from "next";
import Link from "next/link";

// Use this page as the Stripe Payment Link confirmation URL: https://preparation-athx.fr/merci
export const metadata: Metadata = {
  title: "Merci pour votre achat",
  robots: { index: false },
};

export default function ThankYou() {
  return (
    <main>
      <section className="page-hero last">
        <div className="wrap">
          <div className="kicker">Paiement confirmé</div>
          <h1 className="h-page">Merci, c&apos;est parti.</h1>
          <p className="lede">
            Votre programme, calculé sur vos PR, arrive par e-mail à l&apos;adresse indiquée lors du paiement.
            Pensez à vérifier vos spams.
          </p>
          <div className="hero-ctas">
            <Link href="/blog" className="btn btn-ghost">
              Lire les conseils de préparation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
