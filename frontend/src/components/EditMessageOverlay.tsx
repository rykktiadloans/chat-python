import { useEffect, useState } from "react";

interface Props {
  selectedMessageContent: string;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

function EditMessageOverlay({ selectedMessageContent, onEdit, onDelete }: Props) {
  const [content, setContent] = useState("");
  console.log(content);

  useEffect(() => setContent(selectedMessageContent), [selectedMessageContent]);

  return (
    <>
      <input
        type="text"
        placeholder="New contact"
        className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="flex flex-row gap-2">
        <button
          onClick={() => onEdit(content)}
          className="transition-colors w-28 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
        >
          Send edit
        </button>
        <button
          onClick={onDelete}
          className="transition-colors w-16 h-10 shrink-0 bg-red-400 text-white rounded-md hover:bg-white hover:text-red-400 active:bg-red-400 active:text-white"
        >
          Delete
        </button>
      </div>
    </>
  );
}

export default EditMessageOverlay;
