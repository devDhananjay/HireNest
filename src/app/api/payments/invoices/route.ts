import { NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const auth = await requireSession(["employer", "admin"]);
  if (auth.error) return auth.error;

  const where =
    auth.session.role === "admin"
      ? {}
      : { companyId: auth.session.companyId ?? "__none__" };

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { issuedAt: "desc" },
  });
  return NextResponse.json({ invoices });
}
