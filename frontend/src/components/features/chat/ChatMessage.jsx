import React from "react";
import { User, Brain } from "lucide-react";

export default function ChatMessage({ message, timestamp, isUser }) {
  return (
    <div className="flex gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-6 hover:bg-white dark:hover:bg-slate-800 transition-colors">
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </div>
        ) : (
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2563EB] dark:text-blue-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 md:mb-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {isUser ? "You" : "OASIS"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{timestamp}</span>
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed break-words">
          {message}
        </div>
      </div>
    </div>
  );
}