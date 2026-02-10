import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  Upload,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATS = [
  {
    label: "Active Programs",
    value: "12",
    change: "+2 this month",
    icon: BookOpen,
    trend: "up" as const,
  },
  {
    label: "Total Participants",
    value: "248",
    change: "+18 this week",
    icon: Users,
    trend: "up" as const,
  },
  {
    label: "Avg. Performance",
    value: "87%",
    change: "+3.2% vs last cycle",
    icon: TrendingUp,
    trend: "up" as const,
  },
  {
    label: "Pending Imports",
    value: "3",
    change: "Last import 2h ago",
    icon: Clock,
    trend: "neutral" as const,
  },
];

const QUICK_ACTIONS = [
  {
    label: "Create Program",
    description: "Set up a new ILP series with sessions and participants.",
    href: "/admin/programs/new",
    icon: Plus,
  },
  {
    label: "View Programs",
    description: "Browse and manage existing program configurations.",
    href: "/admin/programs",
    icon: BookOpen,
  },
  {
    label: "Performance Tracker",
    description: "Review daily performance metrics and participant data.",
    href: "/performance",
    icon: BarChart3,
  },
  {
    label: "Import Data",
    description: "Upload CSV files for bulk performance data ingestion.",
    href: "/performance/import",
    icon: Upload,
  },
];

const RECENT_ACTIVITY = [
  {
    action: "Program Created",
    detail: "Leadership Essentials Q1 2026",
    time: "2 hours ago",
  },
  {
    action: "Data Imported",
    detail: "248 performance records for Cycle 4",
    time: "5 hours ago",
  },
  {
    action: "User Synced",
    detail: "dev@ilpeak.test joined as ADMIN",
    time: "1 day ago",
  },
  {
    action: "Program Updated",
    detail: "Advanced Analytics Series - 3 sessions added",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your ILPeak program management workspace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {stat.value}
              </CardTitle>
              <CardAction>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="size-4 text-primary" aria-hidden="true" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions - 2 columns */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href} className="group">
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-card/80">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10">
                        <action.icon className="size-4 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">
                          {action.label}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity - 1 column */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="pt-0">
              <ul className="divide-y divide-border" role="list">
                {RECENT_ACTIVITY.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {item.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
