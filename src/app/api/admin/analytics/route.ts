import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  const isValid = await validateSession();
  if (!isValid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * DAY_MS);

  const [
    purchasesAll,
    purchasesLast30,
    purchasesPrev30,
    workshops,
    blogPosts,
    messages,
    unseenMessages,
    meetings,
    pendingMeetings,
    confirmedMeetings,
    recentPurchases,
    recentMessages,
    recentMeetings,
  ] = await Promise.all([
    prisma.purchase.findMany({
      where: { paymentStatus: "approved" },
      include: { workshop: { select: { id: true, title: true, price: true } } },
    }),
    prisma.purchase.count({
      where: { paymentStatus: "approved", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.purchase.count({
      where: {
        paymentStatus: "approved",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    prisma.workshop.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { seen: false } }),
    prisma.meeting.count(),
    prisma.meeting.count({ where: { status: "pending" } }),
    prisma.meeting.count({ where: { status: "confirmed" } }),
    prisma.purchase.findMany({
      where: { paymentStatus: "approved" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { workshop: { select: { title: true } } },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Revenue (sum of workshop prices in cents)
  const totalRevenueCents = purchasesAll.reduce(
    (sum, p) => sum + (p.workshop?.price ?? 0),
    0
  );
  const revenueLast30Cents = purchasesAll
    .filter((p) => p.createdAt >= thirtyDaysAgo)
    .reduce((sum, p) => sum + (p.workshop?.price ?? 0), 0);
  const revenuePrev30Cents = purchasesAll
    .filter((p) => p.createdAt >= sixtyDaysAgo && p.createdAt < thirtyDaysAgo)
    .reduce((sum, p) => sum + (p.workshop?.price ?? 0), 0);

  // Sales-per-day series (last 30 days, bucketed)
  const seriesMap = new Map<string, { date: string; sales: number; revenue: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    seriesMap.set(key, { date: key, sales: 0, revenue: 0 });
  }
  for (const p of purchasesAll) {
    if (p.createdAt < thirtyDaysAgo) continue;
    const key = p.createdAt.toISOString().slice(0, 10);
    const bucket = seriesMap.get(key);
    if (bucket) {
      bucket.sales += 1;
      bucket.revenue += (p.workshop?.price ?? 0) / 100;
    }
  }
  const salesSeries = Array.from(seriesMap.values());

  // Top workshops
  const topMap = new Map<string, { id: string; title: string; sales: number; revenue: number }>();
  for (const p of purchasesAll) {
    if (!p.workshop) continue;
    const k = p.workshop.id;
    const cur = topMap.get(k) || {
      id: p.workshop.id,
      title: p.workshop.title,
      sales: 0,
      revenue: 0,
    };
    cur.sales += 1;
    cur.revenue += (p.workshop.price ?? 0) / 100;
    topMap.set(k, cur);
  }
  const topWorkshops = Array.from(topMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return NextResponse.json({
    revenue: {
      totalCents: totalRevenueCents,
      last30Cents: revenueLast30Cents,
      prev30Cents: revenuePrev30Cents,
    },
    sales: {
      total: purchasesAll.length,
      last30: purchasesLast30,
      prev30: purchasesPrev30,
    },
    counts: {
      workshops,
      blogPosts,
      messages,
      unseenMessages,
      meetings,
      pendingMeetings,
      confirmedMeetings,
    },
    salesSeries,
    topWorkshops,
    recent: {
      purchases: recentPurchases.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        workshopTitle: p.workshop?.title ?? "—",
        createdAt: p.createdAt.toISOString(),
      })),
      messages: recentMessages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        seen: m.seen,
        createdAt: m.createdAt.toISOString(),
      })),
      meetings: recentMeetings.map((m) => ({
        id: m.id,
        name: m.name,
        date: m.date,
        time: m.time,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
      })),
    },
  });
}
