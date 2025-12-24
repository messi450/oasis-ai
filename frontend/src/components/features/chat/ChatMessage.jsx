import React from "react";
import { User, Brain } from "lucide-react";

export default function ChatMessage({ message, timestamp, isUser }) {
  return (
    <div className="flex gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-6 hover:bg-white transition-colors">
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2563EB]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 md:mb-2">
          <span className="text-sm font-semibold text-[#0F172A]">
            {isUser ? "You" : "AI NeuroHub"}
          </span>
          <span className="text-xs text-[#64748B]">{timestamp}</span>
        </div>
        <div className="text-sm text-[#0F172A] leading-relaxed break-words">
          {message}
        </div>
      </div>
    </div>
  );
}