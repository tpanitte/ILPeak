import Link from "next/link";
import {
  Upload,
  UsersRound,
  Target,
  Home,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";

const STATS = [
  {
    label: "Coaches",
    value: "20",
    change: "5 groups, ~4 per group",
    icon: Users,
  },
  {
    label: "Participants",
    value: "40",
    change: "2 PPs per coach",
    icon: UsersRound,
  },
  {
    label: "This Week GCF",
    value: "78/200",
    change: "39% of target",
    icon: TrendingUp,
  },
  {
    label: "Home Intros",
    value: "6",
    change: "4 scheduled, 2 completed",
    icon: CalendarDays,
  },
];

const QUICK_ACTIONS = [
  {
    label: "Import Data",
    description: "Upload CSV files for Coaches and Participants.",
    href: "/admin/import",
    icon: Upload,
  },
  {
    label: "Manage Groups",
    description: "Organize coaches and PPs into groups with leaders.",
    href: "/admin/groups",
    icon: UsersRound,
  },
  {
    label: "Weekly Goals",
    description: "Set GCF and C/O targets, enter daily results.",
    href: "/coaching/weekly-goals",
    icon: Target,
  },
  {
    label: "Home Introduction",
    description: "Schedule and track 3-hour Home Intro sessions.",
    href: "/coaching/home-intro",
    icon: Home,
  },
  {
    label: "Programs",
    description: "Browse and manage ILP program configurations.",
    href: "/admin/programs",
    icon: BookOpen,
  },
];

const RECENT_ACTIVITY = [
  {
    action: "Goals Set",
    detail: "Coach Somchai set GCF target=5, C/O target=20 for 2 PPs",
    time: "1 hour ago",
  },
  {
    action: "Home Intro Scheduled",
    detail: "Areeya K. (PP001) - Feb 14, 10:00-13:00",
    time: "3 hours ago",
  },
  {
    action: "CSV Imported",
    detail: "20 coaches and 40 participants uploaded",
    time: "1 day ago",
  },
  {
    action: "Group Created",
    detail: "Epsilon Team - Leader: Tanawat H., 4 coaches, 8 PPs",
    time: "1 day ago",
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
          Overview of your ILPeak coaching and performance workspace.
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
                  <stat.icon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
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
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href} className="group">
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-card/80">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10">
                        <action.icon
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm">
                          {action.label}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {action.description}
                        </CardDescription>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity - 1 column */}
        <div>
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="pt-0">
              <ul className="divide-y divide-border" role="list">
                {RECENT_ACTIVITY.map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
                  >
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
