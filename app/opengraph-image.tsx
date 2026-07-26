import { ImageResponse } from "next/og";

export const alt = "子ども食堂 すこやか食堂";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(180deg, #bfeff1 0%, #e7f9f5 58%, #f8d96a 58%, #ffe9a6 100%)",
        color: "#087488",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,.94)",
          border: "5px solid rgba(255,255,255,.9)",
          borderRadius: 54,
          boxShadow: "0 24px 60px rgba(8,116,136,.15)",
          display: "flex",
          height: 472,
          padding: "52px 72px",
          position: "relative",
          width: 1020,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            width: 340,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#fffdf7",
              border: "18px solid #1594a2",
              borderRadius: "50% 50% 42% 42% / 62% 62% 38% 38%",
              boxShadow: "inset 0 -24px 0 #fff5dc",
              display: "flex",
              flexDirection: "column",
              height: 285,
              justifyContent: "center",
              position: "relative",
              width: 270,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 58,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  background: "#07596a",
                  borderRadius: 999,
                  display: "flex",
                  height: 24,
                  width: 24,
                }}
              />
              <div
                style={{
                  background: "#07596a",
                  borderRadius: 999,
                  display: "flex",
                  height: 24,
                  width: 24,
                }}
              />
            </div>
            <div
              style={{
                background: "#07596a",
                borderRadius: "32px 32px 12px 12px",
                display: "flex",
                height: 72,
                width: 112,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 54,
          }}
        >
          <div
            style={{
              color: "#1594a2",
              display: "flex",
              fontSize: 29,
              fontWeight: 700,
              letterSpacing: 7,
              marginBottom: 20,
            }}
          >
            KIDS DINING &amp; COMMUNITY KITCHEN
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 70,
              fontWeight: 900,
              letterSpacing: 3,
              lineHeight: 1.05,
            }}
          >
            <span>SUKOYAKA</span>
            <span>SHOKUDO</span>
          </div>
          <div
            style={{
              background: "#ff795d",
              borderRadius: 999,
              color: "white",
              display: "flex",
              fontSize: 25,
              fontWeight: 800,
              marginTop: 28,
              padding: "12px 26px",
              width: 152,
            }}
          >
            SAPPORO
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 999,
          height: 64,
          left: 68,
          opacity: 0.9,
          position: "absolute",
          top: 76,
          width: 164,
        }}
      />
      <div
        style={{
          background: "white",
          borderRadius: 999,
          height: 52,
          opacity: 0.86,
          position: "absolute",
          right: 52,
          top: 112,
          width: 138,
        }}
      />
    </div>,
    size,
  );
}
