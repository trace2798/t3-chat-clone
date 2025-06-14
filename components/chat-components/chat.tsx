"use client";

import { api } from "@/convex/_generated/api";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Attachment, UIMessage } from "ai";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MultimodalInput } from "./input-box";
import { Messages } from "./messages";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  isReadonly,
  currentUserId,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  isReadonly: boolean;
  currentUserId: string;
  autoResume: boolean;
}) {
  const router = useRouter();
  const [slugId, setSlugId] = useState(id || "");
  const [hasCreatedChat, setHasCreatedChat] = useState(Boolean(id));

  const createChat = useMutation(api.chat.createChat);
  const chatInfo = useQuery(
    api.chat.getChatBySlug,
    slugId ? { slug: slugId } : "skip"
  );
  // console.log("Chat Info", chatInfo);
  const {
    messages,
    setMessages,
    handleSubmit: realHandleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id: slugId,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    // experimental_prepareRequestBody: (body) => ({
    //   id: slugId,
    //   message: body.messages.at(-1),
    //   selectedChatModel: initialChatModel,
    //   selectedVisibilityType: visibilityType,
    // }),
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const handleFirstSubmit = async () => {
    if (!hasCreatedChat) {
      const { chatId, slug } = await createChat({
        title: input,
        userId: currentUserId,
      });
      setSlugId(slug);
      setHasCreatedChat(true);
      router.replace(`/chat/${slug}`);
    }
    realHandleSubmit();
  };
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages
        chatId={slugId}
        status={status}
        votes={undefined}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={isReadonly}
        isArtifactVisible={false}
        append={append}
        setInput={setInput}
      />
      <form className="flex mx-auto px-4 bg-background pb-0 gap-2 w-full md:max-w-3xl">
        {!isReadonly && (
          <MultimodalInput
            chatId={slugId}
            input={input}
            setInput={setInput}
            handleSubmit={handleFirstSubmit}
            status={status}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        )}
      </form>
    </div>
  );
}
