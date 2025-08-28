import Attachment from "./Attachment";

interface Props {
  isSelf: boolean;
  content: string;
  sentAt: Date;
  attachments: [
    {
      originalName: string;
      storedName: string;
    },
  ];
  onDoubleClick: () => void;
}


function Message({ isSelf, content, sentAt, attachments, onDoubleClick }: Props) {
  const date = `${sentAt.getHours()}:${sentAt.getMinutes()} ${sentAt.getDate()}/${sentAt.getMonth() + 1}`;
  const selfStyle = isSelf
    ? "bg-emerald-400 border-transparent text-white self-end"
    : "bg-white border-gray-400";
  return (
    <div
      className={"w-full sm:w-80 flex flex-col align-baseline p-2 border rounded-md " + selfStyle}
      onDoubleClick={onDoubleClick}
    >
      <div>{content}</div>
      {attachments.map((el) => (
        <Attachment key={el.storedName} originalName={el.originalName} storedName={el.storedName} />
      ))}
      <div className="text-sm">{date}</div>
    </div>
  );
}

export default Message;
