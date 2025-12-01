import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { OpenRouter } from '@openrouter/sdk';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSend = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const openRouter = new OpenRouter({ apiKey: import.meta.env.VITE_API_KEY });


      const stream = await openRouter.chat.send({
        model: "openai/gpt-5-mini",
        messages: [{ role: "user", content: question }],
        stream: true,
        streamOptions: { includeUsage: true },
      });


      let full = "";
      for await (const chunk of stream) {
        if (chunk.choices?.length) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            full += delta;
            setAnswer(full);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setAnswer("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSend}
        className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">GPT запрос</h1>


        <input
          type="text"
          className="w-full p-3 rounded-xl border"
          placeholder="Введите вопрос..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />


        <button
          type="submit"
          className="w-full p-3 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Отправка..." : "Спросить GPT"}
        </button>
      </form>


      {answer && (
        <div className="w-full max-w-xl mt-6 p-4 bg-gray-100 rounded-xl whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}