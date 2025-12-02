import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useChatStore } from '../../useChatStore.ts';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { OpenRouter } from '@openrouter/sdk';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';


export const Route = createFileRoute('/chat/$uuid')({
  component: RouteComponent,
})

function RouteComponent() {
  const { uuid } = useParams({ from: '/chat/$uuid'});
  const navigate = useNavigate();
  const { chats, addUserMessage, addAssistantMessage, appendAssistantDelta } = useChatStore();
  const messages = chats[uuid] || [];
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) navigate({ to: "/"})
  }, [messages]);

  const sendMessage = async (prompt: string) => {
    setLoading(true);

    abortRef.current = new AbortController();
    const controller = abortRef.current;

    try {
      const openRouter = new OpenRouter({
        apiKey: import.meta.env.VITE_API_KEY
      });

      const stream = await openRouter.chat.send({
        model: "openai/gpt-5-mini",
        messages: [...messages, { role: "user", content: prompt }],
        stream: true,
        streamOptions: { includeUsage: true },
      }, {
        signal: controller.signal,
      });

      addAssistantMessage(uuid, "");

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) appendAssistantDelta(uuid, delta);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "user" && !loading && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      sendMessage(messages[0].content);
    }
  }, [messages]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    addUserMessage(uuid, question);

    const msg = question;
    setQuestion("");

    await sendMessage(msg);
  };
  return (
    <div className="max-w-[768px] mx-auto flex flex-col p-[20px]">
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
          className="flex-1 p-2 rounded-xl border"
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
          <BsFillPauseFill />
        </button>
        <button
          type="submit"
          className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          <BsFillPlayFill />
        </button>
      </form>
    </div>
  );
}
