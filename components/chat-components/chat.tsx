// // components/chat-components/Chat.tsx
// "use client";

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useQuery, useMutation } from "convex/react";

// import { fetchMutation } from "convex/nextjs";
// import { useChat } from "@ai-sdk/react";
// import { toast } from "sonner";
// import { Attachment, UIMessage } from "ai";
// import { api } from "@/convex/_generated/api";
// import { Doc } from "@/convex/_generated/dataModel";
// import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
// import { useAutoResume } from "@/hooks/use-auto-resume";
// import { MultimodalInput } from "./input-box";
// import { Messages } from "./messages";
// import { Button } from "../ui/button";
// import { ArchiveRestoreIcon, Loader } from "lucide-react";

// type DBMessage = Doc<"message">;

// export function Chat({
//   preloadedChat,
//   initialChatModel,
//   isReadonly,
//   currentUserId,
//   autoResume,
//   isArchived,
// }: {
//   preloadedChat: Doc<"chat">;
//   initialChatModel: string;
//   isReadonly: boolean;
//   currentUserId: string;
//   autoResume: boolean;
//   isArchived?: boolean;
// }) {
//   const params = useParams<{ slug: string }>();
//   const slug = params.slug!;
//   const router = useRouter();

//   const chatInfo = preloadedChat;
//   console.log("CHAT INFO FROM CHAT COMPONENT:", chatInfo);

//   const messagesFromDB = useQuery(api.message.getMessagesByChatId, {
//     chatId: chatInfo._id,
//   });
//   const votes = useQuery(api.votes.getVotesByChatSlug, { slug });

//   const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
//     msgs.map((m) => ({
//       id: m._id,
//       parts: m.parts as UIMessage["parts"],
//       role: m.role as UIMessage["role"],
//       content: "",
//       createdAt: new Date(m._creationTime),
//       experimental_attachments: (m.attachments as Attachment[]) || [],
//     }));
//   const initialMessages = messagesFromDB
//     ? convertToUIMessages(messagesFromDB)
//     : [];

//   const {
//     messages,
//     setMessages,
//     handleSubmit: realHandleSubmit,
//     input,
//     setInput,
//     append,
//     status,
//     stop,
//     reload,
//     experimental_resume,
//     data,
//   } = useChat({
//     id: slug,
//     initialMessages,
//     experimental_throttle: 100,
//     sendExtraMessageFields: true,
//     generateId: generateUUID,
//     fetch: fetchWithErrorHandlers,
//     experimental_prepareRequestBody: (body) => ({
//       id: slug,
//       message: body.messages.at(-1),
//       selectedChatModel: initialChatModel,
//     }),
//     onError: (err) => toast.error(err.message),
//   });

//   // 6) Auto-resume hook
//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   useAutoResume({
//     autoResume,
//     initialMessages,
//     experimental_resume,
//     data,
//     setMessages,
//   });

//   if (!messagesFromDB || votes === undefined) {
//     return (
//       <p className="w-full h-full min-h-screen flex flex-col justify-center items-center">
//         Getting chat Ready
//         <span className="animate-spin mt-5">
//           <Loader size={18} />
//         </span>
//       </p>
//     );
//   }

//   const createChat = useMutation(api.chat.createChat);
//   const handleFirstSubmit = async () => {
//     if (!chatInfo) {
//       const { slug: newSlug } = await createChat({
//         title: input,
//         userId: currentUserId,
//       });
//       router.replace(`/chat/${newSlug}`);
//       return;
//     }
//     realHandleSubmit();
//   };

//   // 9) Unarchive
//   const handleUnArchive = async () => {
//     await fetchMutation(api.chat.unarchiveChat, {
//       slug,
//       userId: currentUserId,
//     });
//     toast.success("Chat Unarchived!");
//     router.refresh();
//   };

//   const effectiveReadOnly = isReadonly || chatInfo.isArchived === true;

//   return (
//     <div className="flex flex-col h-full bg-background">
//       <Messages
//         chatId={slug}
//         status={status}
//         votes={votes}
//         messages={messages}
//         setMessages={setMessages}
//         reload={reload}
//         isReadonly={effectiveReadOnly}
//         isArtifactVisible={false}
//         append={append}
//         setInput={setInput}
//         currentUserId={currentUserId}
//       />

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleFirstSubmit();
//         }}
//         className="flex mx-auto px-4 pb-4 gap-2 w-full max-w-3xl"
//       >
//         {!effectiveReadOnly && (
//           <MultimodalInput
//             chatId={slug}
//             input={input}
//             setInput={setInput}
//             handleSubmit={handleFirstSubmit}
//             status={status}
//             stop={stop}
//             attachments={attachments}
//             setAttachments={setAttachments}
//             messages={messages}
//             setMessages={setMessages}
//             append={append}
//           />
//         )}
//       </form>

