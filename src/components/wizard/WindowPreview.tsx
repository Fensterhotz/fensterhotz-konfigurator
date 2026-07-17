"use client";

import { motion } from "framer-motion";
import { colorChoiceOptions } from "@/lib/options";
import type { ConfigItemDraft } from "@/lib/types";

const BOX_W = 260;
const BOX_H = 190;
const PAD = 14;

function frameRect(widthCm = 120, heightCm = 140) {
  const availW = BOX_W - PAD * 2;
  const availH = BOX_H - PAD * 2;
  const scale = Math.min(availW / widthCm, availH / heightCm);
  const w = widthCm * scale;
  const h = heightCm * scale;
  const x = (BOX_W - w) / 2;
  const y = (BOX_H - h) / 2;
  return { x, y, w, h };
}

function frameColors(draft: ConfigItemDraft) {
  if (!draft.colorMode || draft.colorMode === "WEISS_BEIDSEITIG") {
    return { fill: "#fafaf8", stroke: "#c9c7c0" };
  }
  const choice = colorChoiceOptions.find((o) => o.value === draft.colorChoice);
  if (choice?.swatch) {
    return { fill: choice.swatch, stroke: choice.swatch };
  }
  return { fill: "#e4e2dd", stroke: "#c9c7c0" };
}

