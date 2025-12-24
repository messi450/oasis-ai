import React, { useEffect, useState } from "react";
import { Trophy, Zap, Gift, ArrowRight, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrimaryRecommendation({ recommendation }) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(recommendation.confidence);
    }, 200);
    return () => clearTimeout(timer);
  }, [recommendation.confidence]);

  return (
    <div className="relative bg-[#1a2537] border-2 border-[#3b82f6] rounded-xl p-8 shadow-[0_10px_30px_rgba(59,130,246,0.15)] min-h-[600px] flex flex-col animate-fade-in-up">
      {/* Badge */}
      <div className="absolute -top-3 left-6 px-4 py-1.5 bg-[#3b82f6] rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          Best Match
        </span>
      </div>

      {/* Model Info */}
      <div className="mt-4">
        <h2 className="text-[28px] font-bold text-slate-100 tracking-[-0.01em]">
          {recommendation.name}
        </h2>
        <p className="text-sm text-[#64748b] mt-1">
          by {recommendation.provider}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-5" />

      {/* Reasoning */}
      <p className="text-[15px] text-[#cbd5e1] leading-relaxed">
        "{recommendation.reasoning}"
      </p>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-5" />

      {/* Confidence Bar */}
      <div>
        <p className="text-[13px] text-[#94a3b8] mb-2">
          {recommendation.confidence}% Match Confidence
        </p>
        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10b981] to-[#22c55e] rounded-full transition-all duration-700 ease-out pulse-glow"
            style={{ width: `${animatedConfidence}%` }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-5" />

      {/* Pricing & Metadata */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#94a3b8]">💰 Pricing</span>
        </div>
        <p className="text-base font-semibold text-[#fbbf24] mono">
          ${recommendation.inputPrice} / ${recommendation.outputPrice} per 1M tokens
        </p>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#94a3b8]">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Speed: <span className="text-slate-300">{recommendation.speed}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Gift className="w-4 h-4" />
            Free tier:{" "}
            <span className={recommendation.freeTier ? "text-[#10b981]" : "text-[#64748b]"}>
              {recommendation.freeTier ? "Yes" : "No"}
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#334155] my-5" />

      {/* Use Cases */}
      <div className="space-y-2">
        {recommendation.useCases.map((useCase, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-[#cbd5e1]">
            <Check className="w-4 h-4 text-[#10b981]" />
            {useCase}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-auto pt-6">
        <Button
          className="w-full h-12 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-semibold text-base rounded-lg shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_24px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Use {recommendation.name}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}