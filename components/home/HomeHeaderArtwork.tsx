import { HEADER_ARTWORK_SOURCE, HEADER_CLOUD_COLOR, HEADER_SKY_COLOR, HEADER_WAVE_COLOR } from "../../lib/headerBackground";

/** Existing artwork and its existing colour treatment, in SVG viewports.
 * No translated HTML canvas, negative layout offsets, or scrollable masks. */
export function HomeHeaderArtwork({ id, kind }: { id: string; kind: "desktop" | "brand" | "nature" | "cloud" }) {
  const viewBox = { desktop: "0 205 2172 280", brand: "25 245 800 187", nature: "1780 240 380 185", cloud: "780 250 100 55" }[kind];
  return (
    <svg viewBox={viewBox} width={kind === "desktop" ? 2172 : undefined} height={kind === "desktop" ? 280 : undefined} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-bird`} clipPathUnits="userSpaceOnUse"><path clipRule="evenodd" d="M0 0H2172V724H0Z M1810 240H1915V287H2000V327H1898V310H1810Z" /></clipPath>
        <clipPath id={`${id}-cloud`}><rect x="780" y="245" width="110" height="65" /><rect x="1755" y="395" width="115" height="65" /></clipPath>
        <clipPath id={`${id}-wave`}><rect x="0" y="410" width="2172" height="70" /></clipPath>
        <clipPath id={`${id}-frame`}><rect x="8" y="227" width="2156" height="251" rx="76.02" /></clipPath>
        <filter id={`${id}-white`} colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  8.5 0 0 0 -6.766667" result="matte" />
          <feFlood floodColor={HEADER_CLOUD_COLOR} result="colour" /><feComposite in="colour" in2="matte" operator="in" result="paint" /><feComposite in="paint" in2="SourceGraphic" operator="over" />
        </filter>
        <filter id={`${id}-peach`} colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 32 -32 0 -0.627451" result="green" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  32 0 0 0 -27.356863" result="light" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -255 0 0 0 246" result="notWhite" />
          <feComposite in="green" in2="light" operator="in" result="pale" /><feComposite in="pale" in2="notWhite" operator="in" result="matte" />
          <feFlood floodColor={HEADER_WAVE_COLOR} result="colour" /><feComposite in="colour" in2="matte" operator="in" result="paint" /><feComposite in="paint" in2="SourceGraphic" operator="over" />
        </filter>
        <image id={`${id}-source`} href={HEADER_ARTWORK_SOURCE} width="2172" height="724" clipPath={`url(#${id}-bird)`} />
        <g id={`${id}-art`}>
          <use href={`#${id}-source`} /><use href={`#${id}-source`} clipPath={`url(#${id}-wave)`} filter={`url(#${id}-peach)`} /><use href={`#${id}-source`} clipPath={`url(#${id}-cloud)`} filter={`url(#${id}-white)`} />
        </g>
      </defs>
      <use href={`#${id}-art`} clipPath={kind === "desktop" ? `url(#${id}-frame)` : undefined} />
      {kind === "desktop" && <rect x="895" y="305" width="1020" height="110" fill={HEADER_SKY_COLOR} />}
      {kind === "brand" && <><rect x="125" y="425" width="145" height="7" fill={HEADER_SKY_COLOR} /><rect x="25" y="365" width="60" height="67" fill={HEADER_SKY_COLOR} /></>}
    </svg>
  );
}
