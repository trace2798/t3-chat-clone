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
import { Button } from "../ui/button";
import { ArchiveRestoreIcon } from "lucide-react";
import { fetchMutation } from "convex/nextjs";
import { useAutoResume } from "@/hooks/use-auto-resume";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  isReadonly,
  currentUserId,
  autoResume,
  isArchived,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  isReadonly: boolean;
  currentUserId: string;
  autoResume: boolean;
  isArchived?: boolean;
}) {
  const router = useRouter();
  const [slugId, setSlugId] = useState(id || "");
  const [hasCreatedChat, setHasCreatedChat] = useState(Boolean(id));

  const createChat = useMutation(api.chat.createChat);
  const chatInfo = useQuery(
    api.chat.getChatBySlug,
    slugId ? { slug: slugId } : "skip"
  );
  if (chatInfo === "Chat not found") return null;

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
    experimental_resume,
    data,
  } = useChat({
    id: slugId,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id: slugId,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
    }),
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

  const handleUnArchive = async () => {
    await fetchMutation(api.chat.unarchiveChat, {
      slug: slugId,
      userId: currentUserId,
    });
    toast.success("Chat Unarchived!");
    router.refresh();
  };
  const effectiveReadOnly = isReadonly || chatInfo?.isArchived === true;

  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });
  const votes = useQuery(api.votes.getVotesByChatSlug, {
    slug: slugId,
  });
  if (votes === undefined) {
    // Still loading
    return <></>;
  }

  console.log("Votes Query", votes);
  console.log("slugId", slugId);
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages
        chatId={slugId}
        status={status}
        votes={votes}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={isReadonly}
        isArtifactVisible={false}
        append={append}
        setInput={setInput}
        currentUserId={currentUserId}
      />
      <form className="flex mx-auto px-4 bg-background pb-0 gap-2 w-full md:max-w-3xl">
        {!effectiveReadOnly && (
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
      {chatInfo && chatInfo.isArchived === true && (
        <div className=" absolute bottom-20 flex flex-col space-y-3 p-4 w-full justify-center items-center">
          <p className="text-sm text-muted-foreground w-full max-w-sm text-center">
            This chat is archived. You can still view the messages, but you
            cannot send new messages.
          </p>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => handleUnArchive()}
          >
            <ArchiveRestoreIcon />
            UnArchive Chat
          </Button>
        </div>
      )}
    </div>
  );
}
