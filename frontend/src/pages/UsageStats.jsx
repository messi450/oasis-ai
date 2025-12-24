import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  DollarSign,
  Clock,
  Calendar
} from "lucide-react";

import { ChatService } from "@/api/chatService";

/* ======================================================
   CONFIG — replace with real API later
====================================================== */
const fetchUsageEvents = async () => {
  try {
    const data = await ChatService.getUsage();
    return data.map(item => ({
      id: item.id,
      timestamp: item.created_at,
      model: item.recommended_model,
      query: item.prompt,
      cost: item.estimated_cost || 0,
      responseTimeMs: item.response_time_ms || 0
    }));
  } catch (error) {
    console.error("Failed to fetch usage stats:", error);
    return [];
  }
};

/* ======================================================
   HELPERS
====================================================== */
const isThisMonth = (date) => {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

/* ======================================================
   COMPONENT
====================================================== */
export default function UsageStats() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  /* ======================================================
     CALCULATIONS (REAL)
  ====================================================== */
  const totalQueries = events.length;

  const monthlyQueries = events.filter((e) =>
    isThisMonth(new Date(e.timestamp))
  ).length;

  const avgResponseTime =
    events.length === 0
      ? 0
      : (
        events.reduce((sum, e) => sum + e.responseTimeMs, 0) /
        events.length /
        1000
      ).toFixed(2);

  const totalCost = events.reduce((sum, e) => sum + e.cost, 0).toFixed(2);

  const modelUsage = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.model] = (map[e.model] || 0) + 1;
    });

    const total = events.length || 1;

    return Object.entries(map).map(([name, count]) => ({
      name,
      percent: Math.round((count / total) * 100)
    }));
  }, [events]);

  const usageByMonth = useMemo(() => {
    const months = Array(12).fill(0);

    events.forEach((e) => {
      const m = new Date(e.timestamp).getMonth();
      months[m]++;
    });

    return months;
  }, [events]);

  /* ======================================================
     UI DATA
  ====================================================== */
  const statCards = [
    {
      title: "Total Queries",
      value: totalQueries,
      icon: MessageSquare
    },
    {
      title: "This Month",
      value: monthlyQueries,
      icon: Calendar
    },
    {
      title: "Avg. Response Time",
      value: `${avgResponseTime}s`,
      icon: Clock
    },
    {
      title: "Estimated Cost",
      value: `$${totalCost}`,
      icon: DollarSign
    }
  ];

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#64748B]">
        Loading usage statistics…
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">
            Usage Statistics
          </h1>
          <p className="text-sm text-[#64748B]">
            Real-time AI usage and performance metrics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white border border-[#E2E8F0] rounded-[16px] p-6"
              >
                <Icon className="w-5 h-5 mb-3 text-[#2563EB]" />
                <p className="text-sm text-[#64748B]">{stat.title}</p>
                <p className="text-2xl font-semibold text-[#0F172A]">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Usage Over Time */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Usage Over Time</h2>
          <div className="h-64 flex items-end gap-2">
            {usageByMonth.map((value, i) => (
              <div key={i} className="flex-1">
                <div
                  className="bg-[#2563EB] rounded-t-[8px]"
                  style={{ height: `${value * 5}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Most Used Models</h2>
          <div className="space-y-3">
            {modelUsage.map((model) => (
              <div key={model.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{model.name}</span>
                  <span>{model.percent}%</span>
                </div>
                <div className="h-2 bg-[#F6F7FB] rounded-full">
                  <div
                    className="h-full bg-[#2563EB] rounded-full"
                    style={{ width: `${model.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <table className="w-full text-sm">
            <tbody>
              {events.slice(0, 10).map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="py-2">{e.model}</td>
                  <td className="py-2 text-[#64748B]">{e.query}</td>
                  <td className="py-2 text-right">${e.cost?.toFixed(3) || "0.000"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="text-center py-8 text-[#64748B]">
              No activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
