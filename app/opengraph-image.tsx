import { ImageResponse } from "next/og";

export const alt = "すこやか食堂";
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
        background: "#fffaf1",
        color: "#123f47",
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
          background: "#b9dfd4",
          borderRadius: "50%",
          height: 420,
          left: -120,
          position: "absolute",
          top: -170,
          width: 420,
        }}
      />
      <div
        style={{
          border: "54px solid #f5c85b",
          borderRadius: "50%",
          bottom: -170,
          height: 430,
          position: "absolute",
          right: -100,
          width: 430,
        }}
      />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#1f6977",
            borderRadius: 999,
            color: "white",
            display: "flex",
            fontSize: 42,
            fontWeight: 800,
            height: 110,
            justifyContent: "center",
            width: 110,
          }}
        >
          S
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: 5,
          }}
        >
          SUKOYAKA SHOKUDO
        </div>
        <div
          style={{
            color: "#1f6977",
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
          }}
        >
          SAPPORO COMMUNITY KITCHEN
        </div>
      </div>
    </div>,
    size,
  );
}
