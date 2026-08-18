"use client";

import { useReducer } from "react";
import type {
  ConfigItemDraft,
  ContactInfo,
  Installation,
  ItemStepId,
  Phase,
  ProjectType,
} from "@/lib/types";
import { contactSchema, inquirySchema } from "@/lib/schema";
import { emptyDraft, getNextItemStep, getPrevItemStep } from "@/lib/wizardFlow";
import { StartStep } from "./steps/StartStep";
import { ItemStep } from "./steps/ItemStep";
import { OverviewStep } from "./steps/OverviewStep";
import { ContactStep } from "./steps/ContactStep";
import { SummaryStep } from "./steps/SummaryStep";
import { SuccessStep } from "./steps/SuccessStep";

interface WizardState {
  phase: Phase;
  itemStep: ItemStepId;
  projectType?: ProjectType;
  installation?: Installation;
  items: ConfigItemDraft[];
  draft: ConfigItemDraft;
  editingItemId: string | null;
  contact: Partial<ContactInfo>;
  contactErrors: Partial<Record<keyof ContactInfo, string>>;
  honeypot: string;
  submitting: boolean;
  submitError: string | null;
}

type Action =
  | { type: "SET_PROJECT_TYPE"; value: ProjectType }
  | { type: "SET_INSTALLATION"; value: Installation }
  | { type: "START_ITEMS" }
  | { type: "UPDATE_DRAFT"; patch: Partial<ConfigItemDraft> }
  | { type: "NEXT_ITEM_STEP" }
  | { type: "PREV_ITEM_STEP" }
  | { type: "ADD_ITEM" }
  | { type: "EDIT_ITEM"; id: string }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "GOTO_CONTACT" }
  | { type: "UPDATE_CONTACT"; patch: Partial<ContactInfo> }
  | { type: "SET_HONEYPOT"; value: string }
  | { type: "GOTO_SUMMARY" }
  | { type: "BACK_TO_OVERVIEW" }
  | { type: "BACK_TO_CONTACT" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string };

function initialState(): WizardState {
  return {
    phase: "start",
    itemStep: "productType",
    items: [],
    draft: emptyDraft(),
    editingItemId: null,
    contact: { firstName: "", lastName: "", email: "", phone: "", address: "", notes: "" },
    contactErrors: {},
    honeypot: "",
    submitting: false,
    submitError: null,
  };
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_PROJECT_TYPE":
      return { ...state, projectType: action.value };
    case "SET_INSTALLATION":
      return { ...state, installation: action.value };
    case "START_ITEMS":
      return { ...state, phase: "item", itemStep: "productType", draft: emptyDraft(), editingItemId: null };
    case "UPDATE_DRAFT":
      return { ...state, draft: { ...state.draft, ...action.patch } };
    case "NEXT_ITEM_STEP": {
      const next = getNextItemStep(state.itemStep, state.draft);
      if (next === "overview") {
        const items = state.editingItemId
          ? state.items.map((it) => (it.id === state.editingItemId ? state.draft : it))
          : [...state.items, state.draft];
        return { ...state, phase: "overview", items, editingItemId: null };
      }
      return { ...state, itemStep: next };
    }
    case "PREV_ITEM_STEP": {
      const prev = getPrevItemStep(state.itemStep, state.draft);
      if (prev === "start") {
        const cameFromOverview = state.items.length > 0 || state.editingItemId !== null;
        return cameFromOverview ? { ...state, phase: "overview" } : { ...state, phase: "start" };
      }
      return { ...state, itemStep: prev };
    }
    case "ADD_ITEM":
      return {
        ...state,
        phase: "item",
        itemStep: "productType",
        draft: emptyDraft(),
        editingItemId: null,
      };
    case "EDIT_ITEM": {
      const item = state.items.find((it) => it.id === action.id);
      if (!item) return state;
      return {
        ...state,
        phase: "item",
        itemStep: "productType",
        draft: { ...item },
        editingItemId: item.id,
      };
    }
    case "DELETE_ITEM":
      return { ...state, items: state.items.filter((it) => it.id !== action.id) };
    case "GOTO_CONTACT":
      return { ...state, phase: "contact" };
    case "UPDATE_CONTACT":
      return { ...state, contact: { ...state.contact, ...action.patch } };
    case "SET_HONEYPOT":
      return { ...state, honeypot: action.value };
    case "GOTO_SUMMARY": {
      const result = contactSchema.safeParse(state.contact);
      if (!result.success) {
        const errors: Partial<Record<keyof ContactInfo, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof ContactInfo;
          errors[key] = issue.message;
        }
        return { ...state, contactErrors: errors };
      }
      return { ...state, phase: "summary", contactErrors: {} };
    }
    case "BACK_TO_OVERVIEW":
      return { ...state, phase: "overview" };
    case "BACK_TO_CONTACT":
      return { ...state, phase: "contact" };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, phase: "success" };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.message };
  }
}

