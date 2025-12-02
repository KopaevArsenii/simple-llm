import type { FC } from "react";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

interface ChatItemProps {
  uuid: string;
  title: string;
  onRename: () => void;
  onEdit: () => void;
}

export const ChatItem: FC<ChatItemProps> = ({
  uuid,
  title,
  onRename,
  onEdit,
}) => {
  return (
    <div className="flex gap-2 items-center min-h-10 transiton-all cursor-pointer">
      <a
        href={`/chat/${uuid}`}
        className="max-w-full truncate flex-1 hover:text-gray-500"
      >
        {title}
      </a>
      <BsFillPencilFill onClick={onRename} className="hover:fill-gray-500" />
      <BsFillTrashFill onClick={onEdit} className="hover:fill-red-500" />
    </div>
  );
};
