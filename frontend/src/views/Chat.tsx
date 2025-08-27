import Contact from "../components/Contact";
import Message from "../components/Message";

function Chat() {
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
        />
      </div>
      <div className="p-3">
        <div className="flex flex-col justify-center items-baseline p-2 w-full h-full border border-gray-400 rounded-md bg-white">
          First user
        </div>
      </div>
      <div className="flex flex-col gap-2 p-3 overflow-scroll">
        <Contact username="First User" selected />
        <Contact username="Second User" />
        <Contact username="Third User" />
        <Contact username="Fourth User" />
        <Contact username="Fifth User" />
        <Contact username="Sixth User" />
        <Contact username="Seventh User" />
        {
          // Yes really
        }
        <Contact username="Eighth User" />
        <Contact username="Ninth User" />
        <Contact username="Tenth User" />
        <Contact username="Eleventh User" />
        <Contact username="Twelveth User" />
        <Contact username="Thirteenth User" />
        <Contact username="Fourteenth User" />
        <Contact username="Fifteenth User" />
        <Contact username="Sixteenth User" />
        <Contact username="Seventeenth User" />
        <Contact username="Eighteenth User" />
        <Contact username="Nineteenth User" />
        <Contact username="Twentieth User" />
        <Contact username="Twenty First User" />
        <Contact username="Twenty Second User" />
        <Contact username="Twenty Third User" />
        <Contact username="Twenty Fourth User" />
      </div>
      <div className="flex flex-col-reverse p-3 gap-2 overflow-scroll">
        <Message
          isSelf
          content="Blah blah Blah blah Blah blah Blah blah Blah blah Blah blah "
          sentAt={new Date()}
        />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
        <Message isSelf content="Blah blah" sentAt={new Date()} />
        <Message isSelf={false} content="Blah blah" sentAt={new Date()} />
      </div>
      <div className="p-3">
        <button className="transition-colors w-full h-full shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400">
          New contact
        </button>
      </div>
      <div className="flex flex-row justify-center items-center p-3 gap-2">
        <input
          type="text"
          placeholder="Message"
          className="transition-colors w-full shrink p-2 border border-gray-400 rounded-md hover:border-emerald-400"
        />
        <button className="transition-colors p-2 h-10 shrink-0 bg-emerald-400 text-white rounded-md hover:bg-white hover:text-emerald-400 active:bg-emerald-400 active:text-white">
          Send
        </button>
      </div>
    </main>
  );
}

export default Chat;
