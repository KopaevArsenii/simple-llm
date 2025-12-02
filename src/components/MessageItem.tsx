import type { FC } from "react";
import type { Message } from "../types";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface MessageItemProps {
  message: Message;
}

// eslint-disable-next-line
// @ts-ignore
const markDownIt = new MarkdownIt({
  breaks: true,
  html: false,
  // eslint-disable-next-line
  // @ts-ignore
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${markDownIt.utils.escapeHtml(code)}</code></pre>`;
  },
});

export const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const html = markDownIt.render(message.content);
  return (
    <div
      className={`p-3 rounded-xl max-w-[80%] min-h-[48px]
        ${
          message.role === "user"
            ? "bg-blue-500 text-white ml-auto"
            : "bg-gray-200 text-black"
        }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
