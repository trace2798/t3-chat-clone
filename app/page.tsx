import { Chat } from "@/components/chat-components/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export default async function Home() {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  const id = "";
  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100vdh] bg-zinc-800">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        isReadonly={false}
        currentUserId={user?._id as Id<"users">}
        autoResume={true}
      />
    </div>
  );
}
