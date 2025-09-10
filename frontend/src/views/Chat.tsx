import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import Message from "../components/Message";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { contactFromJson, type Contact as IContact } from "../model/contact.ts";
import { messageFromJson, type Message as IMessage } from "../model/message.ts";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useUserStore } from "../stores/userStore.ts";
import ContactList from "../components/ContactList.tsx";
import MessageList from "../components/MessageList.tsx";
import type { OverlayModes } from "../model/overlay.ts";
import Overlay from "../components/Overlay.tsx";

function Chat() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = user ? user.token : "";

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  });

  const logout = useUserStore((state) => state.logout);

  const [other, setOther] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [reloadMessages, setReloadMessages] = useState(0);

  const reload = () => setReloadMessages(prev => prev + 1);

  const [overlayMode, setOverlayMode] = useState<OverlayModes>("new-contact");
  const [showOverlay, setShowOverlay] = useState(false);

  const [error, setError] = useState("");

  const [selectedMessageId, setSelectedMessageId] = useState(0);
  const [selectedMessageContent, setSelectedMessageContent] = useState("");

  const onNewContact = () => {
    setShowOverlay(true);
    setOverlayMode("new-contact");
  };

  if (user === null) {
    return <main></main>;
  }

  return (
    <main className="w-full h-screen ">
      <Overlay
        mode={overlayMode}
        shouldDisplay={showOverlay}
        setShouldDisplay={setShowOverlay}
        setOther={setOther}
        selectedMessageId={selectedMessageId}
        selectedMessageContent={selectedMessageContent}
        reload={reload}
      />
      <div className="size-full grid grid-flow-col grid-cols-[12rem_1fr] sm:grid-cols-[16rem_1fr] grid-rows-[4rem_1fr_4rem] bg-gray-200">
        <div className="flex flex-row justify-center items-center p-3 gap-2">
          <button
            className="transition-colors w-10 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Out
          </button>
          <input
            type="text"
            placeholder="Search"
            className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
            value={contactFilter}
            onChange={(event) => setContactFilter(event.target.value)}
          />
        </div>
        <ContactList other={other} setOther={setOther} contactFilter={contactFilter} />
        <div className="row-start-3 col-start-1 p-3">
          <button
            className="transition-colors w-full h-full shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400"
            onClick={onNewContact}
          >
            New contact
          </button>
        </div>
        <MessageList
          other={other}
          reloadMessages={reloadMessages}
          setSelectedMessageId={setSelectedMessageId}
          setSelectedMessageContent={setSelectedMessageContent}
          setShowOverlay={() => setShowOverlay(true)}
          setOverlay={() => setOverlayMode("edit-message")}
        />
      </div>
    </main>
  );
}

export default Chat;
