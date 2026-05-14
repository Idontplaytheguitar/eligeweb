"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  GraduationCap,
  FileText,
  Mail,
  Calendar,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Analytics {
  revenue: { totalCents: number; last30Cents: number; prev30Cents: number };
  sales: { total: number; last30: number; prev30: number };
  counts: {
    workshops: number;
    blogPosts: number;
    messages: number;
    unseenMessages: number;
    meetings: number;
    pendingMeetings: number;
    confirmedMeetings: number;
  };
  salesSeries: { date: string; sales: number; revenue: number }[];
  topWorkshops: { id: string; title: string; sales: number; revenue: number }[];
  recent: {
    purchases: { id: string; name: string; email: string; workshopTitle: string; createdAt: string }[];
    messages: { id: string; name: string; email: string; seen: boolean; createdAt: string }[];
    meetings: {
      id: string;
      name: string;
      date: string | null;
      time: string | null;
      status: string;
      createdAt: string;
    }[];
  };
}

function formatARS(cents: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function pctChange(curr: number, prev: number): { value: number; positive: boolean | null } {
  if (prev === 0 && curr === 0) return { value: 0, positive: null };
  if (prev === 0) return { value: 100, positive: true };
  const v = ((curr - prev) / prev) * 100;
  return { value: Math.abs(Math.round(v)), positive: v >= 0 };
}

function Delta({ change }: { change: { value: number; positive: boolean | null } }) {
  if (change.positive === null) {
    return (
      <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
        <Minus className="h-3 w-3" />
        sin datos previos
      </span>
    );
  }
  const Icon = change.positive ? TrendingUp : TrendingDown;
  const color = change.positive ? "text-green-600" : "text-red-600";
  return (
    <span className={`inline-flex items-center text-xs gap-1 ${color}`}>
      <Icon className="h-3 w-3" />
      {change.value}% vs 30 días previos
    </span>
  );
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const authRes = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push("/admin");
        return;
      }
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d?.error || `HTTP ${res.status}`);
        return;
      }
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive">{error || "Sin datos"}</p>
            <Button asChild>
              <Link href="/admin">Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenueChange = pctChange(data.revenue.last30Cents, data.revenue.prev30Cents);
  const salesChange = pctChange(data.sales.last30, data.sales.prev30);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Estadísticas</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            label="Ingresos (30 días)"
            value={formatARS(data.revenue.last30Cents)}
            sub={<Delta change={revenueChange} />}
          />
          <KpiCard
            icon={<ShoppingCart className="h-5 w-5 text-primary" />}
            label="Ventas (30 días)"
            value={String(data.sales.last30)}
            sub={<Delta change={salesChange} />}
          />
          <KpiCard
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            label="Ingresos totales"
            value={formatARS(data.revenue.totalCents)}
            sub={
              <span className="text-xs text-muted-foreground">
                {data.sales.total} venta{data.sales.total === 1 ? "" : "s"} histórica
                {data.sales.total === 1 ? "" : "s"}
              </span>
            }
          />
          <KpiCard
            icon={<Mail className="h-5 w-5 text-primary" />}
            label="Consultas sin leer"
            value={String(data.counts.unseenMessages)}
            sub={
              <span className="text-xs text-muted-foreground">
                {data.counts.messages} en total
              </span>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Ventas últimos 30 días</CardTitle>
              <CardDescription>Ingresos diarios en ARS</CardDescription>
            </CardHeader>
            <CardContent>
              {data.salesSeries.every((d) => d.sales === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Todavía no hay ventas en los últimos 30 días.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.salesSeries}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v: string) => v.slice(5)}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number, name: string) =>
                        name === "revenue"
                          ? [
                              new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0,
                              }).format(value),
                              "Ingresos",
                            ]
                          : [value, "Ventas"]
                      }
                      labelFormatter={(label: string) => `Día ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Talleres más vendidos</CardTitle>
              <CardDescription>Top 5 históricos</CardDescription>
            </CardHeader>
            <CardContent>
              {data.topWorkshops.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  Sin ventas todavía.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.topWorkshops} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) =>
                        name === "revenue"
                          ? [formatARS(value * 100), "Ingresos"]
                          : [value, "Ventas"]
                      }
                    />
                    <Bar dataKey="sales" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniStat
            icon={<GraduationCap className="h-4 w-4" />}
            label="Talleres"
            value={data.counts.workshops}
            href="/admin/talleres"
          />
          <MiniStat
            icon={<FileText className="h-4 w-4" />}
            label="Artículos de blog"
            value={data.counts.blogPosts}
            href="/admin/blog"
          />
          <MiniStat
            icon={<Calendar className="h-4 w-4" />}
            label="Reuniones agendadas"
            value={data.counts.meetings}
            href="/admin/agenda"
            extra={`${data.counts.pendingMeetings} pendiente${data.counts.pendingMeetings === 1 ? "" : "s"}`}
          />
          <MiniStat
            icon={<Mail className="h-4 w-4" />}
            label="Consultas totales"
            value={data.counts.messages}
            href="/admin/mensajes"
            extra={`${data.counts.unseenMessages} sin leer`}
          />
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimas ventas</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent.purchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin ventas todavía.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recent.purchases.map((p) => (
                    <li key={p.id} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                      <p className="font-medium truncate">{p.workshopTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.name} · {p.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleString("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimas consultas</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent.messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin consultas todavía.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recent.messages.map((m) => (
                    <li key={m.id} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{m.name}</p>
                        {!m.seen && (
                          <Badge variant="default" className="text-xs">
                            nueva
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.createdAt).toLocaleString("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimas reuniones</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recent.meetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin reuniones todavía.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recent.meetings.map((m) => (
                    <li key={m.id} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{m.name}</p>
                        <Badge
                          variant={m.status === "confirmed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {m.status}
                        </Badge>
                      </div>
                      {m.date && (
                        <p className="text-xs text-muted-foreground">
                          {m.date} {m.time ? `· ${m.time}` : ""}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Creada{" "}
                        {new Date(m.createdAt).toLocaleString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {sub}
      </CardContent>
    </Card>
  );
}

function MiniStat({
  icon,
  label,
  value,
  href,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
  extra?: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            {icon}
            {label}
          </div>
          <p className="text-xl font-bold mt-1">{value}</p>
          {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
