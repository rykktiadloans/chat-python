import { useState, type ReactElement } from "react";
import type { OverlayModes } from "../model/overlay";
import NewContactOverlay from "./NewContactOverlay";
import EditMessageOverlay from "./EditMessageOverlay";
import { deleteMessage, patchMessage } from "../api/messages";
import { useUserStore } from "../stores/userStore";

interface Props {
  mode: OverlayModes;
  shouldDisplay: boolean;
  setShouldDisplay: (newValue: boolean) => void;

  setOther: (other: string) => void;

  selectedMessageId: number;
  selectedMessageContent: string;

  reload: () => void;
}

function Overlay({
  mode,
  shouldDisplay,
  setShouldDisplay,
  setOther,
  selectedMessageId,
  selectedMessageContent,
  reload
}: Props) {
  const [error, setError] = useState("");
  const token = useUserStore((state) => state.user!.token);
  let element = <p>There should be something here.</p>;

  const onContactFound = (contact: string) => {
    setOther(contact);
    setShouldDisplay(false);
  };

  if (mode === "new-contact") {
    element = <NewContactOverlay onContactFound={onContactFound} setError={setError} />;
  }

  const onEdit = (content: string) => {
    patchMessage(selectedMessageId, content, token).then(() => {
      setShouldDisplay(false);
      reload();
    });
  };

  const onDelete = () => {
    deleteMessage(selectedMessageId, token).then(() => {
      setShouldDisplay(false);
      reload();
    });
  };

  if (mode === "edit-message") {
    element = (
      <EditMessageOverlay
        selectedMessageContent={selectedMessageContent}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div
      className={
        "fixed w-full h-screen flex justify-center items-center bg-[#000000b0] " +
        (shouldDisplay ? "" : "hidden")
      }
    >
      <div className="w-full sm:w-[38rem] h-96 p-3 gap-3 flex flex-col items-start bg-gray-200 rounded-lg">
        {element}
        <button
          onClick={() => setShouldDisplay(false)}
          className="transition-colors w-16 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
        >
          Close
        </button>
        <div
          className={
            "flex flex-col gap-0.5 text-red-500 border border-red-500 rounded-md p-2 font-bold " +
            (error.length === 0 ? "hidden" : "")
          }
        >
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
}

export default Overlay;
