"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

export function HomeNewsImage({ src, alt, width, height }: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const frame: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };

  const reveal = useCallback(async (image: HTMLImageElement) => {
    try {
      // A complete download can still have a pending browser decode. Never paint
      // an intermediate bitmap; keep the existing fixed-size background until ready.
      await image.decode();
      if (imageRef.current === image && image.naturalWidth > 0) setReady(true);
    } catch {
      if (imageRef.current === image) setFailed(true);
    }
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    // Cached images may finish before hydration attaches the load listener.
    if (image?.complete && image.naturalWidth > 0) void reveal(image);
  }, [reveal]);

  return (
    <>
      <img ref={imageRef} src={src} alt={alt} width={width} height={height}
        loading="lazy" decoding="async"
        style={{ ...frame, visibility: ready ? "visible" : "hidden" }}
        onLoad={(event) => void reveal(event.currentTarget)} onError={() => setFailed(true)} />
      {failed && <span role="img" aria-label={alt} style={{ ...frame, display: "grid", placeItems: "center" }}>{alt}</span>}
      <noscript><img src={src} alt={alt} width={width} height={height} loading="lazy" style={frame} /></noscript>
    </>
  );
}
