# ATHX PREP — preparation-athx.fr

Site de vente du programme de préparation ATHX (14,99 €) + blog, construit avec [Next.js](https://nextjs.org) et éditable depuis [Pages CMS](https://pagescms.org).

## Structure

| Page | URL | Contenu éditable dans Pages CMS |
| --- | --- | --- |
| Accueil (format ATHX, programme, calculateur de PR, FAQ) | `/` | **Page d'accueil** → `_data/home.json` |
| Blog | `/blog`, `/blog/categorie/force`… | **Articles de blog** → `_posts/*.md` |
| Article | `/blog/<adresse>` | idem |
| Préparation ATHX Paris / Montpellier / Marseille (menu « Compétitions ») | `/preparation-athx-paris`… | **Préparation ATHX (pages villes)** → `_events/*.md` |
| Guides : Workouts 2027, Catégories, Mouvements, Semaine gratuite (menu « Guides ») | `/workouts-athx-2027`, `/workouts-athx-2027/metcon-x`… | **Guides** → `_guides/*.md` (champ `parent` = page principale du guide) |
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

## Newsletter (Brevo)

Le formulaire (fin des articles, guides, pages villes, blog) envoie les inscriptions à [Brevo](https://www.brevo.com) via `/api/newsletter`. Il fonctionne aussi sans JavaScript.

1. Créez un compte Brevo, puis une liste de contacts (*Contacts → Listes*) : notez son **ID**.
2. *Paramètres → SMTP & API → Clés API* : créez une clé.
3. Recommandé (RGPD) : *Contacts → Formulaires* ou *Templates* → créez un **modèle de double opt-in** et notez son ID.
4. Dans Vercel → *Settings → Environment Variables*, ajoutez `BREVO_API_KEY`, `BREVO_LIST_ID` et (optionnel) `BREVO_DOI_TEMPLATE_ID`, puis redéployez.

Tant que ces variables sont absentes, le formulaire affiche « L'inscription ouvre très bientôt ».

## Version anglaise (en.preparation-athx.fr)

Le même dépôt est déployé deux fois : le site français (par défaut) et le site anglais, construit avec la variable `NEXT_PUBLIC_SITE_LOCALE=en`. Le site anglais vend le même programme (rédigé en français, c'est indiqué près des boutons d'achat).

| Contenu | Français | Anglais |
| --- | --- | --- |
| Articles, guides, pages villes, pages légales | `_posts`, `_guides`, `_events`, `_pages` | `_posts_en`, `_guides_en`, `_events_en`, `_pages_en` |
| Accueil, Qui suis-je, guide 1RM | `_data/home.json`… | `_data/en/home.json`… |
| Réglages | `_data/site.json` | `_data/en/site.json` (textes seulement ; prix et réglages communs) |
| Adresses des pages fixes et des catégories | `/calculateur-1rm`, `/blog/categorie/force`… | `/1rm-calculator`, `/blog/category/strength`… (`src/lib/routes.json`) |

- **Adresses anglaises** : chaque page anglaise a son propre champ `slug` (ex. `metcon-x-explained`). Elle est reliée à sa version française par son nom de fichier (celui du fichier français) ou, pour une page créée dans Pages CMS, par le champ « Adresse de la version française » (`translationOf`).
- **hreflang** : chaque page qui existe dans les deux langues déclare `fr`, `en` et `x-default` (→ version anglaise), dans le `<head>` et dans les deux `sitemap.xml`. Une page sans traduction n'a que sa canonical.
- **Bouton FR / EN** dans le menu : il renvoie vers la même page dans l'autre langue (ou vers l'accueil si elle n'existe pas).
- Sur le site anglais, les anciennes adresses françaises des pages fixes (`/calculateur-1rm`…) redirigent vers l'adresse anglaise.

### Mise en ligne du site anglais

1. **Vercel** → *Add New → Project* → importez **le même dépôt** une deuxième fois (ex. projet `athx-prep-en`).
2. Dans ce projet → *Settings → Environment Variables* : `NEXT_PUBLIC_SITE_LOCALE` = `en`, plus `BREVO_API_KEY` et, pour des e-mails en anglais, une **liste** et un **modèle de double opt-in anglais** (`BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`). Le projet français ne change pas.
3. *Settings → Domains* : ajoutez `en.preparation-athx.fr`. Vercel affiche l'enregistrement à créer.
4. **OVH** → *Noms de domaine → preparation-athx.fr → Zone DNS → Ajouter une entrée* : type **CNAME**, sous-domaine `en`, cible `cname.vercel-dns.com.` (ou la valeur affichée par Vercel). Comptez quelques minutes à quelques heures.
5. **Stripe** (recommandé) : créez un second Payment Link qui redirige vers `https://en.preparation-athx.fr/thank-you` et collez-le dans **Réglages du site (anglais) → Lien de paiement Stripe**. Vide, le site anglais utilise le lien français (qui renvoie sur `/merci`, en français).
6. **Google Search Console** : ajoutez la propriété `https://en.preparation-athx.fr` (ou utilisez la propriété *Domaine*, qui couvre les sous-domaines) et soumettez `https://en.preparation-athx.fr/sitemap.xml`.
7. **Pages pour les deux sites** : chaque enregistrement dans Pages CMS redéploie les deux projets Vercel.

## Écrire un article

Dans Pages CMS → **Articles de blog** → *Add an entry* : titre, adresse (ex. `hyrox-vs-athx`, sans accents), résumé (~155 caractères, c'est le texte affiché par Google), catégorie, date. Un article daté dans le futur n'apparaît qu'au prochain déploiement après cette date.

## Développement local

```bash
npm install
npm run dev   # http://localhost:3000
```
