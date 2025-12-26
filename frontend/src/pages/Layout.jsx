import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import Sidebar from "@/components/shared/layout/Sidebar";
import UserMenu from "@/components/shared/layout/UserMenu";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F6F7FB] dark:bg-[#0F172A] transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeChatId={null}
          onChatSelect={(chat) => {
            window.location.href = createPageUrl("Home") + "?chatId=" + chat.id;
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Bar */}
          <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#F6F7FB] dark:hover:bg-[#2D3748] rounded-[10px] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#0F172A] dark:text-[#F8FAFC]">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694b184dc984102a3c47b3d7/ae24ff3a8_image.png"
                alt="OASIS"
                className="w-8 h-8 logo-invert"
              />
              <h1 className="text-lg md:text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC]">OASIS</h1>
            </div>
            <UserMenu />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden bg-[#F6F7FB] dark:bg-[#0F172A] transition-colors duration-300">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
