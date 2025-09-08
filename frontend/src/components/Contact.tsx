import type { Dispatch, SetStateAction } from "react";

interface Props {
  username: string;
  selected?: boolean;
  content: string;
  sentAt: Date;
  onClick: () => void;
}

function Contact({ username, selected, content, sentAt, onClick }: Props) {
  const originalClasses = "flex flex-col transition-colors w-full p-2 border rounded-md";
  if (selected === undefined) {
    selected = false;
  }
  const dependantClasses = selected
    ? "bg-emerald-400 border-transparent text-white active:bg-white active:text-black"
    : "bg-white border-gray-400 hover:border-emerald-400 active:border-transparent active:bg-emerald-400 active:text-white";

  const smTextColor = selected
    ? "text-white active:text-gray-400"
    : "text-gray-400 active:text-white";
  const date = `${sentAt.getHours()}:${sentAt.getMinutes()} ${sentAt.getDate()}/${sentAt.getMonth() + 1}`;

  return (
    <div className={`${originalClasses} ${dependantClasses}`} onClick={onClick}>
      <div>{username}</div>
      <div className={"text-sm " + smTextColor}>
        <div>{content.slice(0, 10)}</div>
        <div>{date}</div>
      </div>
    </div>
  );
}

export default Contact;
