import type { FC, FormEvent, KeyboardEvent } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onAbort?: () => void;
  loading?: boolean;
}

export const QuestionInput: FC<QuestionInputProps> = ({
  value,
  onChange,
  onSubmit,
  onAbort,
  loading,
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
