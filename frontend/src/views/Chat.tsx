import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import Message from "../components/Message";
import { selectToken, selectUsername } from "../stores/user/userSlice";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { contactFromJson, type Contact as IContact } from "../model/contact.ts";
import { messageFromJson, type Message as IMessage } from "../model/message.ts";
import useInfiniteScroll from "react-infinite-scroll-hook";

function Chat() {
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const navigate = useNavigate();

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

      fetch(`/api/v1/messages?recipient_username=${other}&page=0&size=20`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((json: any) => json.map((el: any) => messageFromJson(el)))
        .then((newMessages: IMessage[]) => {
          const pass = newMessages
            .filter(el => messages.find(m => m.id === el.id) === undefined)
          setMessages(prev => pass.concat(prev));
        })
        .catch((error) => console.log(error));
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

  return (
    <main className="w-full h-screen grid grid-cols-[12rem_1fr] sm:grid-cols-[16rem_1fr] grid-rows-[4rem_1fr_4rem] bg-gray-200">
      <div className="flex flex-row justify-center items-center p-3 gap-2">
        <button className="transition-colors w-10 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white">
          Opt
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
          />
        ))}
      </div>
      <div className="p-3">
        <button className="transition-colors w-full h-full shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400">
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
    </main>
  );
}

export default Chat;
