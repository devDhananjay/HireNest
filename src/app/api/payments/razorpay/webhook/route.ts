import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

function verifySignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event?: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
  };

  const orderId = event.payload?.payment?.entity?.order_id;
  const paymentId = event.payload?.payment?.entity?.id;
  if (orderId && (event.event === "payment.captured" || event.event === "order.paid")) {
    await prisma.invoice.updateMany({
      where: { razorpayOrderId: orderId },
      data: {
        status: "paid",
        razorpayPaymentId: paymentId,
        paidAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
