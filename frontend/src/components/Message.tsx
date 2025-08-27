interface Props {
  isSelf: boolean;
  content: string;
  sentAt: Date;
}

function Message({isSelf, content, sentAt}: Props) {
  const date = `${sentAt.getHours()}:${sentAt.getMinutes()} ${sentAt.getDate()}/${sentAt.getMonth() + 1}`;
  const selfStyle = isSelf ? "bg-emerald-400 border-transparent text-white self-end" : "";
  return (
    <div className={"w-full sm:w-80 flex flex-col align-baseline p-2 bg-white border border-gray-400 rounded-md " + selfStyle}>
      <div>{content}</div>
      <div className="text-sm">{date}</div>
    </div>
  )

}

export default Message;
