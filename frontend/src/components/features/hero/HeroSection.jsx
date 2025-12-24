import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

const quickExamples = [
  "Debug my code",
  "Write a blog post",
  "Analyze data",
  "Research papers",
  "Generate images",
  "Translate content"
];

export default function HeroSection({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickExample = (example) => {
    setPrompt(example);
    setTimeout(() => onSubmit(example), 100);
  };

  return (
    <div className="relative max-w-[800px] mx-auto px-6 py-16 md:py-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative">
        {/* Headlines */}
        <h1 className="text-center text-[clamp(2rem,5vw,3rem)] font-bold text-slate-100 tracking-[-0.02em] leading-[1.2] mb-3">
          What AI should you use?
        </h1>
        <p className="text-center text-lg text-[#94a3b8] mb-12">
          Find the perfect model in seconds
        </p>

        {/* Main Input */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g., "Debug my Python code and explain what went wrong"'
            disabled={isLoading}
            className={`w-full min-h-[120px] max-h-[300px] resize-y p-5 bg-[#131b2e] border-2 border-[#334155] rounded-xl text-slate-100 text-base leading-relaxed placeholder:text-[#64748b] focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 focus:outline-none transition-all duration-200 ${
              isLoading ? "opacity-60" : ""
            }`}
          />
          {isLoading && (
            <div className="absolute top-4 right-4">
              <Loader2 className="w-5 h-5 text-[#3b82f6] animate-spin" />
            </div>
          )}
        </div>

        {/* Stats Line */}
        <p className="text-center text-sm text-[#64748b] mt-4">
          620+ AI models • Updated 2 min ago
        </p>

        {/* Quick Examples */}
        <div className="mt-6">
          <p className="text-center text-sm text-[#64748b] mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick examples:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickExamples.map((example) => (
              <button
                key={example}
                onClick={() => handleQuickExample(example)}
                disabled={isLoading}
                className="h-8 px-4 bg-[#1a2537] border border-[#334155] rounded-full text-sm text-[#cbd5e1] hover:bg-[#1f2d43] hover:border-[#475569] hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}