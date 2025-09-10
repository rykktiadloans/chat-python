import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/userStore";
import type { Message as IMessage } from "../model/message";
import { fetchMessagePage } from "../api/messages";
import useInfiniteScroll from "react-infinite-scroll-hook";
import MessageForm from "./MessageForm";
import Message from "./Message";

interface Props {
  other: string;
  setSelectedMessageId: (id: number) => void;
  setSelectedMessageContent: (content: string) => void;
  setShowOverlay: () => void;
  setOverlay: () => void;
  reloadMessages: number;
}

function MessageList({
  other,
  setSelectedMessageId,
  setSelectedMessageContent,
  setShowOverlay,
  setOverlay,
  reloadMessages
}: Props) {
  const token = useUserStore((state) => state.user!.token);
  const username = useUserStore((state) => state.user!.credentials.username)!;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (scrollRef.current === null || last || isLoading) {
      return;
    }
    if (scrollRef.current.scrollTop < 200) {
      setIsLoading(true);
      fetchMessagePage(other, page, offset, token).then((fetched) => {
        setMessages((prev) => {
          const ids = prev.map((m) => m.id);
          const newMessages = fetched.filter((m) => !ids.includes(m.id));
          return [...prev, ...newMessages];
        });
        setPage((page) => page + 1);
        if (fetched.length < 20) {
          setLast(true);
        }
        setIsLoading(false);
      });
    }
  };

  const refreshTop = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetchMessagePage(other, 0, 0, token).then((fetched) => {
      setMessages((messages) => {
        const ids = messages.map((m) => m.id);
        const newMessages = fetched.filter((m) => !ids.includes(m.id));
        setOffset((offset) => offset + newMessages.length);
        return [...newMessages, ...messages];
      });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (other === "") {
      return;
    }

    setPage(0);
    setOffset(0);
    setMessages([]);
    setLast(false);

    setIsLoading(true);
    fetchMessagePage(other, 0, 0, token).then((fetched) => {
      setMessages(fetched);
      if (fetched.length < 20) {
        setLast(true);
      }
      setIsLoading(false);
    });

    let timer = setInterval(() => refreshTop(), 1000);

    return () => {
      clearInterval(timer);
    };
  }, [other, reloadMessages]);

  const increaseOffset = () => {
    setOffset((offset) => offset + 1);
    refreshTop();
  };

  if (other === "") {
    return <></>;
  }

  return (
    <>
      <div className="p-3">
        <div className="flex flex-col justify-center items-baseline p-2 w-full h-full border border-gray-400 rounded-md bg-white">
          {other}
        </div>
      </div>
      <div
        className="flex flex-col-reverse p-3 gap-2 overflow-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {messages.map((m) => (
          <Message
            key={m.id}
            isSelf={m.senderUsername === username}
            content={m.content}
            sentAt={m.sentAt}
            attachments={m.attachments}
            onDoubleClick={() => {
              if (m.senderUsername !== username) {
                return;
              }
              setSelectedMessageId(m.id);
              setSelectedMessageContent(m.content);
              setShowOverlay();
              setOverlay();
            }}
          />
        ))}
      </div>
      <MessageForm other={other} increaseOffset={increaseOffset} />
    </>
  );
}

export default MessageList;
