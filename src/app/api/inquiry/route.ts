import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/schema";
import { sendInquiryEmails } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { projectType, installation, contact, items } = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: {
      projectType,
      installation,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || null,
      notes: contact.notes || null,
      items: {
        create: items.map((item) => ({
          productType: item.productType,
          profileSystem: item.profileSystem,
          widthMm: item.widthCm * 10,
          heightMm: item.heightCm * 10,
          hasDivision: item.hasDivision,
          divisionNote: item.divisionNote || null,
          glazing: item.glazing,
          glassType: item.glassType,
          glassNote: item.glassNote || null,
          openingType: item.openingType,
          colorMode: item.colorMode,
          colorChoice: item.colorChoice || null,
          colorNote: item.colorNote || null,
          hasShutter: item.hasShutter,
          shutterType: item.shutterType || null,
          shutterControl: item.shutterControl || null,
          itemNote: item.itemNote || null,
        })),
      },
    },
    include: { items: true },
  });

  try {
    await sendInquiryEmails(inquiry);
  } catch (err) {
    console.error("Konnte Bestätigungs-E-Mails nicht senden:", err);
  }

  return NextResponse.json({ id: inquiry.id });
}
