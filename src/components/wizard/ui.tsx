"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
      <motion.div
        className="h-full rounded-full bg-[var(--brand)]"
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

export function StepLayout({
  title,
  subtitle,
  progress,
  onBack,
  children,
  footer,
  preview,
}: {
  title: string;
  subtitle?: string;
  progress?: number;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  preview?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-6">
      {progress !== undefined && (
        <div className="mb-6">
          <ProgressBar progress={progress} />
        </div>
      )}
      {preview}
      <div className="mb-6 flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Zurück"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
}

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  swatch,
}: {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[var(--radius)] border-2 px-4 py-4 text-left transition ${
        selected
          ? "border-[var(--brand)] bg-[var(--brand-light)]"
          : "border-[var(--border)] bg-white hover:border-[var(--brand)]/50"
      }`}
    >
      {swatch && (
        <span
          className="h-8 w-8 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: swatch }}
        />
      )}
      <span className="flex-1">
        <span className="block font-medium text-foreground">{label}</span>
        {description && (
          <span className="block text-sm text-[var(--muted)]">{description}</span>
        )}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[var(--border)]"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[var(--radius)] bg-[var(--brand)] px-6 py-3.5 text-center font-medium text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-[var(--radius)] border-2 border-[var(--border)] bg-white px-6 py-3.5 text-center font-medium text-foreground transition hover:border-[var(--brand)]"
    >
      {children}
    </button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[var(--radius)] border-2 px-4 py-3 outline-none transition focus:border-[var(--brand)] ${
          error ? "border-red-400" : "border-[var(--border)]"
        }`}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-[var(--radius)] border-2 border-[var(--border)] px-4 py-3 outline-none transition focus:border-[var(--brand)]"
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label} (cm)</span>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className={`w-full rounded-[var(--radius)] border-2 px-4 py-3 outline-none transition focus:border-[var(--brand)] ${
          error ? "border-red-400" : "border-[var(--border)]"
        }`}
      />
      {error && <span className="mt-1 block text-sm text-red-500">{error}</span>}
    </label>
  );
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-[var(--radius)] border-2 px-4 py-3 font-medium transition ${
            value === opt.value
              ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]"
              : "border-[var(--border)] bg-white text-foreground hover:border-[var(--brand)]/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
