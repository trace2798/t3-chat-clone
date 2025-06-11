import Chat from "@/components/chat-components/chat";
import { MultimodalInput } from "@/components/chat-components/input-box";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";
import { generateUUID } from "@/lib/utils";

export default function Home() {
  const id = generateUUID();
  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100vdh] bg-zinc-800">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        session={""}
        autoResume={false}
      />
    </div>
  );
}
