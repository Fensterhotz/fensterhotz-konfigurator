"use client";

import type { ConfigItemDraft, ItemStepId } from "@/lib/types";
import {
  colorChoiceOptions,
  colorModeOptions,
  getOpeningTypeOptions,
  glassTypeOptions,
  glazingOptions,
  productTypeOptions,
  profileSystemOptions,
  shutterControlOptions,
  shutterTypeOptions,
} from "@/lib/options";
import { isItemStepValid, itemStepProgress } from "@/lib/wizardFlow";
import {
  NumberField,
  OptionCard,
  PrimaryButton,
  StepLayout,
  TextAreaField,
  ToggleGroup,
} from "@/components/wizard/ui";
import { WindowPreview } from "@/components/wizard/WindowPreview";

export function ItemStep({
  step,
  draft,
  itemNumber,
  update,
  onNext,
  onBack,
}: {
  step: ItemStepId;
  draft: ConfigItemDraft;
  itemNumber: number;
  update: (patch: Partial<ConfigItemDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const progress = itemStepProgress(step);
  const eyebrow = `Element ${itemNumber}`;

  switch (step) {
    case "productType":
      return (
        <StepLayout title="Was möchten Sie konfigurieren?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            {productTypeOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={draft.productType === opt.value}
                onClick={() => {
                  update({ productType: opt.value });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "profileSystem":
      return (
        <StepLayout title="Welches Profil bevorzugen Sie?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            {profileSystemOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={draft.profileSystem === opt.value}
                onClick={() => {
                  update({ profileSystem: opt.value });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "dimensions":
      return (
        <StepLayout
          title="Wie groß soll das Element sein?"
          subtitle={eyebrow}
          progress={progress}
          onBack={onBack}
          preview={<WindowPreview draft={draft} />}
          footer={
            <PrimaryButton disabled={!isItemStepValid(step, draft)} onClick={onNext}>
              Weiter
            </PrimaryButton>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <NumberField
                label="Breite"
                value={draft.widthCm}
                onChange={(v) => update({ widthCm: v })}
              />
              <NumberField
                label="Höhe"
                value={draft.heightCm}
                onChange={(v) => update({ heightCm: v })}
              />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Teilung gewünscht?
              </span>
              <ToggleGroup
                options={[
                  { value: "nein", label: "Nein" },
                  { value: "ja", label: "Ja" },
                ]}
                value={draft.hasDivision ? "ja" : "nein"}
                onChange={(v) => update({ hasDivision: v === "ja" })}
              />
            </div>
            {draft.hasDivision && (
              <TextAreaField
                label="Anmerkung zur Teilung (optional)"
                value={draft.divisionNote ?? ""}
                onChange={(v) => update({ divisionNote: v })}
                placeholder="z.B. waagrechte Sprosse mittig"
              />
            )}
          </div>
        </StepLayout>
      );

    case "glazing":
      return (
        <StepLayout title="Welche Verglasung?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            {glazingOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={draft.glazing === opt.value}
                onClick={() => {
                  update({ glazing: opt.value });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "glassType":
      return (
        <StepLayout
          title="Welche Glasart?"
          subtitle={eyebrow}
          progress={progress}
          onBack={onBack}
          preview={<WindowPreview draft={draft} />}
          footer={
            draft.glassType === "ANDERE" ? (
              <PrimaryButton onClick={onNext}>Weiter</PrimaryButton>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {glassTypeOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={draft.glassType === opt.value}
                  onClick={() => {
                    update({ glassType: opt.value });
                    if (opt.value !== "ANDERE") onNext();
                  }}
                />
              ))}
            </div>
            {draft.glassType === "ANDERE" && (
              <TextAreaField
                label="Welches Glas wünschen Sie sich? (optional)"
                value={draft.glassNote ?? ""}
                onChange={(v) => update({ glassNote: v })}
                placeholder="z.B. Ornamentglas, Gussglas, Bezeichnung"
              />
            )}
          </div>
        </StepLayout>
      );

    case "openingType":
      return (
        <StepLayout title="Öffnungsrichtung?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            {getOpeningTypeOptions(draft.productType).map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={draft.openingType === opt.value}
                onClick={() => {
                  update({ openingType: opt.value });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "colorMode":
      return (
        <StepLayout title="Welche Farbe?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            {colorModeOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={draft.colorMode === opt.value}
                onClick={() => {
                  update({
                    colorMode: opt.value,
                    colorChoice: opt.value === "WEISS_BEIDSEITIG" ? undefined : draft.colorChoice,
                  });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "colorChoice":
      return (
        <StepLayout
          title={
            draft.colorMode === "WEISS_INNEN_FARBE_AUSSEN"
              ? "Farbe außen auswählen"
              : "Farbe auswählen"
          }
          subtitle={eyebrow}
          progress={progress}
          onBack={onBack}
          preview={<WindowPreview draft={draft} />}
          footer={
            draft.colorChoice === "ANDERE" ? (
              <PrimaryButton onClick={onNext}>Weiter</PrimaryButton>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {colorChoiceOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  swatch={opt.swatch}
                  selected={draft.colorChoice === opt.value}
                  onClick={() => {
                    update({ colorChoice: opt.value });
                    if (opt.value !== "ANDERE") onNext();
                  }}
                />
              ))}
            </div>
            {draft.colorChoice === "ANDERE" && (
              <TextAreaField
                label="Welche Farbe wünschen Sie sich? (optional)"
                value={draft.colorNote ?? ""}
                onChange={(v) => update({ colorNote: v })}
                placeholder="z.B. RAL-Nummer, Dekorname oder Beschreibung"
              />
            )}
          </div>
        </StepLayout>
      );

    case "shutter":
      return (
        <StepLayout title="Rollladen oder Jalousie?" subtitle={eyebrow} progress={progress} onBack={onBack}
          preview={<WindowPreview draft={draft} />}>
          <div className="flex flex-col gap-3">
            <OptionCard
              label="Ohne"
              selected={draft.hasShutter === false}
              onClick={() => {
                update({ hasShutter: false, shutterType: undefined, shutterControl: undefined });
                onNext();
              }}
            />
            {shutterTypeOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={draft.hasShutter === true && draft.shutterType === opt.value}
                onClick={() => {
                  update({
                    hasShutter: true,
                    shutterType: opt.value,
                    shutterControl: opt.value === "JALOUSIE" ? "ELEKTRISCH" : undefined,
                  });
                  onNext();
                }}
              />
            ))}
          </div>
        </StepLayout>
      );

    case "shutterDetails":
      return (
        <StepLayout
          title="Wie möchten Sie den Rollladen bedienen?"
          subtitle={eyebrow}
          progress={progress}
          onBack={onBack}
          preview={<WindowPreview draft={draft} />}
          footer={
            <PrimaryButton disabled={!isItemStepValid(step, draft)} onClick={onNext}>
              Weiter
            </PrimaryButton>
          }
        >
          <ToggleGroup
            options={shutterControlOptions}
            value={draft.shutterControl}
            onChange={(v) => update({ shutterControl: v })}
          />
        </StepLayout>
      );

    case "itemNote":
      return (
        <StepLayout
          title="Sonstige Anmerkung zu diesem Element?"
          subtitle={eyebrow}
          progress={progress}
          onBack={onBack}
          preview={<WindowPreview draft={draft} />}
          footer={<PrimaryButton onClick={onNext}>Element speichern</PrimaryButton>}
        >
          <TextAreaField
            label="Anmerkung (optional)"
            value={draft.itemNote ?? ""}
            onChange={(v) => update({ itemNote: v })}
            placeholder="Individuelle Wünsche, Besonderheiten, ..."
          />
        </StepLayout>
      );
  }
}
