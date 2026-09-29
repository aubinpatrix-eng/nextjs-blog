import fs from "fs";
import { ImageResponse } from "next/og";
import { join } from "path";

export const ogSize = { width: 1200, height: 630 };

const fontsDirectory = join(process.cwd(), "src/assets/fonts");

function titleSize(title: string) {
  if (title.length <= 40) return 96;
  if (title.length <= 60) return 80;
  if (title.length <= 80) return 68;
  return 58;
}

// Branded share image (Open Graph) showing the page title, generated at build time.
export function renderOgImage({ kicker, title }: { kicker?: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#14140F",
          color: "#F3F0E8",
          fontFamily: "Work Sans",
          borderBottom: "12px solid #FF4A23",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontFamily: "Big Shoulders", fontSize: 60, lineHeight: 1 }}>
            <span>ATH</span>
            <span style={{ color: "#FF4A23" }}>X</span>
          </div>
          <div style={{ width: 3, height: 42, background: "#FF4A23" }} />
          <div style={{ fontSize: 22, letterSpacing: 9 }}>PREP</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {kicker && (
            <div style={{ fontSize: 26, color: "#FF4A23", textTransform: "uppercase", letterSpacing: 3 }}>{kicker}</div>
          )}
          <div
            style={{
              fontFamily: "Big Shoulders",
              fontSize: titleSize(title),
              lineHeight: 1.02,
              textTransform: "uppercase",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#A9A69C" }}>preparation-athx.fr</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Big Shoulders", data: fs.readFileSync(join(fontsDirectory, "big-shoulders-display-900.ttf")), weight: 900 },
        { name: "Work Sans", data: fs.readFileSync(join(fontsDirectory, "work-sans-500.ttf")), weight: 500 },
      ],
    },
  );
}
