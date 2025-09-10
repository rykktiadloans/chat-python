import { useState } from "react";
import { checkIfContactExists } from "../api/contacts";

interface Props {
  onContactFound: (contact: string) => void;
  setError: (error: string) => void;
}

function NewContactOverlay({ onContactFound, setError }: Props) {
  const [contact, setContact] = useState("");

  const check = () => {
    checkIfContactExists(contact).then((result) => {
      if (result) {
        setError("");
        onContactFound(contact);
      } else {
        setError("User not found");
      }
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="New contact"
        className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
      />
      <div className="flex flex-row gap-2">
        <button
          onClick={check}
          className="transition-colors w-16 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
        >
          Check
        </button>
      </div>
    </>
  );
}

export default NewContactOverlay;
