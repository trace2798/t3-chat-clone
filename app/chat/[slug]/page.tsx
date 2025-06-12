// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";

import Chat from "@/components/chat-components/chat";
import { DEFAULT_CHAT_MODEL } from "@/lib/models";

export default async function ChatIdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  //   const chatInfo = useQuery(api.chat.getChatBySlug, { slug });
  // console.log(chatInfo);
  return (
    <div>
      {/* <Chat
        key={slug}
        id={slug}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="public"
        isReadonly={false}
        session={""}
        autoResume={false}
      /> */}
      {slug}
    </div>
  );
}
