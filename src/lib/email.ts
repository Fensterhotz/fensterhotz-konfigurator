import { Resend } from "resend";
import { labelMaps } from "./options";
import type { Inquiry, ConfigItem } from "@prisma/client";

function lines(item: ConfigItem): string[] {
  const out: string[] = [];
  out.push(labelMaps.productType[item.productType]);
  out.push(labelMaps.profileSystem[item.profileSystem]);
  out.push(`${item.widthMm / 10} × ${item.heightMm / 10} cm`);
  if (item.hasDivision) out.push(`Mit Teilung${item.divisionNote ? `: ${item.divisionNote}` : ""}`);
  out.push(labelMaps.glazing[item.glazing]);
  out.push(labelMaps.glassType[item.glassType]);
  if (item.glassType === "ANDERE" && item.glassNote) {
    out.push(`Glaswunsch: ${item.glassNote}`);
  }
  out.push(labelMaps.openingType[item.openingType]);
  const colorLabel =
    item.colorMode === "WEISS_BEIDSEITIG"
      ? labelMaps.colorMode[item.colorMode]
      : `${labelMaps.colorMode[item.colorMode]}${
          item.colorChoice ? `: ${labelMaps.colorChoice[item.colorChoice]}` : ""
        }`;
  out.push(colorLabel);
  if (item.colorChoice === "ANDERE" && item.colorNote) {
    out.push(`Farbwunsch: ${item.colorNote}`);
  }
  if (item.hasShutter) {
    const t = item.shutterType ? labelMaps.shutterType[item.shutterType] : "";
    const c = item.shutterControl ? labelMaps.shutterControl[item.shutterControl] : "";
    out.push(`${t} (${c})`.trim());
  } else {
    out.push("Ohne Rollladen/Jalousie");
  }
  if (item.itemNote) out.push(`Anmerkung: ${item.itemNote}`);
  return out;
}

function itemsHtml(items: ConfigItem[]): string {
  return items
    .map(
      (item, index) => `
      <div style="margin-bottom:16px;padding:12px 16px;border:1px solid #e4e2dd;border-radius:10px;">
        <div style="font-weight:600;margin-bottom:6px;">${index + 1}. ${labelMaps.productType[item.productType]}</div>
        <div style="font-size:14px;color:#444;">${lines(item).join("<br/>")}</div>
      </div>`,
    )
    .join("");
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY ist nicht gesetzt");
  return new Resend(apiKey);
}

export async function sendInquiryEmails(inquiry: Inquiry & { items: ConfigItem[] }) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const notifyTo = process.env.INQUIRY_NOTIFICATION_EMAIL ?? "info@fensterhotz.de";

  const projectLine = `${labelMaps.projectType[inquiry.projectType]} · ${labelMaps.installation[inquiry.installation]}`;

  await resend.emails.send({
    from: `Fenster-Konfigurator <${from}>`,
    to: notifyTo,
    replyTo: inquiry.email,
    subject: `Neue Konfigurator-Anfrage von ${inquiry.firstName} ${inquiry.lastName}`,
    html: `
      <h2>Neue Anfrage über den Fenster-Konfigurator</h2>
      <p><strong>${projectLine}</strong></p>
      <h3>Kontaktdaten</h3>
      <p>
        ${inquiry.firstName} ${inquiry.lastName}<br/>
        ${inquiry.email}<br/>
        ${inquiry.phone}<br/>
        ${inquiry.address ? `${inquiry.address}<br/>` : ""}
        ${inquiry.notes ? `Anmerkung: ${inquiry.notes}` : ""}
      </p>
      <h3>Konfigurierte Elemente</h3>
      ${itemsHtml(inquiry.items)}
    `,
  });

  await resend.emails.send({
    from: `Hotz Fenster & Türen <${from}>`,
    to: inquiry.email,
    subject: "Ihre Anfrage bei Hotz Fenster & Türen",
    html: `
      <h2>Vielen Dank für Ihre Anfrage, ${inquiry.firstName}!</h2>
      <p>Wir haben Ihre Konfiguration erhalten und melden uns in Kürze mit einem ersten
      unverbindlichen Angebot bei Ihnen.</p>
      <p><strong>${projectLine}</strong></p>
      <h3>Ihre Konfiguration</h3>
      ${itemsHtml(inquiry.items)}
      <p style="margin-top:24px;color:#6b6b68;font-size:13px;">
        Hotz Fenster &amp; Türen · info@fensterhotz.de
      </p>
    `,
  });
}
