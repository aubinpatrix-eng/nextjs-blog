import NewsletterForm from "@/app/_components/newsletter-form";

// Newsletter band used at the bottom of the blog listing pages.
export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="wrap">
        <NewsletterForm source="blog" />
      </div>
    </section>
  );
}
