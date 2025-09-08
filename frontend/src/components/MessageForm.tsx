import { useState } from "react";
import { sendMessage } from "../api/messages";
import { useUserStore } from "../stores/userStore";

interface Props {
  other: string;
  increaseOffset: () => void;
}

function MessageForm({ other, increaseOffset }: Props) {
  const token = useUserStore((state) => state.user!.token);
  const [messageToSend, setMessageToSend] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const onSendMessage = () => {
    if (other === "" || (messageToSend === "" && files === null)) {
      return;
    }
    sendMessage(other, messageToSend, files, token);
    setMessageToSend("");
    setFiles(null);
    increaseOffset();
  };

  return (
    <div className="flex flex-row justify-center items-center p-3 gap-2">
      <label
        htmlFor="files"
        className="transition-colors flex justify-center items-center w-10 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
      >
        {files !== null ? files.length : "File"}
      </label>
      <input
        type="file"
        className="hidden"
        id="files"
        name="files"
        onChange={(event) => {
          if (event.target.files === null) {
            return;
          }
          if (event.target.files.length > 5) {
            console.log("Too many files!");
          }
          setFiles(event.target.files);
        }}
      />
      <input
        type="text"
        placeholder="Message"
        className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
        value={messageToSend}
        onChange={(event) => setMessageToSend(event.target.value)}
      />
      <button
        className="transition-colors p-2 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
        onClick={onSendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default MessageForm;
