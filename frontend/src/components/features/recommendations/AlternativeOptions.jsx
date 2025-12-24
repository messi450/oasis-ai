import React, { useState } from "react";
import { Lightbulb, ArrowRight, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const StarRating = ({ rating, max = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(max)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-[#fbbf24] text-[#fbbf24]" : "text-[#334155]"}`}
      />
    ))}
  </div>
);

const CostIndicator = ({ level, max = 5 }) => (
  <div className="flex gap-0.5 mono text-sm">
    {[...Array(max)].map((_, i) => (
      <span key={i} className={i < level ? "text-[#10b981]" : "text-[#334155]"}>
        $
      </span>
    ))}
  </div>
);

export default function AlternativeOptions({ primary, alternatives }) {
  const [showMore, setShowMore] = useState(false);
  const visibleAlternatives = showMore ? alternatives : alternatives.slice(0, 2);

  return (
    <div className="bg-[#1a2537] border border-[#334155] rounded-xl p-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      {/* Header */}
      <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-100 mb-4">
        <Lightbulb className="w-5 h-5 text-[#fbbf24]" />
        Alternative Options
      </h3>

      <p className="text-sm text-[#94a3b8] mb-4">
        Compare all options side-by-side:
      </p>

      {/* Comparison Table */}
      <div className="bg-[#131b2e] border border-[#334155] rounded-lg overflow-hidden mb-6">
        {/* Table Header */}
        <div className="grid grid-cols-3 bg-[#1a2537] border-b border-[#334155]">
          <div className="px-4 py-3 text-sm font-semibold text-[#94a3b8]" />
          <div className="px-4 py-3 text-sm font-semibold text-[#cbd5e1] text-center">
            {primary.name}
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-[#cbd5e1] text-center">
            {alternatives[0]?.name}
          </div>
        </div>

        {/* Table Rows */}
        {[
          { label: "Quality", primaryVal: primary.quality, altVal: alternatives[0]?.quality, type: "stars" },
          { label: "Cost", primaryVal: primary.costLevel, altVal: alternatives[0]?.costLevel, type: "cost" },
          { label: "Speed", primaryVal: primary.speed, altVal: alternatives[0]?.speed, type: "text" },
          { label: "Free", primaryVal: primary.freeTier, altVal: alternatives[0]?.freeTier, type: "bool" }
        ].map((row, idx) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 hover:bg-[#1a2537] transition-colors ${
              idx < 3 ? "border-b border-[#1e293b]" : ""
            }`}
          >
            <div className="px-4 py-3 text-sm text-[#94a3b8]">{row.label}</div>
            <div className="px-4 py-3 flex justify-center items-center">
              {row.type === "stars" && <StarRating rating={row.primaryVal} />}
              {row.type === "cost" && <CostIndicator level={row.primaryVal} />}
              {row.type === "text" && <span className="text-sm text-[#cbd5e1]">{row.primaryVal}</span>}
              {row.type === "bool" && (
                <span className={`text-sm ${row.primaryVal ? "text-[#10b981]" : "text-[#64748b]"}`}>
                  {row.primaryVal ? "Yes" : "No"}
                </span>
              )}
            </div>
            <div className="px-4 py-3 flex justify-center items-center">
              {row.type === "stars" && <StarRating rating={row.altVal} />}
              {row.type === "cost" && <CostIndicator level={row.altVal} />}
              {row.type === "text" && <span className="text-sm text-[#cbd5e1]">{row.altVal}</span>}
              {row.type === "bool" && (
                <span className={`text-sm ${row.altVal ? "text-[#10b981]" : "text-[#64748b]"}`}>
                  {row.altVal ? "Yes" : "No"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Cards */}
      <div className="space-y-4">
        {visibleAlternatives.map((alt, idx) => (
          <div
            key={alt.name}
            className="bg-[#131b2e] border border-[#334155] rounded-lg p-5 hover:border-[#475569] hover:translate-x-1 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-base font-semibold text-slate-100">{alt.name}</h4>
                <p className="text-sm text-[#64748b]">by {alt.provider}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748b] group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-[#94a3b8] mb-3">"{alt.shortReasoning}"</p>
            <p className="text-sm font-semibold text-[#10b981] mono">
              ${alt.inputPrice} / ${alt.outputPrice} per 1M
            </p>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {alternatives.length > 2 && (
        <Button
          variant="ghost"
          onClick={() => setShowMore(!showMore)}
          className="mt-4 text-[#3b82f6] hover:text-[#60a5fa] hover:bg-transparent font-semibold"
        >
          <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showMore ? "rotate-180" : ""}`} />
          {showMore ? "Show less" : `Show ${alternatives.length - 2} more options`}
        </Button>
      )}
    </div>
  );
}