import type { FC, FormEvent, KeyboardEvent } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onAbort?: () => void;
  loading?: boolean;
  scrollToBottom?: () => void;
  showScrollToBottomButton?: boolean;
}

export const QuestionInput: FC<QuestionInputProps> = ({
  value,
  onChange,
  onSubmit,
  onAbort,
  loading,
  scrollToBottom,
  showScrollToBottomButton = false,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex space-x-2 items-center fixed bottom-[20px] w-[768px] bg-gray-100"
    >
      {showScrollToBottomButton && (
        <button
          onClick={scrollToBottom}
          className="absolute left-1/2 -translate-x-1/2 -top-12 bg-black text-white w-10 h-10 rounded-full shadow-lg cursor-ppointer"
        >
          ↓
        </button>
      )}
      <input
        type="text"
        className="flex-1 p-2 rounded-xl border"
        placeholder="Enter message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button
        type="submit"
        className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
        disabled={!loading}
        onClick={onAbort}
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
  );
};
