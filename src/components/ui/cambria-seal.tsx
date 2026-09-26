import React from "react";

interface CambriaSealProps {
  className?: string;
  size?: number;
  variant?: "navy" | "white" | "gold" | "monochrome";
}

export const CambriaSeal: React.FC<CambriaSealProps> = ({
  className = "",
  size = 64,
  variant = "navy",
}) => {
  const getColors = () => {
    switch (variant) {
      case "white":
        return {
          stroke: "#FFFFFF",
          fill: "none",
          accent: "#C8A84E",
          text: "#FFFFFF",
          solid: "#FFFFFF",
        };
      case "gold":
        return {
          stroke: "#C8A84E",
          fill: "none",
          accent: "#C8A84E",
          text: "#C8A84E",
          solid: "#C8A84E",
        };
      case "monochrome":
        return {
          stroke: "currentColor",
          fill: "none",
          accent: "currentColor",
          text: "currentColor",
          solid: "currentColor",
        };
      case "navy":
      default:
        return {
          stroke: "#020B5A",
          fill: "none",
          accent: "#020B5A",
          text: "#020B5A",
          solid: "#020B5A",
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cambria International College Official Seal"
    >
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="96" stroke={colors.stroke} strokeWidth="2.5" />
      {/* Inner Concentric Ring (Double-Ring Motif) */}
      <circle cx="100" cy="100" r="91" stroke={colors.stroke} strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="100" cy="100" r="70" stroke={colors.stroke} strokeWidth="1.5" />

      {/* Arced Text Path Definition */}
      <defs>
        <path
          id="upperArc"
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
        />
        <path
          id="lowerArc"
          d="M 172 100 A 72 72 0 0 1 28 100"
          fill="none"
        />
      </defs>

      {/* Circular Wordmark: CAMBRIA (Top) and INTERNATIONAL COLLEGE (Bottom) */}
      <text
        fill={colors.text}
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="0.22em"
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        <textPath href="#upperArc" startOffset="50%" textAnchor="middle">
          CAMBRIA
        </textPath>
      </text>

      <text
        fill={colors.text}
        fontSize="8"
        fontWeight="600"
        letterSpacing="0.18em"
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        <textPath href="#lowerArc" startOffset="50%" textAnchor="middle">
          INTERNATIONAL COLLEGE
        </textPath>
      </text>

      {/* Center Group */}
      <g transform="translate(100, 108)">
        {/* Three Celestial Stars (Accents above Book & Sunburst) */}
        <polygon
          points="0,-36 2,-31 7,-31 3,-28 4,-23 0,-26 -4,-23 -3,-28 -7,-31 -2,-31"
          fill={colors.accent}
        />
        <polygon
          points="-16,-32 -14,-28 -10,-28 -13,-25 -12,-21 -16,-23 -20,-21 -19,-25 -22,-28 -18,-28"
          fill={colors.accent}
        />
        <polygon
          points="16,-32 18,-28 22,-28 19,-25 20,-21 16,-23 12,-21 13,-25 10,-28 14,-28"
          fill={colors.accent}
        />

        {/* Radiant Sunburst above Codex */}
        <path
          d="M 0 -22 L 0 -16 M -8 -20 L -5 -15 M 8 -20 L 5 -15 M -14 -16 L -9 -13 M 14 -16 L 9 -13"
          stroke={colors.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Open Academic Codex / Book */}
        {/* Left Page */}
        <path
          d="M 0 -2 C -10 -7, -26 -6, -32 2 L -32 18 C -26 12, -10 11, 0 16 Z"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Right Page */}
        <path
          d="M 0 -2 C 10 -7, 26 -6, 32 2 L 32 18 C 26 12, 10 11, 0 16 Z"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Spine & Pages Lines */}
        <line x1="0" y1="-2" x2="0" y2="16" stroke={colors.stroke} strokeWidth="1.8" />
        <line x1="-24" y1="4" x2="-8" y2="2" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />
        <line x1="-24" y1="8" x2="-8" y2="6" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />
        <line x1="-24" y1="12" x2="-8" y2="10" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />
        <line x1="24" y1="4" x2="8" y2="2" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />
        <line x1="24" y1="8" x2="8" y2="6" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />
        <line x1="24" y1="12" x2="8" y2="10" stroke={colors.stroke} strokeWidth="0.8" opacity="0.6" />

        {/* Academic Quill Pen laid diagonally across codex */}
        <path
          d="M -18 20 L 22 -14 C 23 -16, 21 -18, 19 -16 L -16 16 Z"
          fill={colors.solid}
          opacity="0.85"
        />
        <line x1="-18" y1="20" x2="-22" y2="24" stroke={colors.stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Laurel Branches Flanking Codex */}
        {/* Left Laurel */}
        <path
          d="M -38 18 C -42 6, -42 -10, -32 -20"
          stroke={colors.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="-38" cy="14" r="2" fill={colors.accent} />
        <circle cx="-41" cy="5" r="2" fill={colors.accent} />
        <circle cx="-40" cy="-4" r="2" fill={colors.accent} />
        <circle cx="-35" cy="-13" r="2" fill={colors.accent} />

        {/* Right Laurel */}
        <path
          d="M 38 18 C 42 6, 42 -10, 32 -20"
          stroke={colors.stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="38" cy="14" r="2" fill={colors.accent} />
        <circle cx="41" cy="5" r="2" fill={colors.accent} />
        <circle cx="40" cy="-4" r="2" fill={colors.accent} />
        <circle cx="35" cy="-13" r="2" fill={colors.accent} />
      </g>
    </svg>
  );
};