//       {chatInfo.isArchived && (
//         <div className="absolute bottom-0 flex flex-col items-center p-4 space-y-3 w-full">
//           <p className="text-sm text-muted-foreground text-center max-w-sm">
//             This chat is archived. You can still view messages, but cannot send
//             new ones.
//           </p>
//           <Button size="sm" variant="outline" onClick={handleUnArchive}>
//             <ArchiveRestoreIcon /> Unarchive Chat
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
// components/chat-components/Chat.tsx
// "use client";

// import { api } from "@/convex/_generated/api";
// import { Doc } from "@/convex/_generated/dataModel";
// import { useAutoResume } from "@/hooks/use-auto-resume";
// import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
// import { useChat } from "@ai-sdk/react";
// import { Attachment, UIMessage } from "ai";
// import { fetchMutation } from "convex/nextjs";
// import { useQuery } from "convex/react";
// import { ArchiveRestoreIcon, Loader } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { MultimodalInput } from "./input-box";
// import { Messages } from "./messages";

// type DBMessage = Doc<"message">;

// export function Chat({
//   chatInfo,
//   initialChatModel,
//   isReadonly,
//   currentUserId,
//   autoResume,
//   isArchived,
// }: {
//   chatInfo: Doc<"chat">;
//   initialChatModel: string;
//   isReadonly: boolean;
//   currentUserId: string;
//   autoResume: boolean;
//   isArchived?: boolean;
// }) {
//   const { slug } = useParams<{ slug: string }>()!;
//   const router = useRouter();
//   const messagesFromDB = useQuery(api.message.getMessagesByChatId, {
//     chatId: chatInfo._id,
//   });
//   const votes = useQuery(api.votes.getVotesByChatSlug, { slug });
//   const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
//     msgs.map((m) => ({
//       id: m._id,
//       parts: m.parts as UIMessage["parts"],
//       role: m.role as UIMessage["role"],
//       content: "",
//       createdAt: new Date(m._creationTime),
//       experimental_attachments: (m.attachments as Attachment[]) || [],
//     }));
//   const initialMessages = messagesFromDB
//     ? convertToUIMessages(messagesFromDB)
//     : [];

//   const {
//     messages,
//     setMessages,
//     handleSubmit,
//     input,
//     setInput,
//     append,
//     status,
//     stop,
//     reload,
//     experimental_resume,
//     data,
//   } = useChat({
//     id: slug,
//     initialMessages: initialMessages,
//     experimental_throttle: 100,
//     sendExtraMessageFields: true,
//     generateId: generateUUID,
//     fetch: fetchWithErrorHandlers,
//     experimental_prepareRequestBody: (body) => ({
//       id: slug,
//       message: body.messages.at(-1),
//       selectedChatModel: initialChatModel,
//     }),
//     onError: (err) => toast.error(err.message),
//   });

//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   useAutoResume({
//     autoResume,
//     initialMessages,
//     experimental_resume,
//     data,
//     setMessages,
//   });
//   if (!messagesFromDB || votes === undefined) {
//     return (
//       <p className="w-full h-full min-h-screen flex flex-col justify-center items-center">
//         Getting chat ready…
//         <span className="animate-spin mt-5">
//           <Loader size={24} />
//         </span>
//       </p>
//     );
//   }

//   const handleUnArchive = async () => {
//     await fetchMutation(api.chat.unarchiveChat, {
//       slug,
//       userId: currentUserId,
//     });
//     toast.success("Chat unarchived!");
//     router.refresh();
//   };

//   const effectiveReadOnly = isReadonly || chatInfo.isArchived === true;

