import { Chat } from "@/components/chat-components/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

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
  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100dvh] bg-zinc-800">
      <Chat
        key={slug}
        id={slug}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        // initialVisibilityType="public"
        isReadonly={false}
        currentUserId={user?._id as Id<"users">}
        autoResume={false}
      />
    </div>
  );
}
