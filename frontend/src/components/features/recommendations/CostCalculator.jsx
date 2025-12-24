import React, { useState } from "react";
import { Coins, TrendingDown, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function CostCalculator({ primary, alternative }) {
  const [usagePerMonth, setUsagePerMonth] = useState([100]);

  // Assume average of 1000 tokens per use (combined input/output)
  const tokensPerUse = 1000;
  const usageValue = usagePerMonth[0];

  // Calculate monthly costs (price is per 1M tokens)
  const primaryMonthlyCost = (usageValue * tokensPerUse * (primary.inputPrice + primary.outputPrice) / 2) / 1000000;
  const altMonthlyCost = (usageValue * tokensPerUse * (alternative.inputPrice + alternative.outputPrice) / 2) / 1000000;
  
  const savings = primaryMonthlyCost - altMonthlyCost;
  const savingsPercent = primaryMonthlyCost > 0 ? Math.round((savings / primaryMonthlyCost) * 100) : 0;

  const maxBarWidth = Math.max(primaryMonthlyCost, altMonthlyCost);

  return (
    <div className="bg-[#1a2537] border border-[#334155] rounded-xl p-8 sticky top-[88px] animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      {/* Header */}
      <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-100 mb-6">
        <Coins className="w-5 h-5 text-[#fbbf24]" />
        Monthly Cost Estimate
      </h3>

      {/* Usage Question */}
      <p className="text-sm text-[#94a3b8] mb-4 flex items-center gap-2">
        How often will you use it?
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-[#64748b]" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1f2d43] border-[#334155] text-slate-200">
              Estimate based on ~1000 tokens per use
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </p>

      {/* Slider */}
      <div className="mb-4">
        <Slider
          value={usagePerMonth}
          onValueChange={setUsagePerMonth}
          min={10}
          max={1000}
          step={10}
          className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-[3px] [&_[role=slider]]:border-[#3b82f6] [&_[role=slider]]:shadow-[0_2px_8px_rgba(0,0,0,0.3)] [&_.relative]:bg-[#1e293b] [&_.absolute]:bg-[#3b82f6]"
        />
        <div className="flex justify-between text-xs text-[#64748b] mt-2">
          <span>10</span>
          <span>1000</span>
        </div>
      </div>

      {/* Usage Display */}
      <p className="text-center text-lg font-semibold text-slate-100 mb-6">
        {usageValue} uses per month
      </p>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-6" />

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#94a3b8] mb-1">Primary ({primary.name})</p>
          <p className="text-xl font-semibold text-slate-100 mono">
            ~${primaryMonthlyCost.toFixed(2)}/month
          </p>
        </div>
        <div>
          <p className="text-sm text-[#94a3b8] mb-1">Alternative ({alternative.name})</p>
          <p className="text-xl font-semibold text-[#10b981] mono">
            ~${altMonthlyCost.toFixed(2)}/month
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-6" />

      {/* Savings Highlight */}
      {savings > 0 && (
        <div className="bg-gradient-to-r from-[rgba(16,185,129,0.15)] to-transparent border border-[#10b981] rounded-lg p-4 mb-6">
          <p className="flex items-center gap-2 text-base font-semibold text-[#10b981]">
            <TrendingDown className="w-5 h-5" />
            You save: ${savings.toFixed(2)}/mo
          </p>
          <p className="text-sm text-[#10b981]/80 mt-1">
            by using the alternative
          </p>
        </div>
      )}

      {/* Bar Chart */}
      <div className="bg-[#131b2e] rounded-lg p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#94a3b8]">
            <span>{primary.name}</span>
            <span className="mono">${primaryMonthlyCost.toFixed(2)}</span>
          </div>
          <div className="h-6 bg-[#1e293b] rounded overflow-hidden">
            <div
              className="h-full bg-[#ef4444] rounded transition-all duration-500"
              style={{ width: maxBarWidth > 0 ? `${(primaryMonthlyCost / maxBarWidth) * 100}%` : "0%" }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#94a3b8]">
            <span>{alternative.name}</span>
            <span className="mono">${altMonthlyCost.toFixed(2)}</span>
          </div>
          <div className="h-6 bg-[#1e293b] rounded overflow-hidden">
            <div
              className="h-full bg-[#10b981] rounded transition-all duration-500"
              style={{ width: maxBarWidth > 0 ? `${(altMonthlyCost / maxBarWidth) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Detail Link */}
      <Button
        variant="ghost"
        className="mt-4 w-full text-[#3b82f6] hover:text-[#60a5fa] hover:bg-transparent font-semibold text-sm"
      >
        See detailed breakdown
      </Button>
    </div>
  );
}