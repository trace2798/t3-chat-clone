"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import { ChatSDKError } from "@/lib/errors";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Attachment, UIMessage } from "ai";
import { useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { MultimodalInput } from "./input-box";
import { Messages } from "./messages";
import { VisibilityType } from "./visibility-selector";

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: string;
  autoResume: boolean;
}) {
  const { mutate } = useSWRConfig();

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    experimental_resume,
    data,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
      selectedVisibilityType: visibilityType,
    }),
    // onFinish: () => {
    //   mutate(unstable_serialize(getChatHistoryPaginationKey));
    // },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message);
      }
    },
  });
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const votes = id
    ? useQuery(api.votes.getVotesByChatId, {
        chatId: id as Id<"chat">,
      })
    : undefined;
  console.log("votes", votes);
  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={false}
          append={append}
          selectedVisibilityType={visibilityType}
          handleSubmit={handleSubmit}
        />
        <form className="flex mx-auto px-4 bg-background pb-0  gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              selectedVisibilityType={visibilityType}
            />
          )}
        </form>
      </div>
    </>
  );
}

export default Chat;
