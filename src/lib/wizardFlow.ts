import type { ConfigItemDraft, ItemStepId } from "./types";

const MILESTONES: ItemStepId[] = [
  "productType",
  "profileSystem",
  "dimensions",
  "glazing",
  "glassType",
  "openingType",
  "colorMode",
  "shutter",
  "itemNote",
];

export function itemStepProgress(step: ItemStepId): number {
  const normalized = step === "colorChoice" ? "colorMode" : step === "shutterDetails" ? "shutter" : step;
  const index = MILESTONES.indexOf(normalized);
  return (index + 1) / (MILESTONES.length + 1);
}

export function getNextItemStep(
  step: ItemStepId,
  draft: ConfigItemDraft,
): ItemStepId | "overview" {
  switch (step) {
    case "productType":
      return "profileSystem";
    case "profileSystem":
      return "dimensions";
    case "dimensions":
      return "glazing";
    case "glazing":
      return "glassType";
    case "glassType":
      return "openingType";
    case "openingType":
      return "colorMode";
    case "colorMode":
      return draft.colorMode === "WEISS_BEIDSEITIG" ? "shutter" : "colorChoice";
    case "colorChoice":
      return "shutter";
    case "shutter":
      if (!draft.hasShutter) return "itemNote";
      return draft.shutterType === "JALOUSIE" ? "itemNote" : "shutterDetails";
    case "shutterDetails":
      return "itemNote";
    case "itemNote":
      return "overview";
  }
}

export function getPrevItemStep(step: ItemStepId, draft: ConfigItemDraft): ItemStepId | "start" {
  switch (step) {
    case "productType":
      return "start";
    case "profileSystem":
      return "productType";
    case "dimensions":
      return "profileSystem";
    case "glazing":
      return "dimensions";
    case "glassType":
      return "glazing";
    case "openingType":
      return "glassType";
    case "colorMode":
      return "openingType";
    case "colorChoice":
      return "colorMode";
    case "shutter":
      return draft.colorMode === "WEISS_BEIDSEITIG" ? "colorMode" : "colorChoice";
    case "shutterDetails":
      return "shutter";
    case "itemNote":
      if (!draft.hasShutter) return "shutter";
      return draft.shutterType === "JALOUSIE" ? "shutter" : "shutterDetails";
  }
}

export function isItemStepValid(step: ItemStepId, draft: ConfigItemDraft): boolean {
  switch (step) {
    case "productType":
      return !!draft.productType;
    case "profileSystem":
      return !!draft.profileSystem;
    case "dimensions":
      return (
        !!draft.widthCm &&
        draft.widthCm >= 20 &&
        draft.widthCm <= 1000 &&
        !!draft.heightCm &&
        draft.heightCm >= 20 &&
        draft.heightCm <= 1000
      );
    case "glazing":
      return !!draft.glazing;
    case "glassType":
      return !!draft.glassType;
    case "openingType":
      return !!draft.openingType;
    case "colorMode":
      return !!draft.colorMode;
    case "colorChoice":
      return !!draft.colorChoice;
    case "shutter":
      return draft.hasShutter !== undefined && (!draft.hasShutter || !!draft.shutterType);
    case "shutterDetails":
      return !!draft.shutterControl;
    case "itemNote":
      return true;
  }
}

export function emptyDraft(): ConfigItemDraft {
  return { id: crypto.randomUUID(), hasDivision: false, hasShutter: false };
}
