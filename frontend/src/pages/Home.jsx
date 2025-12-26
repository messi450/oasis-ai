import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/features/chat/ChatMessage";
import { useSearchParams } from "react-router-dom";
import RecommendationCard from "@/components/features/chat/RecommendationCard";
import AutoSelectionFlow from "@/components/features/chat/AutoSelectionFlow";
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
  const [currentChatId, setCurrentChatId] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [selectionStatus, setSelectionStatus] = useState(null); // "analyzing" | "selecting" | "complete"
  const [suggestion, setSuggestion] = useState(null); // { should_switch, suggested_model, provider, reason, subtitle }
  const chatContainerRef = useRef(null);
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const chatIdParam = searchParams.get('chatId');

  useEffect(() => {
    if (chatIdParam) {
      loadChat(chatIdParam);
    } else {
      // Reset for New Chat
      setCurrentChatId(null);
      setMessages([]);
      setActiveModel(null);
      setSuggestion(null);
    }
  }, [chatIdParam]);

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
        setSearchParams({ chatId: newChat.id });
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
  }, [messages, selectionStatus, suggestion]);

  const handleSendMessage = async (text) => {
    const timestamp = getCurrentTime();

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
    setSuggestion(null);

    try {
      if (activeModel) {
        // Chat Mode
        const data = await ChatService.chat(text, activeModel.name, messages);
        const aiResponse = data.response;

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: getCurrentTime(),
          role: 'ai'
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        saveChat(finalMessages);

        // Silent Context Monitoring (Gemini Observer)
        try {
          const obsData = await ChatService.monitorContext(finalMessages, activeModel.name);
          if (obsData && obsData.should_switch) {
            setSuggestion(obsData);
          }
        } catch (obsError) {
          console.error('Observer failed:', obsError);
        }
      } else {
        // Analysis Mode
        setSelectionStatus("analyzing");
        await new Promise(resolve => setTimeout(resolve, 400));
        setSelectionStatus("selecting");

        const data = await ChatService.analyzePrompt(text);

        if (!data || !data.recommendation) {
          throw new Error("Invalid response from AI service");
        }

        const recommendation = data.recommendation;
        const alternative = data.alternative;

        await new Promise(resolve => setTimeout(resolve, 400));
        setSelectionStatus("complete");

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: recommendation.reasoning,
          timestamp: getCurrentTime(),
          recommendation: recommendation,
          alternative: alternative,
          role: 'ai',
          autoSelected: true
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        saveChat(finalMessages);
        setActiveModel(recommendation);
      }
    } catch (error) {
      console.error('Failed to process message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Error: ${error.message || 'Unknown error'}. Details: ${JSON.stringify(error.response?.data || {})}`,
        timestamp: getCurrentTime(),
        role: 'ai'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectionStatus(null);
    }
  };

  const handleUseModel = (model) => {
    setActiveModel(model);
    setSuggestion(null);
    const systemMessage = {
      id: Date.now(),
      type: 'ai',
      content: `🚀 Switched to ${model.name}. You are now chatting with this model.`,
      timestamp: getCurrentTime(),
      role: 'ai'
    };
    const updatedMessages = [...messages, systemMessage];
    setMessages(updatedMessages);
    saveChat(updatedMessages);
  };

  const handleQuickExample = (example) => {
    handleSendMessage(example);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Active Model Header Banner */}
      {activeModel && (
        <div className="bg-slate-100 dark:bg-[#1E293B] border-b border-[#2563EB]/20 px-4 md:px-6 py-2 flex items-center justify-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">
            Active Model: <span className="text-[#2563EB] font-bold">{activeModel.name}</span>
          </span>
          <button
            onClick={() => setActiveModel(null)}
            className="ml-2 text-[10px] text-gray-400 hover:text-white underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Main Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scroll-smooth chat-container"
      >
        {messages.length === 0 && !isLoading && !selectionStatus && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">How can I help you?</h2>
            <p className="text-gray-400 text-lg">
              Start by typing a prompt. I'll automatically choose the best AI models for your specific task using real-time intelligence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {quickExamples.map((example) => (
                <button
                  key={example}
                  onClick={() => handleSendMessage(example)}
                  className="px-4 py-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-gray-800 rounded-xl text-sm text-slate-600 dark:text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:text-white transition-all text-left shadow-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <ChatMessage
              message={message.content}
              timestamp={message.timestamp}
              isUser={message.type === 'user'}
            />

            {message.autoSelected && message.recommendation && (
              <AutoSelectionFlow
                status="complete"
                recommendation={message.recommendation}
                alternative={message.alternative}
                onUseModel={handleUseModel}
                onSwitchModel={handleUseModel}
              />
            )}

            {/* Suggestion Card (only after the VERY last AI message) */}
            {suggestion && index === messages.length - 1 && message.type === 'ai' && (
              <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 max-w-lg w-full backdrop-blur-md shadow-lg flex items-start gap-4">
                  <div className="bg-blue-500 rounded-full p-2 text-white shrink-0 mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-blue-400 font-semibold mb-1">Switch to {suggestion.suggested_model}?</h4>
                      <button onClick={() => setSuggestion(null)} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{suggestion.reason}</p>
                    <button
                      onClick={() => handleUseModel({ name: suggestion.suggested_model, provider: suggestion.provider })}
                      className="bg-[#2563EB] hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    >
                      Use {suggestion.suggested_model}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {selectionStatus && selectionStatus !== 'complete' && (
          <AutoSelectionFlow status={selectionStatus} />
        )}

        {isLoading && !selectionStatus && (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse px-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
            <span className="text-sm">Finding the best AI...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="shrink-0">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}