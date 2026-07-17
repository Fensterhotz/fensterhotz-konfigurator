export type ProjectType = "NEUBAU" | "SANIERUNG";
export type Installation = "MIT_MONTAGE" | "OHNE_MONTAGE";
export type ProductType = "FENSTER" | "BALKONTUER" | "HEBESCHIEBETUER";
export type ProfileSystem = "KUNSTSTOFF" | "ALUMINIUM";
export type Glazing = "ZWEIFACH" | "DREIFACH";
export type GlassType = "KLAR" | "SICHERHEIT" | "MILCHGLAS" | "ANDERE";
export type OpeningType =
  | "FEST"
  | "DREHKIPP_LINKS"
  | "DREHKIPP_RECHTS"
  | "NUR_KIPP"
  | "GLEITEND_LINKS"
  | "GLEITEND_RECHTS";
export type ColorMode = "WEISS_BEIDSEITIG" | "WEISS_INNEN_FARBE_AUSSEN" | "FARBE_BEIDSEITIG";
export type ColorChoice =
  | "GOLDEN_OAK"
  | "NUSSBAUM"
  | "ANTHRAZITGRAU"
  | "SCHWARZ_MATT"
  | "QUARZGRAU"
  | "MAHAGONI"
  | "EICHE_DUNKEL"
  | "ANDERE";
export type ShutterType = "ROLLLADEN" | "JALOUSIE";
export type ShutterControl = "MANUELL" | "ELEKTRISCH";

export interface ConfigItemDraft {
  id: string;
  productType?: ProductType;
  profileSystem?: ProfileSystem;
  widthCm?: number;
  heightCm?: number;
  hasDivision?: boolean;
  divisionNote?: string;
  glazing?: Glazing;
  glassType?: GlassType;
  glassNote?: string;
  openingType?: OpeningType;
  colorMode?: ColorMode;
  colorChoice?: ColorChoice;
  colorNote?: string;
  hasShutter?: boolean;
  shutterType?: ShutterType;
  shutterControl?: ShutterControl;
  itemNote?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export type ItemStepId =
  | "productType"
  | "profileSystem"
  | "dimensions"
  | "glazing"
  | "glassType"
  | "openingType"
  | "colorMode"
  | "colorChoice"
  | "shutter"
  | "shutterDetails"
  | "itemNote";

export type Phase = "start" | "item" | "overview" | "contact" | "summary" | "success";
