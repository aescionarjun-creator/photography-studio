// Soft, blurred blossom clusters used as ambient corner decoration on the
// home hero — pure inline SVG line-art so no external image is required.
function Blossom({ className, flip = false }) {
  return (
    <svg
      className={className}
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g opacity="0.55" stroke="#C9A669" strokeWidth="1.2">
        <path d="M10 40 C 60 10, 110 30, 150 90" />
        <path d="M20 90 C 70 70, 120 90, 160 140" />
        <path d="M0 130 C 50 120, 90 140, 120 190" />
      </g>
      <g opacity="0.9">
        {[
          [40, 46], [78, 30], [118, 66], [58, 96], [96, 118], [22, 120], [140, 108], [70, 150],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="-6"
                rx="4.2"
                ry="6.5"
                fill="#FFFDF8"
                stroke="#E4D3A6"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle r="2.4" fill="#C9A669" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function FloralCorners() {
  return (
    <>
      <Blossom className="absolute -top-6 -left-10 pointer-events-none select-none opacity-70 blur-[0.5px]" />
      <Blossom className="absolute -bottom-10 -left-14 pointer-events-none select-none opacity-60 blur-[0.5px]" flip />
    </>
  );
}
