import { ChatHome } from "@/components/chat-components/chat-home";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export default async function Home() {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  return (
    <div className="absolute inset-0 flex flex-1 flex-col w-full min-h-screen max-h-[100vdh] bg-zinc-800">
      <ChatHome currentUserId={user?._id as Id<"users">} initialMessages={[]} />
    </div>
  );
}
