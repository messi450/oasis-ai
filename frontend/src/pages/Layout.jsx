
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import Sidebar from "@/components/shared/layout/Sidebar";
import UserMenu from "@/components/shared/layout/UserMenu";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F6F7FB;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }

        .chat-container {
          scroll-behavior: smooth;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideInLeft 0.3s ease-out forwards;
        }
      `}</style>

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
          <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#F6F7FB] rounded-[10px] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#0F172A]">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694b184dc984102a3c47b3d7/ae24ff3a8_image.png"
                alt="OASIS"
                className="w-8 h-8"
              />
              <h1 className="text-lg md:text-xl font-semibold text-[#0F172A]">AI NeuroHub</h1>
            </div>
            <UserMenu />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden bg-[#F6F7FB]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
