"use client";

import type { ConfigItemDraft } from "@/lib/types";
import { itemDetailLines, itemTitle } from "@/lib/summary";
import { PrimaryButton, SecondaryButton, StepLayout } from "@/components/wizard/ui";

export function OverviewStep({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onContinue,
}: {
  items: ConfigItemDraft[];
  onAddItem: () => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <StepLayout
      title="Ihre Elemente"
      subtitle={`${items.length} ${items.length === 1 ? "Element" : "Elemente"} konfiguriert`}
      footer={
        <div className="flex flex-col gap-3">
          <SecondaryButton onClick={onAddItem}>+ Weiteres Element hinzufügen</SecondaryButton>
          <PrimaryButton disabled={items.length === 0} onClick={onContinue}>
            Weiter zu den Kontaktdaten
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-[var(--radius)] border-2 border-[var(--border)] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-foreground">{itemTitle(item, index)}</h3>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEditItem(item.id)}
                  className="text-sm font-medium text-[var(--brand)] hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Löschen
                </button>
              </div>
            </div>
            <ul className="mt-2 space-y-0.5 text-sm text-[var(--muted)]">
              {itemDetailLines(item).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            Noch keine Elemente konfiguriert.
          </p>
        )}
      </div>
    </StepLayout>
  );
}
