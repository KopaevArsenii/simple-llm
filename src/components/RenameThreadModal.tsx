import { type Dispatch, type FC, type SetStateAction } from "react";

interface RenameThreadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

export const RenameThreadModal: FC<RenameThreadModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  setTitle,
}) => {
  return (
    open && (
      <div className="fixed z-10 inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4 w-[300px]">
          <h2 className="text-xl font-semibold">Rename Thread</h2>

          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              className="w-1/2 py-2 bg-gray-200 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="w-1/2 py-2 bg-black text-white rounded-md"
              onClick={onSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};
