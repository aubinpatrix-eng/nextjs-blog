import { NextResponse } from "next/server";

// Newsletter sign-up, sent to Brevo. Configure in Vercel (Settings → Environment Variables):
//   BREVO_API_KEY            Brevo API key (never exposed to the browser)
//   BREVO_LIST_ID            id of the Brevo contact list
//   BREVO_DOI_TEMPLATE_ID    optional: id of a double opt-in template (recommended, GDPR)
// Works with a plain HTML form (redirects to /newsletter/merci) and with fetch (JSON response).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BREVO_API = process.env.BREVO_API_URL ?? "https://api.brevo.com/v3";

type Result = "ok" | "confirm" | "invalid" | "consent" | "unavailable" | "error";

async function subscribe(email: string, origin: string): Promise<Result> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) return "unavailable";
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const headers = { "api-key": apiKey, "content-type": "application/json", accept: "application/json" };

  const response = templateId
    ? await fetch(`${BREVO_API}/contacts/doubleOptinConfirmation`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          includeListIds: [listId],
          templateId,
          redirectionUrl: `${origin}/newsletter/merci?statut=confirme`,
        }),
      })
    : await fetch(`${BREVO_API}/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
      });

  if (response.ok) return templateId ? "confirm" : "ok";
  console.error("Brevo error", response.status, await response.text());
  return "error";
}

export async function POST(request: Request) {
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const consent = form.get("consent");
  const origin = new URL(request.url).origin;

  let result: Result;
  if (form.get("website")) {
    result = "ok"; // honeypot filled: silently ignore bots
  } else if (!EMAIL.test(email) || email.length > 254) {
    result = "invalid";
  } else if (!consent) {
    result = "consent";
  } else {
    result = await subscribe(email, origin).catch(() => "error" as const);
  }

  if (wantsJson) {
    const status = result === "ok" || result === "confirm" ? 200 : result === "unavailable" ? 503 : 400;
    return NextResponse.json({ result }, { status });
  }
  return NextResponse.redirect(`${origin}/newsletter/merci?statut=${result}`, 303);
}
