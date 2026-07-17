"use client";

import type { Installation, ProjectType } from "@/lib/types";
import { installationOptions, projectTypeOptions } from "@/lib/options";
import { PrimaryButton, StepLayout, ToggleGroup } from "@/components/wizard/ui";

export function StartStep({
  projectType,
  installation,
  onChangeProjectType,
  onChangeInstallation,
  onNext,
}: {
  projectType?: ProjectType;
  installation?: Installation;
  onChangeProjectType: (value: ProjectType) => void;
  onChangeInstallation: (value: Installation) => void;
  onNext: () => void;
}) {
  return (
    <StepLayout
      title="Fenster-Konfigurator"
      subtitle="Konfigurieren Sie in wenigen Schritten Ihre Fenster, Balkontüren oder Hebeschiebetüren für ein unverbindliches Erstangebot."
      progress={0}
      footer={
        <PrimaryButton disabled={!projectType || !installation} onClick={onNext}>
          Konfiguration starten
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-6">
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Bauvorhaben</span>
          <ToggleGroup
            options={projectTypeOptions}
            value={projectType}
            onChange={onChangeProjectType}
          />
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Montage</span>
          <ToggleGroup
            options={installationOptions}
            value={installation}
            onChange={onChangeInstallation}
          />
        </div>
      </div>
    </StepLayout>
  );
}
