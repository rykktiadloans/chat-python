import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import Message from "../components/Message";
import { logout, selectToken, selectUsername } from "../stores/user/userSlice";
import { useNavigate } from "react-router";
import { useEffect, useState, type ReactNode } from "react";
import { contactFromJson, type Contact as IContact } from "../model/contact.ts";
import { messageFromJson, type Message as IMessage } from "../model/message.ts";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useUserDispatch } from "../stores/user/userStore.ts";

type Overlays = "new-contact" | "edit-message";

function Chat() {
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const navigate = useNavigate();

  const dispatch = useUserDispatch();

  const [contacts, setContacts] = useState<IContact[]>([]);
  const [contactFilter, setContactFilter] = useState("");
  const [other, setOther] = useState("");

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState(0);
  const [full, setFull] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messageToSend, setMessageToSend] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const displayContacts = contacts.filter((contact) => contact.other.includes(contactFilter));

  const [overlay, setOverlay] = useState<Overlays>("new-contact");
  const [showOverlay, setShowOverlay] = useState(false);

  const [newContact, setNewContact] = useState("");
  const [error, setError] = useState("");

  const [selectedMessageId, setSelectedMessageId] = useState(0);
  const [selectedMessageContent, setSelectedMessageContent] = useState("");

  const initMessages = () => {
    setIsLoading(true);
    if (other === "") {
      setIsLoading(false);
      return;
    }
    fetch(`/api/v1/messages?recipient_username=${other}&page=0&size=20`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json: any) => json.map((el: any) => messageFromJson(el)))
      .then((newMessages: IMessage[]) => {
        setMessages(newMessages);
        setPage(1);
        if (newMessages.length < 20) {
          setFull(true);
        }
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const newMessages = () => {
    setIsLoading(true);
    if (other === "") {
      setIsLoading(false);
      return;
    }
    fetch(`/api/v1/messages?recipient_username=${other}&page=${page}&size=20`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json: any) => json.map((el: any) => messageFromJson(el)))
      .then((newMessages: IMessage[]) => {
        const t = [...messages, ...newMessages];
        setMessages(t);
        setPage((prev) => prev + 1);
        if (newMessages.length < 20) {
          setFull(true);
        }
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (token === null || username === undefined) {
      navigate("/login");
    }
    setPage(0);
    //setMessages([]);
    setMessageToSend("");
    setFiles(null);
    setFull(false);

    fetch("/api/v1/users/contacts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json: any) => json.map((el: any) => contactFromJson(el)))
      .then((newContacts) => setContacts(newContacts))
      .catch((error) => console.log(error));

    if (other !== "") {
      initMessages();
    }

    let timer = setInterval(() => {
      fetch("/api/v1/users/contacts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((json: any) => json.map((el: any) => contactFromJson(el)))
        .then((newContacts) => setContacts(newContacts))
        .catch((error) => console.log(error));

      if (other !== "") {
        fetch(`/api/v1/messages?recipient_username=${other}&page=0&size=20`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((json: any) => json.map((el: any) => messageFromJson(el)))
          .then((newMessages: IMessage[]) => {
            const pass = newMessages.filter(
              (el) => messages.find((m) => m.id === el.id) !== undefined,
            );
            setMessages((prev) => pass.concat(prev));
          })
          .catch((error) => console.log(error));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [other]);

  const [infiniteRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: !full,
    onLoadMore: newMessages,
    rootMargin: "50px 0px 0px 0px",
  });

  const onSendMessage = () => {
    if (other === "" || (messageToSend === "" && files === null)) {
      return;
    }
    const form = new FormData();
    form.append("content", messageToSend);
    form.append("recipient_username", other);
    if (files !== null) {
      for (let file of files) {
        form.append("attachments", file);
      }
    }
    fetch(`/api/v1/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    })
      .then((response) => response.json())
      .then(() => {
        setMessageToSend("");
        setFull(false);
        setFiles(null);
        initMessages();
      })
      .catch((error) => console.log(error));
  };

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
            setFull(false);
            initMessages();
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
            setFull(false);
            initMessages();
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
              className="transition-colors w-20 h-10 shrink-0 bg-red-400 text-white rounded-md hover:bg-white hover:text-red-400 active:bg-red-400 active:text-white"
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
      <div className="size-full grid grid-cols-[12rem_1fr] sm:grid-cols-[16rem_1fr] grid-rows-[4rem_1fr_4rem] bg-gray-200">
        <div className="flex flex-row justify-center items-center p-3 gap-2">
          <button
            className="transition-colors w-10 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white"
            onClick={() => {
              dispatch(logout());
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
        <div className="p-3">
          <div className="flex flex-col justify-center items-baseline p-2 w-full h-full border border-gray-400 rounded-md bg-white">
            {other}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-3 overflow-scroll">
          {displayContacts.map((contact) => (
            <Contact
              key={contact.other}
              selected={contact.other == other}
              username={contact.other}
              content={contact.content}
              sentAt={contact.sentAt}
              setOther={setOther}
            />
          ))}
        </div>
        <div className="flex flex-col-reverse p-3 gap-2 overflow-scroll" ref={infiniteRef}>
          {messages.map((m, index) => (
            <Message
              key={index}
              isSelf={m.senderUsername === username}
              content={m.content}
              sentAt={m.sentAt}
              attachments={m.attachments}
              onDoubleClick={() => {
                setSelectedMessageId(m.id);
                setSelectedMessageContent(m.content);
                setShowOverlay(true);
                setOverlay("edit-message");
              }}
            />
          ))}
        </div>
        <div className="p-3">
          <button
            className="transition-colors w-full h-full shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400"
            onClick={onNewContact}
          >
            New contact
          </button>
        </div>
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
      </div>
    </main>
  );
}

export default Chat;
