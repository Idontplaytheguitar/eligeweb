import { NextRequest, NextResponse } from "next/server";

// DISABLED: Mercadopago webhook not ready for production yet
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Webhook not available" },
    { status: 503 }
  );
}

/* DISABLED CODE - Keep for future use
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getPayment } from "@/lib/mercadopago";
import { sendPurchaseEmail } from "@/lib/email";

export async function POST_DISABLED(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 });
    }

    const paymentData = await getPayment(paymentId.toString());

    if (paymentData.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    const workshopId = paymentData.external_reference;
    const payerEmail = paymentData.payer?.email || "";
    const payerName =
      `${paymentData.payer?.first_name || ""} ${paymentData.payer?.last_name || ""}`.trim() ||
      "Comprador";

    if (!workshopId) {
      return NextResponse.json({ error: "No workshop ID" }, { status: 400 });
    }

    const existingPurchase = await prisma.purchase.findUnique({
      where: { paymentId: paymentId.toString() },
    });

    if (existingPurchase) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const downloadToken = crypto.randomBytes(32).toString("hex");
    const downloadExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const purchase = await prisma.purchase.create({
      data: {
        workshopId,
        email: payerEmail,
        name: payerName,
        paymentId: paymentId.toString(),
        paymentStatus: paymentData.status,
        downloadToken,
        downloadExpires,
      },
      include: { workshop: true },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const downloadUrl = `${appUrl}/talleres/success?token=${downloadToken}`;

    try {
      await sendPurchaseEmail({
        to: payerEmail,
        name: payerName,
        workshopTitle: purchase.workshop.title,
        downloadUrl,
      });
    } catch (emailError) {
      console.error("Error sending purchase email:", emailError);
    }

    return NextResponse.json({ received: true, purchaseId: purchase.id });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
*/
