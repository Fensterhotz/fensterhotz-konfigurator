"use client";

import type { ConfigItemDraft, ContactInfo, Installation, ProjectType } from "@/lib/types";
import { installationOptions, projectTypeOptions } from "@/lib/options";
import { itemDetailLines, itemTitle } from "@/lib/summary";
import { PrimaryButton, StepLayout } from "@/components/wizard/ui";

export function SummaryStep({
  projectType,
  installation,
  items,
  contact,
  submitting,
  submitError,
  onSubmit,
  onBack,
}: {
  projectType?: ProjectType;
  installation?: Installation;
  items: ConfigItemDraft[];
  contact: Partial<ContactInfo>;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <StepLayout
      title="Anfrage prüfen &amp; absenden"
      subtitle="Bitte kontrollieren Sie Ihre Angaben vor dem Absenden."
      onBack={onBack}
      footer={
        <div className="flex flex-col gap-2">
          {submitError && (
            <p className="text-center text-sm text-red-500">{submitError}</p>
          )}
          <PrimaryButton disabled={submitting} onClick={onSubmit}>
            {submitting ? "Wird gesendet..." : "Anfrage senden"}
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <section className="rounded-[var(--radius)] border-2 border-[var(--border)] bg-white p-4">
          <h3 className="mb-2 font-medium text-foreground">Bauvorhaben</h3>
          <p className="text-sm text-[var(--muted)]">
            {projectType && projectTypeOptions.find((o) => o.value === projectType)?.label}
            {" · "}
            {installation && installationOptions.find((o) => o.value === installation)?.label}
          </p>
        </section>

        {items.map((item, index) => (
          <section
            key={item.id}
            className="rounded-[var(--radius)] border-2 border-[var(--border)] bg-white p-4"
          >
            <h3 className="mb-2 font-medium text-foreground">{itemTitle(item, index)}</h3>
            <ul className="space-y-0.5 text-sm text-[var(--muted)]">
              {itemDetailLines(item).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-[var(--radius)] border-2 border-[var(--border)] bg-white p-4">
          <h3 className="mb-2 font-medium text-foreground">Kontaktdaten</h3>
          <p className="text-sm text-[var(--muted)]">
            {contact.firstName} {contact.lastName}
            <br />
            {contact.email}
            <br />
            {contact.phone}
            {contact.address && (
              <>
                <br />
                {contact.address}
              </>
            )}
            {contact.notes && (
              <>
                <br />
                Anmerkung: {contact.notes}
              </>
            )}
          </p>
        </section>
      </div>
    </StepLayout>
  );
}
