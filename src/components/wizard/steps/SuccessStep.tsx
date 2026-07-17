"use client";

export function SuccessStep() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-light)] text-3xl text-[var(--brand)]">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Vielen Dank für Ihre Anfrage!</h1>
      <p className="mt-3 max-w-md text-[var(--muted)]">
        Wir haben Ihre Konfiguration erhalten und melden uns in Kürze mit einem ersten
        unverbindlichen Angebot bei Ihnen.
      </p>
      <a
        href="https://www.fensterhotz.com"
        className="mt-8 inline-block rounded-[var(--radius)] bg-[var(--brand)] px-6 py-3 font-medium text-white transition hover:bg-[var(--brand-dark)]"
      >
        Zurück zur Webseite
      </a>
    </div>
  );
}
