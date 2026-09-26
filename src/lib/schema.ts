import type { About, Site } from "@/lib/site";

// Stable identifiers so every page refers to the same author and organization entities.
export const personId = (site: Site) => `${site.url}/qui-suis-je#person`;
export const organizationId = (site: Site) => `${site.url}/#organization`;

export function personSchema(site: Site, about: About) {
  return {
    "@type": "Person",
    "@id": personId(site),
    name: about.name,
    url: `${site.url}/qui-suis-je`,
    image: `${site.url}${about.avatar || about.photo}`,
    description: about.bio,
    jobTitle: "Coach et athlète ATHX",
    knowsAbout: ["ATHX Games", "Musculation", "Préparation physique", "Fitness hybride"],
    ...(site.instagram && { sameAs: [site.instagram] }),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(site: Site, items: { name: string; path?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path !== undefined && { item: `${site.url}${item.path}` }),
    })),
  };
}
