import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-transparent p-4 md:p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1 relative min-w-0">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="What is on your mind?"
              disabled={isLoading}
              rows={1}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-[12px] resize-none text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{
                minHeight: "48px",
                maxHeight: "300px",
                height: "auto",
                overflowY: "auto"
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-12 w-12 p-0 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}