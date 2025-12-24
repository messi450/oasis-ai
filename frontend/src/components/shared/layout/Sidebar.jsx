import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, MessageSquare, Settings, BarChart3, Trash2, Search, Edit2, ChevronDown, ChevronRight, Code, FileText, BarChart, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatService } from "@/api/chatService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const topicIcons = {
  code: Code,
  writing: FileText,
  analysis: BarChart,
  creative: Sparkles,
  general: MessageCircle
};

const topicColors = {
  code: "text-[#2563EB]",
  writing: "text-[#16A34A]",
  analysis: "text-[#CA8A04]",
  creative: "text-[#9333EA]",
  general: "text-[#64748B]"
};

export default function Sidebar({ activeChatId, onChatSelect, isOpen, onToggle }) {
  const location = useLocation();
  const [hoveredChat, setHoveredChat] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyOpen, setHistoryOpen] = useState(true);
  const queryClient = useQueryClient();

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => ChatService.list(),
    initialData: []
  });

  const deleteChat = useMutation({
    mutationFn: (chatId) => ChatService.delete(chatId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chats'] })
  });

  const updateChat = useMutation({
    mutationFn: ({ id, data }) => ChatService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setEditingChat(null);
    }
  });

  const handleRename = (chatId) => {
    if (editTitle.trim()) {
      updateChat.mutate({ id: chatId, data: { title: editTitle.trim() } });
    }
  };

  const handleDelete = (chatId) => {
    if (confirm('Delete this conversation?')) {
      deleteChat.mutate(chatId);
    }
  };

  const startEdit = (chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path) => location.pathname === path;

  const [emailInput, setEmailInput] = useState("");

  const handleJoinUpdates = () => {
    if (emailInput.trim()) {
      localStorage.setItem("userEmail", emailInput.trim());
      // Dispatch a storage event so UserMenu can pick it up immediately
      window.dispatchEvent(new Event("storage"));
      alert("Thanks! We'll send updates to " + emailInput.trim());
      setEmailInput("");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        inset-y-0 left-0
        bg-white border-r border-[#E2E8F0] 
        flex flex-col h-screen shrink-0 shadow-sm
        transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-[-100%] lg:border-none'}
        overflow-hidden
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694b184dc984102a3c47b3d7/ae24ff3a8_image.png"
              alt="OASIS"
              className="w-8 h-8 logo-invert"
            />
            <span className="text-base font-semibold text-[#0F172A]">OASIS</span>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-[#F6F7FB] rounded-[10px]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#64748B]">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={() => window.location.href = createPageUrl("Home")}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium h-10 rounded-[10px] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-[#F6F7FB] border-[#E2E8F0] rounded-[10px] text-sm"
            />
          </div>
        </div>

        {/* Chat History Toggle */}
        <div className="px-2">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#64748B] uppercase tracking-wide hover:bg-[#F6F7FB] rounded-[10px] transition-colors"
          >
            <span>History</span>
            {historyOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Recent Chats */}
        {historyOpen && (
          <div className="flex-1 overflow-y-auto px-2">
            {isLoading ? (
              <div className="px-3 py-4 text-center text-sm text-[#64748B]">Loading...</div>
            ) : filteredChats.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-[#64748B]">
                {searchQuery ? "No chats found" : "No chats yet"}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => {
                  const TopicIcon = topicIcons[chat.topic] || MessageSquare;
                  const isEditing = editingChat === chat.id;

                  return (
                    <div
                      key={chat.id}
                      className={`relative group ${activeChatId === chat.id ? 'bg-[#F6F7FB]' : ''} rounded-[10px]`}
                      onMouseEnter={() => setHoveredChat(chat.id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      {isEditing ? (
                        <div className="px-3 py-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(chat.id);
                              if (e.key === 'Escape') setEditingChat(null);
                            }}
                            onBlur={() => handleRename(chat.id)}
                            className="h-8 text-sm border-[#2563EB] rounded-[10px]"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => onChatSelect?.(chat)}
                          className="w-full text-left px-3 py-2 hover:bg-[#F6F7FB] transition-colors rounded-[10px]"
                        >
                          <div className="flex items-start gap-2">
                            <TopicIcon className={`w-4 h-4 mt-0.5 shrink-0 ${topicColors[chat.topic]}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#0F172A] truncate font-medium">{chat.title}</p>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {chat.last_message_at ? new Date(chat.last_message_at).toLocaleDateString() : 'New'}
                              </p>
                            </div>
                            {hoveredChat === chat.id && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(chat);
                                  }}
                                  className="p-1 hover:bg-[#E2E8F0] rounded-[10px] transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(chat.id);
                                  }}
                                  className="p-1 hover:bg-[#E2E8F0] rounded-[10px] transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-[#64748B]" />
                                </button>
                              </div>
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Email Updates Campaign */}
        <div className="px-4 py-4 border-t border-[#E2E8F0]">
          <div className="bg-[#EFF6FF] dark:bg-[#1E3A8A] rounded-[12px] p-3 border border-[#2563EB]/10">
            <h4 className="text-xs font-bold text-[#2563EB] dark:text-[#DBEAFE] uppercase tracking-wider mb-1">Stay Tuned</h4>
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mb-2 leading-relaxed">
              Get the latest AI model updates delivered to your inbox.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="email@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-8 text-[11px] bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] rounded-[6px]"
              />
              <Button
                size="sm"
                className="w-full h-8 text-[11px] bg-[#2563EB] hover:bg-[#1D4ED8]"
                onClick={handleJoinUpdates}
              >
                Join Updates
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-[#E2E8F0] p-2">
          <Link
            to={createPageUrl("Settings")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors ${isActive("/Settings")
              ? "bg-[#F6F7FB] text-[#2563EB]"
              : "text-[#64748B] hover:bg-[#F6F7FB]"
              }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <Link
            to={createPageUrl("UsageStats")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors ${isActive("/UsageStats")
              ? "bg-[#F6F7FB] text-[#2563EB]"
              : "text-[#64748B] hover:bg-[#F6F7FB]"
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Usage Stats</span>
          </Link>
        </div>
      </div>
    </>
  );
}