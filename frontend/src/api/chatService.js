
// Simple LocalStorage wrapper to replace Base44 backend

import { apiClient } from './client';

const STORAGE_KEY = 'oasis_chats';

const getChats = () => {
    const chats = localStorage.getItem(STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
};

const saveChats = (chats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

export const ChatService = {
    // Real Backend API
    analyzePrompt: async (prompt, userId = null) => {
        const response = await apiClient.post('/ai/analyze-prompt', { prompt, user_id: userId });
        return response.data;
    },

    chat: async (message, modelName, history = []) => {
        const response = await apiClient.post('/ai/chat', {
            message,
            model_name: modelName,
            history
        });
        return response.data;
    },

    submitFeedback: async (feedbackData) => {
        const response = await apiClient.post('/feedback/feedback', feedbackData);
        return response.data;
    },

    getUsage: async () => {
        const response = await apiClient.get('/ai/usage');
        return response.data;
    },

    // LocalStorage (History)
    list: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getChats().sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
    },

    get: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getChats().find(c => c.id === id);
    },

    create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const chats = getChats();
        const newChat = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...data
        };
        chats.push(newChat);
        saveChats(chats);
        return newChat;
    },

    update: async (id, data) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const chats = getChats();
        const index = chats.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Chat not found');

        chats[index] = { ...chats[index], ...data };
        saveChats(chats);
        return chats[index];
    },

    delete: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const chats = getChats();
        const filteredChats = chats.filter(c => c.id !== id);
        saveChats(filteredChats);
        return true;
    }
};
