import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Clock,
  Calendar
} from "lucide-react";

import { ChatService } from "@/api/chatService";

/* ======================================================
   CONFIG — replace with real API later
====================================================== */
const generateRealReason = (model, query) => {
  const q = query.toLowerCase();

  if (q.includes('code') || q.includes('debug') || q.includes('python') || q.includes('react')) {
    if (model.includes('o3') || model.includes('o1')) return "Exceptional deep reasoning for logic & complex bugs.";
    if (model.includes('Claude')) return "Precise syntax & superior coding nuance.";
    return "Balanced performance for technical implementation.";
  }

  if (q.includes('copy') || q.includes('write') || q.includes('blog') || q.includes('marketing')) {
    if (model.includes('GPT-4o')) return "High-speed creative generation & brand alignment.";
    if (model.includes('Claude')) return "Natural flow & sophisticated writing style.";
    return "Optimized for content creation tasks.";
  }

  if (q.includes('data') || q.includes('analyze') || q.includes('sales')) {
    if (model.includes('Gemini')) return "Excellent multi-document context & analytical depth.";
    if (model.includes('GPT')) return "Strong structured data analysis & pattern recognition.";
    return "Selected for high-precision analytical tasks.";
  }

  if (model.includes('GPT-4o')) return "Most efficient all-rounder for general intent.";
  if (model.includes('o3')) return "Advanced reasoning selected for complex task structure.";

  return "Optimized for your specific task requirements.";
};

const fetchUsageEvents = async () => {
  try {
    const data = await ChatService.getUsage();
    return data.map(item => ({
      id: item.id,
      timestamp: item.created_at,
      model: item.recommended_model,
      query: item.prompt,
      reason: item.recommendation_reason && item.recommendation_reason !== "Best match for your query"
        ? item.recommendation_reason
        : generateRealReason(item.recommended_model, item.prompt),
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

  const modelUsage = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.model] = (map[e.model] || 0) + 1;
    });

    const total = events.length || 1;

    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [events]);

  const usageByMonth = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = Array(12).fill(0).map((_, i) => ({
      name: monthNames[i],
      value: 0
    }));

    events.forEach((e) => {
      const m = new Date(e.timestamp).getMonth();
      months[m].value++;
    });

    return months;
  }, [events]);

  const maxUsage = Math.max(...usageByMonth.map(m => m.value), 1);

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
      value: "Free",
      icon: MessageSquare
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
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            Usage Statistics
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Real-time AI usage and performance metrics
          </p>
        </div>

        {/* Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] rounded-[12px] md:rounded-[16px] p-4 md:p-6"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 mb-2 md:mb-3 text-[#2563EB]" />
                <p className="text-xs md:text-sm text-[#64748B] dark:text-[#94A3B8]">{stat.title}</p>
                <p className="text-lg md:text-2xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Usage Over Time - Visual Graph */}
        <div className="bg-white dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] rounded-[16px] p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[#0F172A] dark:text-[#F8FAFC]">Usage Over Time</h2>
          <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2">
            {usageByMonth.map((month, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '180px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-[#2563EB] to-[#3B82F6] rounded-t-[4px] md:rounded-t-[8px] transition-all hover:from-[#1D4ED8] hover:to-[#2563EB] relative group"
                    style={{ height: `${(month.value / maxUsage) * 100}%`, minHeight: month.value > 0 ? '8px' : '0' }}
                  >
                    {month.value > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {month.value} queries
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">{month.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-white dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] rounded-[16px] p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[#0F172A] dark:text-[#F8FAFC]">Most Suggested Models</h2>
          <div className="space-y-3">
            {modelUsage.slice(0, 5).map((model) => (
              <div key={model.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{model.name}</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{model.count} times ({model.percent}%)</span>
                </div>
                <div className="h-2 bg-[#F6F7FB] dark:bg-[#334155] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all"
                    style={{ width: `${model.percent}%` }}
                  />
                </div>
              </div>
            ))}
            {modelUsage.length === 0 && (
              <p className="text-sm text-[#64748B] text-center py-4">No model suggestions yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] rounded-[16px] p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[#0F172A] dark:text-[#F8FAFC]">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#334155]">
                  <th className="text-left py-2 px-2 text-[#64748B] font-medium">Model</th>
                  <th className="text-left py-2 px-2 text-[#64748B] font-medium hidden md:table-cell">Query</th>
                  <th className="text-left py-2 px-2 text-[#64748B] font-medium">Why Best</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map((e) => (
                  <tr key={e.id} className="border-b border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F6F7FB] dark:hover:bg-[#334155]/20">
                    <td className="py-3 px-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]">{e.model}</td>
                    <td className="py-3 px-2 text-[#64748B] dark:text-[#94A3B8] hidden md:table-cell max-w-xs truncate">{e.query}</td>
                    <td className="py-3 px-2 text-[#64748B] dark:text-[#94A3B8] text-xs md:text-sm">{e.reason}</td>
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
    </div>
  );
}
