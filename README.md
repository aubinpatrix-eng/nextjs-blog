# Mon site — Next.js + Pages CMS

Site statique construit avec [Next.js](https://nextjs.org) et [Tailwind CSS](https://tailwindcss.com), dont le contenu se modifie depuis [Pages CMS](https://pagescms.org) : une interface d'édition gratuite qui enregistre directement vos changements dans ce dépôt GitHub.

## Où se trouve le contenu

| Contenu | Fichier(s) | Dans Pages CMS |
| --- | --- | --- |
| Titre, texte d'accueil, pied de page | `_data/site.json` | **Réglages du site** |
| Articles | `_posts/*.md` | **Articles** |
| Images | `public/assets/` | **Media** |

La configuration de Pages CMS est dans [`.pages.yml`](./.pages.yml) (voir la [documentation](https://pagescms.org/docs/configuration/)).

## 1. Éditer le contenu avec Pages CMS

1. Allez sur [app.pagescms.org](https://app.pagescms.org) et connectez-vous avec votre compte GitHub.
2. Installez l'application GitHub Pages CMS et donnez-lui accès au dépôt `nextjs-blog`.
3. Ouvrez le dépôt, choisissez la branche, puis modifiez **Réglages du site** ou créez un **Article**.
4. Chaque enregistrement crée un commit sur la branche : le site se redéploie automatiquement (étape 2).

## 2. Mettre le site en ligne (Vercel)

1. Sur [vercel.com/new](https://vercel.com/new), importez le dépôt GitHub `nextjs-blog`.
2. Laissez les réglages par défaut (Next.js est détecté) et cliquez sur **Deploy**.
3. Chaque commit — y compris ceux faits depuis Pages CMS — déclenche un nouveau déploiement.

Netlify ou Cloudflare Pages fonctionnent aussi (commande de build : `npm run build`).

## Développement local

```bash
npm install
npm run dev
```

Le site est alors disponible sur [http://localhost:3000](http://localhost:3000).
