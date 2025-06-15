import { Chat } from "@/components/chat-components/chat";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

// import { Attachment, UIMessage } from "ai";
import { fetchQuery, preloadedQueryResult } from "convex/nextjs";
import { Home } from "lucide-react";
import { preloadQuery } from "convex/nextjs";
export default async function ChatSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  const chatInfo = await fetchQuery(api.chat.getChatBySlug, { slug });
  // const preloadedChat = await preloadQuery(api.chat.getChatBySlug, { slug });
  // const chatInfo = preloadedQueryResult(preloadedChat);
  if (!chatInfo)
    return (
      <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100dvh] bg-zinc-800 items-center justify-center space-y-5">
        <h1 className="text-xl text-center">
          Oops Sorry! <br />
          Cannot find chat
        </h1>
        <a href="/">
          <Button variant={"outline"}>
            <Home />
            Back Home
          </Button>
        </a>
      </div>
    );
  if (chatInfo.visibility === "private" && chatInfo.userId !== user?._id)
    return (
      <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100dvh] bg-zinc-800 items-center justify-center space-y-5">
        <h1 className="text-xl text-center">
          Oops Sorry! <br />
          This is a private chat. You do not have access to it.
        </h1>
        <a href="/">
          <Button variant={"outline"}>
            <Home />
            Back Home
          </Button>
        </a>
      </div>
    );

  if (chatInfo.isArchived === true) {
    return (
      <Chat
        key={slug}
        chatInfo={chatInfo}
        // id={slug}
        // initialMessages={convertToUIMessages(messages)}
        initialChatModel={DEFAULT_CHAT_MODEL}
        isReadonly={true}
        currentUserId={user?._id as Id<"users">}
        autoResume={false}
        isArchived={chatInfo.isArchived}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100dvh] bg-zinc-800">
      <Chat
        key={slug}
        chatInfo={chatInfo}
        // id={slug}
        // initialMessages={convertToUIMessages(messages)}
        initialChatModel={DEFAULT_CHAT_MODEL}
        isReadonly={false}
        currentUserId={user?._id as Id<"users">}
        autoResume={false}
      />
    </div>
  );
}
