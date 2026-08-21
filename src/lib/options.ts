import type {
  ColorChoice,
  ColorMode,
  Glazing,
  GlassType,
  Installation,
  OpeningType,
  ProductType,
  ProfileSystem,
  ProjectType,
  ShutterControl,
  ShutterType,
} from "./types";

export interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const projectTypeOptions: Option<ProjectType>[] = [
  { value: "NEUBAU", label: "Neubau" },
  { value: "SANIERUNG", label: "Sanierung" },
];

export const installationOptions: Option<Installation>[] = [
  { value: "MIT_MONTAGE", label: "Mit Montage" },
  { value: "OHNE_MONTAGE", label: "Ohne Montage" },
];

export const productTypeOptions: Option<ProductType>[] = [
  { value: "FENSTER", label: "Fenster" },
  { value: "BALKONTUER", label: "Balkontür" },
];

export const profileSystemOptions: Option<ProfileSystem>[] = [
  { value: "KUNSTSTOFF", label: "Kunststoff" },
  { value: "ALUMINIUM", label: "Aluminium" },
];

export const glazingOptions: Option<Glazing>[] = [
  { value: "ZWEIFACH", label: "2-fach verglast" },
  { value: "DREIFACH", label: "3-fach verglast" },
];

export const glassTypeOptions: Option<GlassType>[] = [
  { value: "KLAR", label: "Klarglas", description: "Standard" },
  { value: "SICHERHEIT", label: "Sicherheitsglas" },
  { value: "MILCHGLAS", label: "Milchglas" },
  { value: "ANDERE", label: "Andere", description: "Nicht dabei? Kurz beschreiben" },
];

const openingTypeOptionsFenster: Option<OpeningType>[] = [
  { value: "FEST", label: "Festelement", description: "Nicht zu öffnen" },
  { value: "DREHKIPP_LINKS", label: "Dreh-Kipp links" },
  { value: "DREHKIPP_RECHTS", label: "Dreh-Kipp rechts" },
  { value: "NUR_KIPP", label: "Nur Kipp" },
];

const openingTypeOptionsSchiebetuer: Option<OpeningType>[] = [
  { value: "GLEITEND_LINKS", label: "Gleitend links" },
  { value: "GLEITEND_RECHTS", label: "Gleitend rechts" },
];

export function getOpeningTypeOptions(productType?: ProductType): Option<OpeningType>[] {
  if (productType === "HEBESCHIEBETUER") return openingTypeOptionsSchiebetuer;
  return openingTypeOptionsFenster;
}

export const colorModeOptions: Option<ColorMode>[] = [
  { value: "WEISS_BEIDSEITIG", label: "Weiß innen & außen", description: "RAL 9016" },
  { value: "WEISS_INNEN_FARBE_AUSSEN", label: "Weiß innen, Farbe außen" },
  { value: "FARBE_BEIDSEITIG", label: "Farbe innen & außen" },
];

export const colorChoiceOptions: (Option<ColorChoice> & { swatch?: string })[] = [
  { value: "GOLDEN_OAK", label: "Golden Oak", swatch: "#b98a4e" },
  { value: "NUSSBAUM", label: "Nussbaum", swatch: "#5c4033" },
  { value: "ANTHRAZITGRAU", label: "Anthrazit Grau", swatch: "#383e42" },
  { value: "SCHWARZ_MATT", label: "Schwarz Matt", swatch: "#1c1c1c" },
  { value: "QUARZGRAU", label: "Quarzgrau", swatch: "#6b6e70" },
  { value: "MAHAGONI", label: "Mahagoni", swatch: "#4e2a1e" },
  { value: "EICHE_DUNKEL", label: "Eiche Dunkel", swatch: "#4a3222" },
  {
    value: "ANDERE",
    label: "Andere Farbe",
    description: "Nicht dabei? Kurz beschreiben",
  },
];

export const shutterTypeOptions: Option<ShutterType>[] = [
  { value: "ROLLLADEN", label: "Rollladen" },
  { value: "JALOUSIE", label: "Jalousie" },
];

export const shutterControlOptions: Option<ShutterControl>[] = [
  { value: "MANUELL", label: "Manuell" },
  { value: "ELEKTRISCH", label: "Elektrisch" },
];

function toLabelMap<T extends string>(options: Option<T>[]): Record<T, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<T, string>;
}

export const labelMaps = {
  projectType: toLabelMap(projectTypeOptions),
  installation: toLabelMap(installationOptions),
  productType: toLabelMap(productTypeOptions),
  profileSystem: toLabelMap(profileSystemOptions),
  glazing: toLabelMap(glazingOptions),
  glassType: toLabelMap(glassTypeOptions),
  openingType: toLabelMap([...openingTypeOptionsFenster, ...openingTypeOptionsSchiebetuer]),
  colorMode: toLabelMap(colorModeOptions),
  colorChoice: toLabelMap(colorChoiceOptions),
  shutterType: toLabelMap(shutterTypeOptions),
  shutterControl: toLabelMap(shutterControlOptions),
} as const;
