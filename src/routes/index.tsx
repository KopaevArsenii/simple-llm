import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect, type FormEvent } from 'react';
import { OpenRouter } from '@openrouter/sdk';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useChatStore } from '../useChatStore.ts';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const uuid = 'testUuid'

function RouteComponent() {
  const { chats, addUserMessage, addAssistantMessage, appendAssistantDelta } = useChatStore();
  const messages = chats[uuid];
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e:FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    if (!question.trim()) return;

    // const userMessage: Message = { role: "user", content: question };
    // setMessages(prev => [...prev, userMessage]);
    addUserMessage(uuid, question)
    setQuestion("");
    setLoading(true);


    abortRef.current = new AbortController();
    const controller = abortRef.current;

    try {
      const openRouter = new OpenRouter({ apiKey: import.meta.env.VITE_API_KEY });

      const stream = await openRouter.chat.send({
        model: "openai/gpt-5-mini",
        messages: [...messages, { role: "user", content: question}],
        stream: true,
        streamOptions: { includeUsage: true },
      }, {
        signal: controller.signal,
      });

      addAssistantMessage(uuid, "")

      for await (const chunk of stream) {
        if (chunk.choices?.length) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            appendAssistantDelta(uuid, delta)
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[768px] mx-auto  flex flex-col p-[20px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[80%] min-h-[48px] ${
              msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
            }`}
          >
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <SyntaxHighlighter
                      // eslint-disable-next-line
                      // @ts-ignore
                      style={oneLight}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex space-x-2 items-center fixed bottom-[20px] w-[768px] bg-gray-100"
      >
        <input
          type="text"
          className="flex-1 p-3 rounded-xl border"
          placeholder="Enter message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={!loading}
          onClick={() => abortRef.current?.abort()}
        >
          Pause
        </button>
        <button
          type="submit"
          className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
