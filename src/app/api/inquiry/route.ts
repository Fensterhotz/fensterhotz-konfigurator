import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/schema";
import { sendInquiryEmails } from "@/lib/email";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 3;

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Honeypot: verstecktes Feld, das nur Bots ausfüllen. Anfrage wird still
  // verworfen, aber mit Erfolg quittiert, um Bots nicht zu tippen zu geben.
  if (parsed.data.website) {
    return NextResponse.json({ id: "ok" });
  }

  const ipAddress = getClientIp(request);

  if (ipAddress) {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
    const recentCount = await prisma.inquiry.count({
      where: { ipAddress, createdAt: { gte: since } },
    });
    if (recentCount >= RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
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
      ipAddress,
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