//   return (
//     <div className="flex flex-col h-full bg-background">
//       <Messages
//         chatId={slug}
//         status={status}
//         votes={votes}
//         messages={messages}
//         setMessages={setMessages}
//         reload={reload}
//         isReadonly={effectiveReadOnly}
//         isArtifactVisible={false}
//         append={append}
//         setInput={setInput}
//         currentUserId={currentUserId}
//       />

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//         className="flex mx-auto px-4 gap-2 w-full max-w-3xl"
//       >
//         {!effectiveReadOnly && (
//           <MultimodalInput
//             chatId={slug}
//             input={input}
//             setInput={setInput}
//             handleSubmit={handleSubmit}
//             status={status}
//             stop={stop}
//             attachments={attachments}
//             setAttachments={setAttachments}
//             messages={messages}
//             setMessages={setMessages}
//             append={append}
//           />
//         )}
//       </form>

//       {chatInfo.isArchived && (
//         <div className="absolute bottom-0 flex flex-col items-center p-4 space-y-3 w-full">
//           <p className="text-sm text-muted-foreground text-center max-w-sm">
//             This chat is archived—you can view messages, but not send new ones.
//           </p>
//           <Button size="sm" variant="outline" onClick={handleUnArchive}>
//             <ArchiveRestoreIcon /> Unarchive Chat
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChat } from "@ai-sdk/react";
import { Attachment, UIMessage } from "ai";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { fetchMutation } from "convex/nextjs";
import { ArchiveRestoreIcon, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { MultimodalInput } from "./input-box";
import { Messages } from "./messages";
import { toast } from "sonner";

type DBMessage = Doc<"message">;

export function Chat({
  chatInfo,
  initialChatModel,
  isReadonly,
  currentUserId,
  autoResume,
  isArchived,
}: {
  chatInfo: Doc<"chat">;
  initialChatModel: string;
  isReadonly: boolean;
  currentUserId: string;
  autoResume: boolean;
  isArchived?: boolean;
}) {
  const { slug } = useParams<{ slug: string }>()!;
  const router = useRouter();

  // 1. Live-subscribe to DB messages
  const dbMessages = useQuery(api.message.getMessagesByChatId, {
    chatId: chatInfo._id,
  });

  // 2. Convert DB messages into UIMessage shape
  const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
    msgs.map((m) => ({
      id: m._id,
      parts: m.parts as UIMessage["parts"],
      role: m.role as UIMessage["role"],
      content: "",
      createdAt: new Date(m._creationTime),
      experimental_attachments: (m.attachments as Attachment[]) || [],
    }));

  const uiFromDB = dbMessages ? convertToUIMessages(dbMessages) : [];

  // 3. Initialize AI-SDK chat with the DB snapshot
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
    id: slug,
    initialMessages: uiFromDB,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id: slug,
      message: body.messages.at(-1),
      selectedChatModel: initialChatModel,
    }),
    onError: (err) => toast.error(err.message),
  });

  // 4. Sync live DB updates into the chat state
  useEffect(() => {
    // Overwrite the AI-SDK state with the latest from Convex
    setMessages(uiFromDB);
  }, [JSON.stringify(uiFromDB), setMessages]);

  // 5. Auto-resume logic, loading states, etc.
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  useAutoResume({
    autoResume,
    initialMessages: uiFromDB,
    experimental_resume,
    data,
    setMessages,
  });

  if (!dbMessages) {
    return (
      <p className="w-full h-full min-h-screen flex flex-col justify-center items-center">
        Getting chat ready…
        <span className="animate-spin mt-5">
          <Loader size={24} />
        </span>
      </p>
    );
  }

  const effectiveReadOnly = isReadonly || chatInfo.isArchived === true;

  const handleUnArchive = async () => {
    await fetchMutation(api.chat.unarchiveChat, {
      slug,
      userId: currentUserId,
    });
    toast.success("Chat unarchived!");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Messages
        chatId={slug}
        status={status}
        votes={[]}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={effectiveReadOnly}
        isArtifactVisible={false}
        append={append}
        setInput={setInput}
        currentUserId={currentUserId}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex mx-auto px-4 gap-2 w-full max-w-3xl"
      >
        {!effectiveReadOnly && (
          <MultimodalInput
            chatId={slug}
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
          />
        )}
      </form>

      {chatInfo.isArchived && (
        <div className="absolute bottom-0 flex flex-col items-center p-4 space-y-3 w-full">
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            This chat is archived—you can view messages, but not send new ones.
          </p>
          <Button size="sm" variant="outline" onClick={handleUnArchive}>
            <ArchiveRestoreIcon /> Unarchive Chat
          </Button>
        </div>
      )}
    </div>
  );
}
