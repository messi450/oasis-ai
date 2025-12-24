import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, DollarSign } from "lucide-react";

const categoryColors = {
  Code: "bg-blue-100 text-blue-800",
  Research: "bg-purple-100 text-purple-800",
  Writing: "bg-green-100 text-green-800",
  Creative: "bg-pink-100 text-pink-800",
  Analysis: "bg-yellow-100 text-yellow-800",
  Auto: "bg-gray-100 text-gray-800"
};

export default function RecommendationCard({ recommendation }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow max-w-3xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-semibold mb-4">
        <span>🏆</span>
        <span>BEST MATCH</span>
      </div>

      {/* Model Name & Provider */}
      <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-2">{recommendation.name}</h3>
      <p className="text-sm text-[#64748B] mb-4">by {recommendation.provider}</p>

      {/* Reasoning */}
      <p className="text-sm text-[#0F172A] leading-relaxed mb-4">
        {recommendation.reasoning}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-sm">
          <DollarSign className="w-4 h-4 text-[#64748B]" />
          <span className="text-[#0F172A] font-medium">${recommendation.inputPrice}/${recommendation.outputPrice} per 1M</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Zap className="w-4 h-4 text-[#64748B]" />
          <span className="text-[#0F172A]">{recommendation.speed}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-5">
        {recommendation.categories.map((cat) => (
          <Badge key={cat} className={categoryColors[cat] || categoryColors.Auto}>
            {cat}
          </Badge>
        ))}
      </div>

      {/* CTA Button */}
      <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm">
        Use {recommendation.name}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}