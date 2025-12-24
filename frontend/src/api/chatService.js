
// Simple LocalStorage wrapper to replace Base44 backend

const STORAGE_KEY = 'oasis_chats';

const getChats = () => {
    const chats = localStorage.getItem(STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
};

const saveChats = (chats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
};

export const ChatService = {
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
