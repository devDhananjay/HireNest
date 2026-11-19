import { createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

const PACKAGES: Record<string, { name: string; amount: number }> = {
  starter: { name: "Starter job pack", amount: 1499900 },
  growth: { name: "Growth hiring pack", amount: 4999900 },
  enterprise: { name: "Enterprise search retainer", amount: 14999900 },
};

export async function POST(request: Request) {
  const auth = await requireSession(["employer", "admin"]);
  if (auth.error) return auth.error;

  const body = (await request.json()) as { packageId?: string; companyId?: string };
  const pack = PACKAGES[body.packageId ?? "starter"] ?? PACKAGES.starter;
  const companyId = body.companyId || auth.session.companyId;
  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const invoice = await prisma.invoice.create({
      data: {
        companyId,
        amount: pack.amount,
        packageName: pack.name,
        status: "created",
        razorpayOrderId: `order_mock_${randomUUID().slice(0, 8)}`,
      },
    });
    return NextResponse.json({
      ok: true,
      mock: true,
      keyId: "rzp_test_mock",
      orderId: invoice.razorpayOrderId,
      amount: pack.amount,
      currency: "INR",
      invoiceId: invoice.id,
      message: "Razorpay keys unset — mock order created. Mark paid via webhook stub or admin.",
    });
  }

  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: pack.amount,
      currency: "INR",
      receipt: `hireora_${randomUUID().slice(0, 8)}`,
      notes: { packageName: pack.name, companyId },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: await res.text() }, { status: 502 });
  }
  const order = (await res.json()) as { id: string; amount: number; currency: string };
  const invoice = await prisma.invoice.create({
    data: {
      companyId,
      amount: order.amount,
      currency: order.currency,
      packageName: pack.name,
      status: "created",
      razorpayOrderId: order.id,
    },
  });

  // silence unused import if tree-shaken oddly
  void createHmac;

  return NextResponse.json({
    ok: true,
    mock: false,
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    invoiceId: invoice.id,
  });
}
