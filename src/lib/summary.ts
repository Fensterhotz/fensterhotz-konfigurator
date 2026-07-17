import { labelMaps } from "./options";
import type { ConfigItemDraft } from "./types";

export function itemTitle(item: ConfigItemDraft, index: number): string {
  const type = item.productType ? labelMaps.productType[item.productType] : "Element";
  return `${index + 1}. ${type}`;
}

export function itemDetailLines(item: ConfigItemDraft): string[] {
  const lines: string[] = [];
  if (item.profileSystem) lines.push(labelMaps.profileSystem[item.profileSystem]);
  if (item.widthCm && item.heightCm) lines.push(`${item.widthCm} × ${item.heightCm} cm`);
  if (item.hasDivision) lines.push(`Mit Teilung${item.divisionNote ? `: ${item.divisionNote}` : ""}`);
  if (item.glazing) lines.push(labelMaps.glazing[item.glazing]);
  if (item.glassType) {
    lines.push(labelMaps.glassType[item.glassType]);
    if (item.glassType === "ANDERE" && item.glassNote) {
      lines.push(`Glaswunsch: ${item.glassNote}`);
    }
  }
  if (item.openingType) lines.push(labelMaps.openingType[item.openingType]);
  if (item.colorMode) {
    const colorLabel =
      item.colorMode === "WEISS_BEIDSEITIG"
        ? labelMaps.colorMode[item.colorMode]
        : `${labelMaps.colorMode[item.colorMode]}${item.colorChoice ? `: ${labelMaps.colorChoice[item.colorChoice]}` : ""}`;
    lines.push(colorLabel);
    if (item.colorChoice === "ANDERE" && item.colorNote) {
      lines.push(`Farbwunsch: ${item.colorNote}`);
    }
  }
  if (item.hasShutter) {
    const shutterType = item.shutterType ? labelMaps.shutterType[item.shutterType] : "";
    const shutterControl = item.shutterControl ? labelMaps.shutterControl[item.shutterControl] : "";
    lines.push(`${shutterType} (${shutterControl})`.trim());
  } else {
    lines.push("Ohne Rollladen/Jalousie");
  }
  if (item.itemNote) lines.push(`Anmerkung: ${item.itemNote}`);
  return lines;
}
