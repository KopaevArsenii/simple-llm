export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  title: string;
  messages: Message[];
};
