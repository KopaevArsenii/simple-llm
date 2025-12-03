import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { Chat } from "../types";

interface ChatState {
  chats: Record<string, Chat>;
  createChat: () => string;
  addUserMessage: (chatId: string, content: string) => void;
  addAssistantMessage: (chatId: string, content: string) => void;
  appendAssistantDelta: (chatId: string, delta: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
}
const updateChat = (
  state: ChatState,
  chatId: string,
  updates: Partial<Chat>,
): ChatState => {
  const chat = state.chats[chatId];
  if (!chat) return state;

  return {
    ...state,
    chats: {
      ...state.chats,
      [chatId]: { ...chat, ...updates },
    },
  };
};

const appendMessage = (
  state: ChatState,
  chatId: string,
  message: { role: "user" | "assistant"; content: string },
) => {
  const chat = state.chats[chatId];
  if (!chat) return state;

  return updateChat(state, chatId, {
    messages: [...chat.messages, message],
  });
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: {},
      addUserMessage: (chatId, content) =>
        set((state) => appendMessage(state, chatId, { role: "user", content })),
      addAssistantMessage: (chatId, content) =>
        set((state) =>
          appendMessage(state, chatId, { role: "assistant", content }),
        ),
      appendAssistantDelta: (chatId, delta) =>
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          const { messages } = chat;
          if (!messages.length) return state;

          const lastMessage = messages[messages.length - 1];

          // Only modify if last message is assistant
          if (lastMessage?.role !== "assistant") return state;

          const updatedMessages = [...messages];
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + delta,
          };

          return updateChat(state, chatId, { messages: updatedMessages });
        }),
      createChat: () => {
        const newChatUuid = uuid();
        set((state) => {
          const threadNumber = Object.keys(state.chats).length + 1;
          return {
            chats: {
              ...state.chats,
              [newChatUuid]: { title: `Thread ${threadNumber}`, messages: [] },
            },
          };
        });
        return newChatUuid;
      },
      deleteChat: (chatId) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [chatId]: _, ...rest } = state.chats;
          return { chats: rest };
        }),
      renameChat: (chatId, title) =>
        set((state) => updateChat(state, chatId, { title })),
    }),
    { name: "chat-storage" },
  ),
);