export function Wizard() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  async function handleSubmit() {
    const payload = {
      projectType: state.projectType,
      installation: state.installation,
      contact: state.contact,
      items: state.items,
      website: state.honeypot,
    };
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      dispatch({ type: "SUBMIT_ERROR", message: "Bitte überprüfen Sie Ihre Angaben." });
      return;
    }
    dispatch({ type: "SUBMIT_START" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("request-failed");
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch {
      dispatch({
        type: "SUBMIT_ERROR",
        message: "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      });
    }
  }

  if (state.phase === "start") {
    return (
      <StartStep
        projectType={state.projectType}
        installation={state.installation}
        onChangeProjectType={(value) => dispatch({ type: "SET_PROJECT_TYPE", value })}
        onChangeInstallation={(value) => dispatch({ type: "SET_INSTALLATION", value })}
        onNext={() => dispatch({ type: "START_ITEMS" })}
      />
    );
  }

  if (state.phase === "item") {
    const itemNumber = state.editingItemId
      ? state.items.findIndex((it) => it.id === state.editingItemId) + 1
      : state.items.length + 1;
    return (
      <ItemStep
        step={state.itemStep}
        draft={state.draft}
        itemNumber={itemNumber}
        update={(patch) => dispatch({ type: "UPDATE_DRAFT", patch })}
        onNext={() => dispatch({ type: "NEXT_ITEM_STEP" })}
        onBack={() => dispatch({ type: "PREV_ITEM_STEP" })}
      />
    );
  }

  if (state.phase === "overview") {
    return (
      <OverviewStep
        items={state.items}
        onAddItem={() => dispatch({ type: "ADD_ITEM" })}
        onEditItem={(id) => dispatch({ type: "EDIT_ITEM", id })}
        onDeleteItem={(id) => dispatch({ type: "DELETE_ITEM", id })}
        onContinue={() => dispatch({ type: "GOTO_CONTACT" })}
      />
    );
  }

  if (state.phase === "contact") {
    return (
      <ContactStep
        contact={state.contact}
        errors={state.contactErrors}
        update={(patch) => dispatch({ type: "UPDATE_CONTACT", patch })}
        honeypot={state.honeypot}
        onHoneypotChange={(value) => dispatch({ type: "SET_HONEYPOT", value })}
        onNext={() => dispatch({ type: "GOTO_SUMMARY" })}
        onBack={() => dispatch({ type: "BACK_TO_OVERVIEW" })}
      />
    );
  }

  if (state.phase === "summary") {
    return (
      <SummaryStep
        projectType={state.projectType}
        installation={state.installation}
        items={state.items}
        contact={state.contact}
        submitting={state.submitting}
        submitError={state.submitError}
        onSubmit={handleSubmit}
        onBack={() => dispatch({ type: "BACK_TO_CONTACT" })}
      />
    );
  }

  return <SuccessStep />;
}
