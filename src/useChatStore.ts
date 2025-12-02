import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from "uuid";

export type Message = {
  role: "user" | "assistant",
  content: string,
}

interface ChatState {
  chats: Record<string, Message[]>,
  createChat: () => string,
  addUserMessage: (chatId: string, content: string) => void,
  addAssistantMessage: (chatId: string, content: string) => void,
  appendAssistantDelta: (chatId: string, delta: string) => void,
  deleteChat: (chatId: string) => void,
}

export const useChatStore = create<ChatState>()(persist((set) => ({
  chats: {},
  addUserMessage: (chatId, content) => set(state => ({chats: {...state.chats, [chatId]: [...state.chats[chatId], {role: "user", content}]}})),
  addAssistantMessage: (chatId, content) => set(state => ({chats: {...state.chats, [chatId]: [...state.chats[chatId], {role: "assistant", content}]}})),
  appendAssistantDelta: (chatId, delta) => set((state) => {
    const messages = state.chats[chatId] ?? [];
    if (!messages.length) return state;

    const lastMessage = messages[messages.length - 1];

    // Only modify if last message is assistant
    if (lastMessage?.role !== "assistant") return state;

    const updatedMessages = [...messages];
    updatedMessages[updatedMessages.length - 1] = {
      ...lastMessage,
      content: lastMessage.content + delta,
    };

    return {
      chats: {
        ...state.chats,
        [chatId]: updatedMessages,
      },
    };
  }),
  createChat: () => {
    const newChatUuid = uuid();
    set(state => ({ chats: {...state.chats, [newChatUuid]: []}}));
    return newChatUuid;
  },
  deleteChat: (chatId) => set((state) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [chatId]: _, ...rest } = state.chats;
    return { chats: rest };
  }),
}),{name:"chat-storage"}))