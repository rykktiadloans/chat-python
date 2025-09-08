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

type Overlays = "new-contact" | "edit-message";

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

  const [overlay, setOverlay] = useState<Overlays>("new-contact");
  const [showOverlay, setShowOverlay] = useState(false);

  const [newContact, setNewContact] = useState("");
  const [error, setError] = useState("");

  const [selectedMessageId, setSelectedMessageId] = useState(0);
  const [selectedMessageContent, setSelectedMessageContent] = useState("");

  const onNewContact = () => {
    setShowOverlay(true);
    setOverlay("new-contact");
  };

  const overlayContent = () => {
    if (overlay === "new-contact") {
      const check = () => {
        fetch(`/api/v1/users/exists/${newContact}`)
          .then((response) => response.json())
          .then((res) => {
            if (res) {
              setOther(newContact);
              setShowOverlay(false);
              setNewContact("");
            } else {
              setError("User not found");
            }
          })
          .catch((error) => console.log(error));
      };
      return (
        <>
          <input
            type="text"
            placeholder="New contact"
            className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
            value={newContact}
            onChange={(event) => setNewContact(event.target.value)}
          />
          <div className="flex flex-row gap-2">
            <button
              onClick={check}
              className="transition-colors w-16 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            >
              Check
            </button>
            <button
              onClick={() => setShowOverlay(false)}
              className="transition-colors w-16 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            >
              Close
            </button>
          </div>
          <div
            className={
              "flex flex-col gap-0.5 text-red-500 border border-red-500 rounded-md p-2 font-bold " +
              (error.length === 0 ? "hidden" : "")
            }
          >
            <p>{error}</p>
          </div>
        </>
      );
    }
    if (overlay === "edit-message") {
      const patch = () => {
        fetch(`/api/v1/messages/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedMessageId,
            content: selectedMessageContent,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            setShowOverlay(false);
          })
          .catch((error) => setError(error));
      };
      const deleteMessage = () => {
        fetch(`/api/v1/messages/${selectedMessageId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then(() => {
            setShowOverlay(false);
          })
          .catch((error) => setError(error));
      };
      return (
        <>
          <input
            type="text"
            placeholder="New contact"
            className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
            value={selectedMessageContent}
            onChange={(event) => setSelectedMessageContent(event.target.value)}
          />
          <div className="flex flex-row gap-2">
            <button
              onClick={patch}
              className="transition-colors w-28 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            >
              Send edit
            </button>
            <button
              onClick={deleteMessage}
              className="transition-colors w-16 h-10 shrink-0 bg-red-400 text-white rounded-md hover:bg-white hover:text-red-400 active:bg-red-400 active:text-white"
            >
              Delete
            </button>
            <button
              onClick={() => setShowOverlay(false)}
              className="transition-colors w-16 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            >
              Close
            </button>
          </div>
          <div
            className={
              "flex flex-col gap-0.5 text-red-500 border border-red-500 rounded-md p-2 font-bold " +
              (error.length === 0 ? "hidden" : "")
            }
          >
            <p>{error}</p>
          </div>
        </>
      );
    }
  };

  if (user === null) {
    return <main></main>;
  }

  return (
    <main className="w-full h-screen ">
      <div
        className={
          "fixed w-full h-screen flex justify-center items-center bg-[#000000b0] " +
          (showOverlay ? "" : "hidden")
        }
      >
        <div className="w-full sm:w-[38rem] h-96 p-3 gap-3 flex flex-col items-start bg-gray-200 rounded-lg">
          {overlayContent()}
        </div>
      </div>
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
          setSelectedMessageId={setSelectedMessageId}
          setSelectedMessageContent={setSelectedMessageContent}
          setShowOverlay={() => setShowOverlay(true)}
          setOverlay={() => setOverlay("edit-message")}
        />
      </div>
    </main>
  );
}

export default Chat;