function isDarkFill(fill: string) {
  if (!fill.startsWith("#") || fill.length < 7) return false;
  const r = parseInt(fill.slice(1, 3), 16);
  const g = parseInt(fill.slice(3, 5), 16);
  const b = parseInt(fill.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 120;
}

/**
 * Opening symbols follow the standard DIN elevation convention: the apex (single
 * point) sits on the handle/opening side, the two spread line-ends sit on the
 * hinge side (Band). Kipp always hinges along the bottom edge.
 */
function KippSymbol({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  const inset = 4;
  return (
    <polyline
      points={`${x + inset},${y + h - inset} ${x + w / 2},${y + inset} ${x + w - inset},${y + h - inset}`}
      fill="none"
      stroke={color}
      strokeWidth={1.3}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={0.85}
    />
  );
}

function DrehSymbol({
  x,
  y,
  w,
  h,
  side,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  side: "left" | "right";
  color: string;
}) {
  const inset = 4;
  // side = hinge side: lines start at the hinge-side corners and meet at the
  // apex on the opposite (handle) side.
  const hingeEdgeX = side === "left" ? x + inset : x + w - inset;
  const apexX = side === "left" ? x + w - inset : x + inset;
  return (
    <polyline
      points={`${hingeEdgeX},${y + inset} ${apexX},${y + h / 2} ${hingeEdgeX},${y + h - inset}`}
      fill="none"
      stroke={color}
      strokeWidth={1.3}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={0.85}
    />
  );
}

function FixedLabel({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <text
      x={x + w / 2}
      y={y + h / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={Math.min(w, h) * 0.28}
      fontWeight={600}
      fill={color}
      opacity={0.8}
    >
      F
    </text>
  );
}

function SlideArrow({
  cx,
  cy,
  length,
  direction,
  color,
}: {
  cx: number;
  cy: number;
  length: number;
  direction: "left" | "right";
  color: string;
}) {
  const half = length / 2;
  const headLen = 11;
  const headWidth = 7;
  const tipX = direction === "left" ? cx - half : cx + half;
  const tailX = direction === "left" ? cx + half : cx - half;
  const headBaseX = direction === "left" ? tipX + headLen : tipX - headLen;
  return (
    <g>
      <line x1={tailX} y1={cy} x2={headBaseX} y2={cy} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <polygon
        points={`${tipX},${cy} ${headBaseX},${cy - headWidth} ${headBaseX},${cy + headWidth}`}
        fill={color}
      />
    </g>
  );
}

export function WindowPreview({ draft }: { draft: ConfigItemDraft }) {
  const { x, y, w, h } = frameRect(draft.widthCm, draft.heightCm);
  const { fill, stroke } = frameColors(draft);
  const dark = isDarkFill(fill);
  const symbolColor = dark ? "#f2f2f0" : "#3d3d3a";
  const frameThickness = Math.max(6, Math.min(w, h) * 0.06);

  const glassX = x + frameThickness;
  const glassY = y + frameThickness;
  const glassW = w - frameThickness * 2;
  const glassH = h - frameThickness * 2;

  const isSlider = draft.productType === "HEBESCHIEBETUER";
  const isFrosted = draft.glassType === "MILCHGLAS";
  const shutterHeight = draft.hasShutter ? Math.max(14, h * 0.14) : 0;

  return (
    <div className="mb-6 flex flex-col items-center">
      <svg
        viewBox={`0 0 ${BOX_W} ${BOX_H + (draft.hasShutter ? 28 : 0)}`}
        className="w-full max-w-[280px]"
      >
        <g transform={draft.hasShutter ? `translate(0, ${shutterHeight + 6})` : undefined}>
          {draft.hasShutter && (
            <g>
              <rect
                x={x - 2}
                y={y - shutterHeight - 6}
                width={w + 4}
                height={shutterHeight}
                rx={3}
                fill="#d8d6d0"
                stroke="#b7b5ae"
                strokeWidth={1}
              />
              {Array.from({ length: 4 }).map((_, i) => (
                <line
                  key={i}
                  x1={x}
                  x2={x + w}
                  y1={y - shutterHeight - 6 + ((i + 1) * shutterHeight) / 5}
                  y2={y - shutterHeight - 6 + ((i + 1) * shutterHeight) / 5}
                  stroke="#b7b5ae"
                  strokeWidth={0.8}
                />
              ))}
            </g>
          )}

          {/* Outer frame */}
          <motion.rect
            initial={false}
            animate={{ x, y, width: w, height: h, fill, stroke }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            rx={2}
            strokeWidth={frameThickness}
          />

          {/* Glass */}
          <rect
            x={glassX}
            y={glassY}
            width={Math.max(glassW, 1)}
            height={Math.max(glassH, 1)}
            fill={isFrosted ? "url(#milchGradient)" : "url(#glassGradient)"}
          />
          {isFrosted ? (
            <rect
              x={glassX}
              y={glassY}
              width={Math.max(glassW, 1)}
              height={Math.max(glassH, 1)}
              fill="white"
              filter="url(#frost)"
              clipPath="url(#glassClip)"
            />
          ) : (
            <line
              x1={glassX + glassW * 0.15}
              y1={glassY + glassH * 0.85}
              x2={glassX + glassW * 0.55}
              y2={glassY + glassH * 0.1}
              stroke="white"
              strokeOpacity={0.35}
              strokeWidth={Math.max(glassW, glassH) * 0.06}
            />
          )}

          {isSlider ? (
            <g>
              <line
                x1={glassX + glassW / 2}
                y1={glassY}
                x2={glassX + glassW / 2}
                y2={glassY + glassH}
                stroke={symbolColor}
                strokeWidth={1.2}
                opacity={0.4}
              />
              {(draft.openingType === "GLEITEND_LINKS" || draft.openingType === "GLEITEND_RECHTS") && (
                <SlideArrow
                  cx={glassX + glassW / 2}
                  cy={glassY + glassH / 2}
                  length={Math.min(glassW * 0.6, 70)}
                  direction={draft.openingType === "GLEITEND_LINKS" ? "left" : "right"}
                  color={symbolColor}
                />
              )}
            </g>
          ) : (
            <g>
              {draft.hasDivision && (
                <rect
                  x={glassX + glassW / 2 - frameThickness / 2}
                  y={glassY}
                  width={frameThickness}
                  height={glassH}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1}
                />
              )}
              {draft.openingType === "FEST" && (
                <FixedLabel x={glassX} y={glassY} w={glassW} h={glassH} color={symbolColor} />
              )}
              {(draft.openingType === "NUR_KIPP" ||
                draft.openingType === "DREHKIPP_LINKS" ||
                draft.openingType === "DREHKIPP_RECHTS") && (
                <KippSymbol x={glassX} y={glassY} w={glassW} h={glassH} color={symbolColor} />
              )}
              {draft.openingType === "DREHKIPP_LINKS" && (
                <DrehSymbol x={glassX} y={glassY} w={glassW} h={glassH} side="left" color={symbolColor} />
              )}
              {draft.openingType === "DREHKIPP_RECHTS" && (
                <DrehSymbol x={glassX} y={glassY} w={glassW} h={glassH} side="right" color={symbolColor} />
              )}
            </g>
          )}
        </g>

        <defs>
          <clipPath id="glassClip">
            <rect x={glassX} y={glassY} width={Math.max(glassW, 1)} height={Math.max(glassH, 1)} />
          </clipPath>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dce8ef" />
            <stop offset="100%" stopColor="#b9cdd9" />
          </linearGradient>
          <linearGradient id="milchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eef2f3" />
            <stop offset="100%" stopColor="#dbe2e4" />
          </linearGradient>
          <filter id="frost" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"
            />
          </filter>
        </defs>
      </svg>
      {draft.widthCm && draft.heightCm && (
        <span className="mt-1 text-xs text-[var(--muted)]">
          {draft.widthCm} × {draft.heightCm} cm
        </span>
      )}
    </div>
  );
}
