import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { contactFromJson, type Contact as IContact } from "../model/contact";
import { fetchContacts } from "../api/contacts";
import { useUserStore } from "../stores/userStore";
import Contact from "./Contact";

interface Props {
  other: string;
  setOther: Dispatch<SetStateAction<string>>;
  contactFilter: string;
}

function ContactList({ other, setOther, contactFilter }: Props) {
  const token = useUserStore((state) => state.user!.token)!;
  const [contacts, setContacts] = useState<IContact[]>([]);
  const displayContacts = contacts.filter((contact) => contact.other.includes(contactFilter));

  useEffect(() => {
    fetchContacts(token).then((newContacts) => setContacts(newContacts));

    let timer = setInterval(() => {
      fetchContacts(token).then((newContacts) => setContacts(newContacts));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 p-3 overflow-scroll">
      {displayContacts.map((contact) => (
        <Contact
          key={contact.other}
          selected={contact.other == other}
          username={contact.other}
          content={contact.content}
          sentAt={contact.sentAt}
          onClick={() => setOther(_ => contact.other)}
        />
      ))}
      {displayContacts.length === 0 ? (
        <p className="flex flex-col items-center">No contacts</p>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ContactList;
