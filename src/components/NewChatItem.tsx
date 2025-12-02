import type { FC } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";

export const NewChatItem: FC = () => {
  return (
    <a href="/" className="flex items-center gap-2 hover:text-gray-500 mb-4">
      <div className="flex-1">New chat</div>
      <BsFillPlusCircleFill />
    </a>
  );
};
