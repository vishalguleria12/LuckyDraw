import AdminLayout from "./AdminLayout";
import { useAllDraws, useAllPrizes } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Trophy, Users, Clock } from "lucide-react";

export default function AdminOverview() {
  const { data: draws } = useAllDraws();
  const { data: prizes } = useAllPrizes();

  const activeDraws = draws?.filter((d) => d.status === "active").length || 0;
  const completedDraws = draws?.filter((d) => d.status === "completed").length || 0;
  const pendingPrizes = prizes?.filter((p) => p.status === "pending").length || 0;
  const deliveredPrizes = prizes?.filter((p) => p.status === "delivered").length || 0;

  const stats = [
    { label: "Active Draws", value: activeDraws, icon: Clock, color: "text-green-500" },
    { label: "Completed Draws", value: completedDraws, icon: Gift, color: "text-blue-500" },
    { label: "Pending Prizes", value: pendingPrizes, icon: Trophy, color: "text-yellow-500" },
    { label: "Delivered Prizes", value: deliveredPrizes, icon: Trophy, color: "text-primary" },
  ];

  return (
    <AdminLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {draws?.slice(0, 5).map((draw) => (
                <div key={draw.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{draw.prize_emoji}</span>
                    <div>
                      <p className="font-medium">{draw.prize_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {draw.current_entries}/{draw.max_entries} entries
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    draw.status === "active" 
                      ? "bg-green-500/20 text-green-500" 
                      : draw.status === "completed"
                      ? "bg-blue-500/20 text-blue-500"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {draw.status}
                  </span>
                </div>
              ))}
              {!draws?.length && (
                <p className="text-muted-foreground text-center py-4">No draws yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Prizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prizes?.filter((p) => p.status === "pending").slice(0, 5).map((prize) => (
                <div key={prize.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{prize.prize_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Winner: {(prize as any).profiles?.username || (prize as any).profiles?.email}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                    Pending
                  </span>
                </div>
              ))}
              {!prizes?.filter((p) => p.status === "pending").length && (
                <p className="text-muted-foreground text-center py-4">No pending prizes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
