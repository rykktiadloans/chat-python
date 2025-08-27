interface Props {
  username: string;
  selected?: boolean;
}

function Contact({ username, selected }: Props) {
  const originalClasses = "transition-colors w-full p-2 border rounded-md";
  if (selected === undefined) {
    selected = false;
  }
  const dependantClasses = selected
    ? "bg-emerald-400 border-transparent text-white active:bg-white active:text-black"
    : "bg-white border-gray-400 hover:border-emerald-400 active:border-transparent active:bg-emerald-400 active:text-white";
  return <div className={`${originalClasses} ${dependantClasses}`}>{username}</div>;
}

export default Contact;
