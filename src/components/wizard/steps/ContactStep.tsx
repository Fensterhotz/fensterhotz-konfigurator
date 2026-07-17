"use client";

import type { ContactInfo } from "@/lib/types";
import { PrimaryButton, StepLayout, TextAreaField, TextField } from "@/components/wizard/ui";

export function ContactStep({
  contact,
  errors,
  update,
  onNext,
  onBack,
}: {
  contact: Partial<ContactInfo>;
  errors: Partial<Record<keyof ContactInfo, string>>;
  update: (patch: Partial<ContactInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <StepLayout
      title="Ihre Kontaktdaten"
      subtitle="Damit wir Ihnen Ihr erstes Angebot zusenden können."
      onBack={onBack}
      footer={<PrimaryButton onClick={onNext}>Weiter zur Übersicht</PrimaryButton>}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Vorname"
            required
            value={contact.firstName ?? ""}
            onChange={(v) => update({ firstName: v })}
            error={errors.firstName}
          />
          <TextField
            label="Nachname"
            required
            value={contact.lastName ?? ""}
            onChange={(v) => update({ lastName: v })}
            error={errors.lastName}
          />
        </div>
        <TextField
          label="E-Mail"
          type="email"
          required
          value={contact.email ?? ""}
          onChange={(v) => update({ email: v })}
          error={errors.email}
        />
        <TextField
          label="Telefon"
          type="tel"
          required
          value={contact.phone ?? ""}
          onChange={(v) => update({ phone: v })}
          error={errors.phone}
        />
        <TextField
          label="Adresse (optional)"
          value={contact.address ?? ""}
          onChange={(v) => update({ address: v })}
          placeholder="Straße, PLZ, Ort"
        />
        <TextAreaField
          label="Allgemeine Anmerkung (optional)"
          value={contact.notes ?? ""}
          onChange={(v) => update({ notes: v })}
          placeholder="Weitere Wünsche zur gesamten Anfrage"
        />
      </div>
    </StepLayout>
  );
}
