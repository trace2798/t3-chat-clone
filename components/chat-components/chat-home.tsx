"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { UIMessage, Attachment } from "ai";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { api } from "@/convex/_generated/api";
import { fetchWithErrorHandlers } from "@/lib/utils";
import { Messages } from "./messages";
import { MultimodalInput } from "./input-box";

export function ChatHome({
  currentUserId,
  initialMessages = [],
}: {
  currentUserId: string;
  initialMessages?: UIMessage[];
}) {
  const router = useRouter();
  const createChat = useMutation(api.chat.createChat);
  const [selectedModel, setSelectedModel] = useState(
    "google/gemini-2.5-flash-lite-preview-06-17"
  );
  const [searchWeb, setSearchWeb] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const [chatId, setChatId] = useState<string>("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const {
    messages,
    setMessages,
    append,
    input,
    setInput,
    handleSubmit: realHandleSubmit,
    status,
    stop,
    reload,
  } = useChat({
    id: chatId,
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id: chatId,
      message: body.messages.at(-1),
      selectedChatModel: selectedModel,
      searchWeb,
      generateImage,
    }),
    onFinish: (message) => {
      router.replace(`/chat/${chatId}`);
      //   setMessages([]);
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("Home Chat Error", err);
    },
  });
  React.useEffect(() => {
    if (chatId) {
      realHandleSubmit();
    }
  }, [chatId, realHandleSubmit]);
  const handleFirstSubmit = async () => {
    try {
      const { slug } = await createChat({
        title: input,
        userId: currentUserId,
      });
      setChatId(slug);
    } catch (err: any) {
      console.error("Failed to start chat:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Messages
        chatId={chatId}
        status={status}
        votes={[]}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={false}
        isArtifactVisible={false}
        append={append}
        setInput={setInput}
        currentUserId={currentUserId}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFirstSubmit();
        }}
        className="flex mx-auto px-4 gap-2 w-full max-w-3xl"
      >
        <MultimodalInput
          chatId={chatId}
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
          currentUserId={currentUserId}
          isSearchMode={searchWeb}
          onSearchModeChange={setSearchWeb}
          isImageMode={generateImage}
          onImageModeChange={setGenerateImage}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </form>
    </div>
  );
}
