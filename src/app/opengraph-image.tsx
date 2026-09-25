import { getSite } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = "ATHX PREP — Programme de préparation pour l'ATHX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image for every page without its own cover image.
export default function OpengraphImage() {
  const site = getSite();
  const price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(site.price);

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
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
          <span>ATH</span>
          <span style={{ color: "#FF4A23" }}>X</span>
          <span>&nbsp;PREP</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, textTransform: "uppercase" }}>
            Préparez l&apos;ATHX
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, textTransform: "uppercase", color: "#FF4A23" }}>
            sur vos PR.
          </div>
        </div>
        <div style={{ fontSize: 32, color: "#A9A69C" }}>{`12 semaines · force + endurance + Metcon X · ${price}`}</div>
      </div>
    ),
    size,
  );
}
