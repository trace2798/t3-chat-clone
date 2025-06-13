import { Chat } from "@/components/chat-components/chat";
import DemoChat from "@/components/chat-test";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";
import { generateUUID } from "@/lib/utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export default async function Home() {
   const user = await fetchQuery(
      api.users.getUser,
      {},
      { token: await convexAuthNextjsToken() }
    );
    console.log(user);
  const id = "";
  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100vdh] bg-zinc-800">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        // initialVisibilityType="public"
        isReadonly={false}
        currentUserId={user?._id as Id<"users">}
        autoResume={false}
      />
      <DemoChat/>
    </div>
  );
}
