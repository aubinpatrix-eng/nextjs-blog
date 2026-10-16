import { isEn } from "@/lib/i18n";
import { formatPrice, getSite } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = isEn ? "ATHX PREP — ATHX training program" : "ATHX PREP — Programme de préparation pour l'ATHX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image for every page without its own cover image.
export default function OpengraphImage() {
  const site = getSite();
  const price = formatPrice(site.price);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#14140F",
          color: "#F3F0E8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
            <span>ATH</span>
            <span style={{ color: "#FF4A23" }}>X</span>
          </div>
          <div style={{ width: 3, height: 52, background: "#FF4A23" }} />
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 11 }}>PREP</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, textTransform: "uppercase" }}>
            {isEn ? "Prepare for ATHX" : "Préparez l'ATHX"}
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, textTransform: "uppercase", color: "#FF4A23" }}>
            {isEn ? "on your PRs." : "sur vos PR."}
          </div>
        </div>
        <div style={{ fontSize: 32, color: "#A9A69C" }}>{isEn ? `12 weeks · strength + endurance + Metcon X · ${price}` : `12 semaines · force + endurance + Metcon X · ${price}`}</div>
      </div>
    ),
    size,
  );
}
