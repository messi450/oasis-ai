import React from "react";
import PrimaryRecommendation from "./PrimaryRecommendation";
import AlternativeOptions from "./AlternativeOptions";
import CostCalculator from "./CostCalculator";
import { Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultsSection({ prompt, results, onNewQuery, onEditPrompt }) {
  return (
    <div className="w-full animate-fade-in-up">
      {/* User's Prompt Display */}
      <div className="max-w-[1440px] mx-auto px-6 mb-8">
        <div className="bg-[#131b2e] border border-[#334155] rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                Your Query
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                "{prompt}"
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditPrompt}
                className="text-[#94a3b8] hover:text-slate-100 hover:bg-[#1a2537]"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewQuery}
                className="text-[#94a3b8] hover:text-slate-100 hover:bg-[#1a2537]"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-[1440px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Primary Recommendation - 2 columns */}
          <div className="lg:col-span-2">
            <PrimaryRecommendation recommendation={results.primary} />
          </div>

          {/* Alternatives - 3 columns */}
          <div className="lg:col-span-3">
            <AlternativeOptions 
              primary={results.primary} 
              alternatives={results.alternatives} 
            />
          </div>

          {/* Cost Calculator - 2 columns */}
          <div className="lg:col-span-2">
            <CostCalculator 
              primary={results.primary} 
              alternative={results.alternatives[0]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}