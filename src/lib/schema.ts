import { z } from "zod";

export const projectTypeSchema = z.enum(["NEUBAU", "SANIERUNG"]);
export const installationSchema = z.enum(["MIT_MONTAGE", "OHNE_MONTAGE"]);
export const productTypeSchema = z.enum(["FENSTER", "BALKONTUER", "HEBESCHIEBETUER"]);
export const profileSystemSchema = z.enum(["KUNSTSTOFF", "ALUMINIUM"]);
export const glazingSchema = z.enum(["ZWEIFACH", "DREIFACH"]);
export const glassTypeSchema = z.enum(["KLAR", "SICHERHEIT", "MILCHGLAS", "ANDERE"]);
export const openingTypeSchema = z.enum([
  "FEST",
  "DREHKIPP_LINKS",
  "DREHKIPP_RECHTS",
  "NUR_KIPP",
  "GLEITEND_LINKS",
  "GLEITEND_RECHTS",
]);
export const colorModeSchema = z.enum([
  "WEISS_BEIDSEITIG",
  "WEISS_INNEN_FARBE_AUSSEN",
  "FARBE_BEIDSEITIG",
]);
export const colorChoiceSchema = z.enum([
  "GOLDEN_OAK",
  "NUSSBAUM",
  "ANTHRAZITGRAU",
  "SCHWARZ_MATT",
  "QUARZGRAU",
  "MAHAGONI",
  "EICHE_DUNKEL",
  "ANDERE",
]);
export const shutterTypeSchema = z.enum(["ROLLLADEN", "JALOUSIE"]);
export const shutterControlSchema = z.enum(["MANUELL", "ELEKTRISCH"]);

export const configItemSchema = z
  .object({
    productType: productTypeSchema,
    profileSystem: profileSystemSchema,
    widthCm: z.number().int().min(20, "Mindestens 20 cm").max(1000, "Maximal 1000 cm"),
    heightCm: z.number().int().min(20, "Mindestens 20 cm").max(1000, "Maximal 1000 cm"),
    hasDivision: z.boolean(),
    divisionNote: z.string().max(500).optional(),
    glazing: glazingSchema,
    glassType: glassTypeSchema,
    glassNote: z.string().max(500).optional(),
    openingType: openingTypeSchema,
    colorMode: colorModeSchema,
    colorChoice: colorChoiceSchema.optional(),
    colorNote: z.string().max(500).optional(),
    hasShutter: z.boolean(),
    shutterType: shutterTypeSchema.optional(),
    shutterControl: shutterControlSchema.optional(),
    itemNote: z.string().max(1000).optional(),
  })
  .refine((item) => item.colorMode === "WEISS_BEIDSEITIG" || !!item.colorChoice, {
    message: "Bitte eine Farbe auswählen",
    path: ["colorChoice"],
  })
  .refine((item) => !item.hasShutter || !!item.shutterType, {
    message: "Bitte Rollladen-Typ auswählen",
    path: ["shutterType"],
  })
  .refine((item) => !item.hasShutter || !!item.shutterControl, {
    message: "Bitte Bedienung auswählen",
    path: ["shutterControl"],
  })
  .refine((item) => item.shutterType !== "JALOUSIE" || item.shutterControl === "ELEKTRISCH", {
    message: "Jalousie ist nur elektrisch verfügbar",
    path: ["shutterControl"],
  });

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Bitte Vorname angeben").max(100),
  lastName: z.string().trim().min(1, "Bitte Nachname angeben").max(100),
  email: z.string().trim().min(1, "Bitte E-Mail angeben").email("Ungültige E-Mail-Adresse"),
  phone: z.string().trim().min(3, "Bitte Telefonnummer angeben").max(50),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const inquirySchema = z.object({
  projectType: projectTypeSchema,
  installation: installationSchema,
  contact: contactSchema,
  items: z.array(configItemSchema).min(1, "Bitte mindestens ein Element konfigurieren"),
  // Honeypot: reales Nutzer lassen dieses Feld leer, Bots füllen es oft blind aus.
  website: z.string().optional(),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;
export type ConfigItemPayload = z.infer<typeof configItemSchema>;
