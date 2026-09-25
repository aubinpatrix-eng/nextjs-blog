import { getSite } from "@/lib/site";

// Hidden until a newsletter form URL (Brevo, Mailchimp…) is set in Pages CMS.
export default function Newsletter() {
  const site = getSite();
  if (!site.newsletterAction) {
    return null;
  }

  return (
    <section className="newsletter">
      <div className="wrap">
        <h2 className="h-sec h-small">Un article par semaine sur la prépa ATHX</h2>
        <p className="mute">Pas de spam, juste de la préparation utile.</p>
        <form className="newsletter-box" action={site.newsletterAction} method="post" target="_blank">
          <input type="email" name="EMAIL" required placeholder="vous@exemple.fr" aria-label="Adresse e-mail" />
          <button type="submit" className="btn btn-signal">
            S&apos;abonner
          </button>
        </form>
      </div>
    </section>
  );
}
