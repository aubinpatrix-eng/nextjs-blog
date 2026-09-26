# ATHX PREP — preparation-athx.fr

Site de vente du programme de préparation ATHX (14,99 €) + blog, construit avec [Next.js](https://nextjs.org) et éditable depuis [Pages CMS](https://pagescms.org).

## Structure

| Page | URL | Contenu éditable dans Pages CMS |
| --- | --- | --- |
| Accueil (format ATHX, programme, calculateur de PR, FAQ) | `/` | **Page d'accueil** → `_data/home.json` |
| Blog | `/blog`, `/blog/categorie/force`… | **Articles de blog** → `_posts/*.md` |
| Article | `/blog/<adresse>` | idem |
| Préparation ATHX Paris / Montpellier / Marseille (menu « Compétitions ») | `/preparation-athx-paris`… | **Préparation ATHX (pages villes)** → `_events/*.md` |
| Mentions légales, CGV, confidentialité | `/mentions-legales`… | **Pages** → `_pages/*.md` |
| Confirmation d'achat (non indexée) | `/merci` | — |
| Prix, lien de paiement, newsletter, URL du site | — | **Réglages du site** → `_data/site.json` |

SEO généré automatiquement : `sitemap.xml`, `robots.txt`, balises canonical et Open Graph, image de partage, données structurées (Course + CourseInstance + Offer, Person, FAQPage, BlogPosting, BreadcrumbList).

## Mise en route

1. **Paiement** — créez un [Payment Link Stripe](https://dashboard.stripe.com/payment-links) à 14,99 € :
   - après le paiement, redirigez vers `https://preparation-athx.fr/merci` ;
   - ajoutez la case d'acceptation des CGV (renonciation au droit de rétractation pour un contenu numérique).

   Collez le lien dans **Réglages du site → Lien de paiement Stripe**. Tant qu'il est vide, le bouton affiche « Bientôt disponible ».
   Les PR saisis dans le calculateur arrivent dans Stripe, dans le champ `client_reference_id` du paiement, toujours en kg (ex. `ATHX_SQ100_DM45_SDT130`), et l'e-mail est prérempli.
2. **Mise en ligne** — importez ce dépôt sur [vercel.com/new](https://vercel.com/new), puis ajoutez le domaine dans *Settings → Domains*.
3. **Pages CMS** — connectez-vous sur [app.pagescms.org](https://app.pagescms.org) avec GitHub et ouvrez ce dépôt. Chaque enregistrement crée un commit et redéploie le site.
4. **Google Search Console** — ajoutez le domaine et soumettez `https://preparation-athx.fr/sitemap.xml`.
5. Complétez les **[À COMPLÉTER]** des mentions légales, CGV et politique de confidentialité.

## Écrire un article

Dans Pages CMS → **Articles de blog** → *Add an entry* : titre, adresse (ex. `hyrox-vs-athx`, sans accents), résumé (~155 caractères, c'est le texte affiché par Google), catégorie, date. Un article daté dans le futur n'apparaît qu'au prochain déploiement après cette date.

## Développement local

```bash
npm install
npm run dev   # http://localhost:3000
```
