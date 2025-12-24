import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/features/chat/ChatMessage";
import RecommendationCard from "@/components/features/chat/RecommendationCard";
import CategoryFilters from "@/components/features/chat/CategoryFilters";
import ChatInput from "@/components/features/chat/ChatInput";
import { Loader2, Sparkles } from "lucide-react";
import { ChatService } from "@/api/chatService";
import { useQueryClient } from "@tanstack/react-query";

const quickExamples = [
  "Debug my Python code",
  "Write a blog post about AI",
  "Analyze sales data",
  "Generate marketing copy"
];



const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const chatContainerRef = useRef(null);
  const queryClient = useQueryClient();

  // Get chatId from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('chatId');
    if (chatId) {
      loadChat(chatId);
    }
  }, []);

  const loadChat = async (chatId) => {
    try {
      const chat = await ChatService.get(chatId);
      if (chat) {
        setCurrentChatId(chatId);
        setMessages(chat.messages || []);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const saveChat = async (newMessages) => {
    try {
      const chatData = {
        title: newMessages[0]?.content?.slice(0, 50) || "New Chat",
        topic: determineTopicFromPrompt(newMessages[0]?.content || ""),
        messages: newMessages,
        last_message_at: new Date().toISOString()
      };

      if (currentChatId) {
        await ChatService.update(currentChatId, chatData);
      } else {
        const newChat = await ChatService.create(chatData);
        setCurrentChatId(newChat.id);

        // Update URL without reloading
        const url = new URL(window.location);
        url.searchParams.set('chatId', newChat.id);
        window.history.pushState({}, '', url);
      }
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const determineTopicFromPrompt = (prompt) => {
    const lower = prompt.toLowerCase();
    if (lower.includes('code') || lower.includes('debug') || lower.includes('program')) return 'code';
    if (lower.includes('write') || lower.includes('blog') || lower.includes('content')) return 'writing';
    if (lower.includes('analyze') || lower.includes('data') || lower.includes('research')) return 'analysis';
    if (lower.includes('creative') || lower.includes('generate') || lower.includes('image')) return 'creative';
    return 'general';
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text) => {
    const timestamp = getCurrentTime();

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp,
      role: 'user'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Generate recommendation from Backend
    try {
      const data = await ChatService.analyzePrompt(text);
      const recommendation = data.recommendation;

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: recommendation.reasoning, // Use reasoning as the message content
        timestamp: getCurrentTime(),
        recommendation: recommendation,
        role: 'ai',
        requestId: data.request_id
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save chat to database (local history)
      saveChat(finalMessages);
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error while analyzing your request. Please try again.',
        timestamp: getCurrentTime(),
        role: 'ai'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickExample = (example) => {
    handleSendMessage(example);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto chat-container"
      >
        {messages.length === 0 && !isLoading && (
          // Empty State
          <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center px-4 md:px-6">

              <h2 className="text-xl md:text-2xl font-semibold text-[#0F172A] mb-3">
                What can I help you with?
              </h2>
              <p className="text-sm text-[#64748B] mb-6 md:mb-8">
                Describe your task and I'll recommend the best AI model for you
              </p>

              {/* Quick Examples */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
                  Try examples:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {quickExamples.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleQuickExample(example)}
                      className="px-3 md:px-4 py-2 md:py-3 bg-white border border-[#E2E8F0] rounded-[12px] text-xs md:text-sm text-[#0F172A] hover:border-[#2563EB] hover:shadow-sm transition-all text-left"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage
              message={msg.content}
              timestamp={msg.timestamp}
              isUser={msg.type === 'user'}
            />
            {msg.recommendation && (
              <div className="px-6 pb-6">
                <RecommendationCard recommendation={msg.recommendation} />
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="px-4 md:px-6 py-4 md:py-6">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
              <span className="text-sm">Finding the best AI...</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Filters (show only when there are messages) */}
      {messages.length > 0 && (
        <CategoryFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}