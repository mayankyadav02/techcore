import { ImageResponse } from "next/og";

export function getBaseUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

function stripHtml(html: string) {
  // Simple regex to strip HTML tags if any sneaked in
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function truncate(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

export function generateOgImage({
  title,
  description,
  companyName,
  logoUrl,
}: {
  title?: string;
  description?: string;
  companyName: string;
  logoUrl?: string;
}) {
  const safeTitle = truncate(stripHtml(title || companyName), 90);
  const safeDescription = truncate(stripHtml(description || ""), 200);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          borderTop: "16px solid #2563eb", // brand color accent
        }}
      >
        {/* Top Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#2563eb",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: 40, objectFit: "contain" }}
              />
            ) : null}
            {!logoUrl && companyName}
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.1,
              marginTop: "40px",
              display: "flex",
              maxWidth: "1000px",
            }}
          >
            {safeTitle}
          </div>

          {safeDescription && (
            <div
              style={{
                fontSize: 32,
                color: "#4b5563",
                lineHeight: 1.4,
                marginTop: "24px",
                maxWidth: "900px",
                display: "flex",
              }}
            >
              {safeDescription}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid #f3f4f6",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            {companyName}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#9ca3af",
            }}
          >
            {getBaseUrl().replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
