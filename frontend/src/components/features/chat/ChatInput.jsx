import React, { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
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
    <div className="border-t border-[#E2E8F0] bg-white p-3 md:p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 md:gap-3">
          <div className="flex-1 relative min-w-0">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What is on your mind?"
              disabled={isLoading}
              rows={1}
              className="w-full px-3 md:px-4 py-2 md:py-3 pr-16 md:pr-20 bg-white border border-[#E2E8F0] rounded-[12px] resize-none text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{
                minHeight: "48px",
                maxHeight: "200px",
                overflowY: "auto"
              }}
            />
            <div className="absolute right-1 md:right-2 bottom-1 md:bottom-2 flex items-center gap-0.5 md:gap-1">
              <button
                type="button"
                className="p-1.5 md:p-2 text-[#64748B] hover:bg-[#F6F7FB] rounded-full transition-colors hidden sm:block"
                title="Attach file"
              >
                <Paperclip className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 md:p-2 text-[#64748B] hover:bg-[#F6F7FB] rounded-full transition-colors hidden sm:block"
                title="Voice input"
              >
                <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-10 w-10 md:h-12 md:w-12 p-0 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}