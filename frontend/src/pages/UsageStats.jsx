import React from "react";
import { TrendingUp, MessageSquare, DollarSign, Clock, Calendar } from "lucide-react";

const statCards = [
  {
    title: "Total Queries",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    color: "bg-[#EFF6FF] text-[#2563EB]"
  },
  {
    title: "This Month",
    value: "183",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    color: "bg-[#F0FDF4] text-[#16A34A]"
  },
  {
    title: "Avg. Response Time",
    value: "1.2s",
    change: "-0.3s",
    trend: "down",
    icon: Clock,
    color: "bg-[#FEF9C3] text-[#CA8A04]"
  },
  {
    title: "Estimated Savings",
    value: "$45.30",
    change: "+$12.50",
    trend: "up",
    icon: DollarSign,
    color: "bg-[#FEF2F2] text-[#DC2626]"
  }
];

const recentActivity = [
  { model: "OpenAI o3", query: "Debug Python code", time: "2 hours ago", cost: "$0.05" },
  { model: "Claude 3.5 Sonnet", query: "Write blog post", time: "5 hours ago", cost: "$0.12" },
  { model: "Gemini 1.5 Pro", query: "Analyze sales data", time: "Yesterday", cost: "$0.03" },
  { model: "GPT-4o", query: "Generate marketing copy", time: "2 days ago", cost: "$0.08" },
  { model: "DeepSeek-R1", query: "Code review", time: "3 days ago", cost: "$0.01" }
];

export default function UsageStats() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">Usage Statistics</h1>
          <p className="text-sm text-[#64748B]">
            Track your AI usage and performance metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                    }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Over Time */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Usage Over Time</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {[45, 62, 58, 72, 68, 85, 92, 78, 95, 88, 102, 96].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-[#2563EB] rounded-t-[8px]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-[#64748B] mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Distribution */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Most Used Models</h2>
            <div className="space-y-4">
              {[
                { name: "GPT-4o", percent: 35, color: "bg-[#2563EB]" },
                { name: "Claude 3.5 Sonnet", percent: 28, color: "bg-[#16A34A]" },
                { name: "Gemini 1.5 Pro", percent: 22, color: "bg-[#CA8A04]" },
                { name: "OpenAI o3", percent: 10, color: "bg-[#DC2626]" },
                { name: "Others", percent: 5, color: "bg-[#64748B]" }
              ].map((model) => (
                <div key={model.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#0F172A]">{model.name}</span>
                    <span className="text-sm font-medium text-[#64748B]">{model.percent}%</span>
                  </div>
                  <div className="h-2 bg-[#F6F7FB] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${model.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${model.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Query</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#64748B]">Time</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#64748B]">Cost</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, idx) => (
                  <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F6F7FB] transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-[#0F172A]">{activity.model}</td>
                    <td className="py-3 px-4 text-sm text-[#64748B]">{activity.query}</td>
                    <td className="py-3 px-4 text-sm text-[#64748B]">{activity.time}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#0F172A] text-right">{activity.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}