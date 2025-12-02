import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from "uuid";

export type Message = {
  role: "user" | "assistant",
  content: string,
}

export type Chat = {
  title: string
  messages: Message[],
}

interface ChatState {
  chats: Record<string, Chat>,
  createChat: () => string,
  addUserMessage: (chatId: string, content: string) => void,
  addAssistantMessage: (chatId: string, content: string) => void,
  appendAssistantDelta: (chatId: string, delta: string) => void,
  deleteChat: (chatId: string) => void,
  renameChat: (chatId: string, title: string) => void,
}

export const useChatStore = create<ChatState>()(persist((set) => ({
  chats: {},
  addUserMessage: (chatId, content) => set(state => ({chats: {...state.chats, [chatId]: {
        ...state.chats[chatId],
        messages: [...state.chats[chatId].messages, { role: "user", content }]
      }}})),
  addAssistantMessage: (chatId, content) => set(state => ({chats: {...state.chats, [chatId]: {
        ...state.chats[chatId],
        messages: [...state.chats[chatId].messages, { role: "assistant", content }]
      }}})),
  appendAssistantDelta: (chatId, delta) => set((state) => {
    const chat = state.chats[chatId];
    if (!chat) return state;

    const { messages, title } = chat;
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
        [chatId]: {
          ...chat,
          title,
          messages: updatedMessages,
        },
      },
    };
  }),
  createChat: () => {
    const newChatUuid = uuid();
    set(state => {
      const threadNumber = Object.keys(state.chats).length + 1;
      return ({ chats: {...state.chats, [newChatUuid]: {title: `Thread ${threadNumber}`, messages: []}}})
    });
    return newChatUuid;
  },
  deleteChat: (chatId) => set((state) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [chatId]: _, ...rest } = state.chats;
    return { chats: rest };
  }),
  renameChat: (chatId, title) => set((state) => ({
    chats: {
      ...state.chats,
      [chatId]: {
        ...state.chats[chatId],
        title
      }
    }
  })),
}),{name:"chat-storage"}))