import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AutoSelectionFlow({
    status = "analyzing", // "analyzing" | "selecting" | "complete"
    recommendation,
    alternative,
    onUseModel,
    onSwitchModel
}) {

    if (status === "analyzing" || status === "selecting") {
        return (
            <div className="flex justify-center w-full px-4 py-4">
                <div className="flex items-center gap-3 text-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span className="text-slate-400 font-medium">
                            {status === "analyzing" ? "Analyzing prompt..." : ""}
                        </span>
                    </div>
                    {status === "selecting" && (
                        <>
                            <span className="text-slate-600">→</span>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-400 font-medium">Automatically selecting model</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (!recommendation) return null;

    return (
        <div className="w-full flex flex-col items-center px-4 md:px-6 py-6 space-y-6">
            {/* Primary Selection Card */}
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5 mx-auto transition-all hover:scale-[1.01] duration-500">
                {/* Selected Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-sm shadow-emerald-900/20">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Selected automatically
                    </span>
                </div>

                {/* Model Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {recommendation.name}
                </h3>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 font-medium">
                    {recommendation.subtitle || "Advanced AI capabilities"}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {recommendation.categories?.map((cat) => (
                        <Badge
                            key={cat}
                            className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs px-3 py-1 transition-colors"
                        >
                            {cat}
                        </Badge>
                    ))}
                    {recommendation.speed && (
                        <Badge className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs px-3 py-1 transition-colors">
                            {recommendation.speed}
                        </Badge>
                    )}
                </div>

                {/* Checkmark + Selected Text */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-emerald-400">Optimal model selected for your task</span>
                </div>

                {/* Reasoning Box */}
                <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 md:p-5 mb-6 backdrop-blur-sm">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                        {recommendation.reasoning}
                    </p>
                </div>

                {/* Primary Action Button */}
                <Button
                    onClick={() => onUseModel?.(recommendation)}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-base md:text-lg"
                >
                    Using {recommendation.name}
                </Button>
            </div>

            {/* Alternative Options */}
            {alternative && (
                <div className="w-full max-w-xl mx-auto">
                    <div className="flex items-center justify-center mb-5 opacity-60">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                        <span className="px-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Alternative Options
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => onSwitchModel?.(alternative)}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                                    {alternative.name}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {alternative.subtitle || "High performance model"}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 rounded-lg transition-all"
                            >
                                Switch to {alternative.name}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
