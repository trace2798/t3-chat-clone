// "use client";

// import { api } from "@/convex/_generated/api";
// import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
// import { useChat } from "@ai-sdk/react";
// import { Attachment, UIMessage } from "ai";
// import { useMutation, useQuery } from "convex/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { MultimodalInput } from "./input-box";
// import { Messages } from "./messages";
// import { Button } from "../ui/button";
// import { ArchiveRestoreIcon } from "lucide-react";
// import { fetchMutation } from "convex/nextjs";
// import { useAutoResume } from "@/hooks/use-auto-resume";
// import { Doc } from "@/convex/_generated/dataModel";
// type DBMessage = Doc<"message">;
// export function Chat({
//   id,
//   // initialMessages,
//   initialChatModel,
//   isReadonly,
//   currentUserId,
//   autoResume,
//   isArchived,
// }: {
//   id: string;
//   // initialMessages: Array<UIMessage>;
//   initialChatModel: string;
//   isReadonly: boolean;
//   currentUserId: string;
//   autoResume: boolean;
//   isArchived?: boolean;
// }) {
//   const router = useRouter();
//   const [slugId, setSlugId] = useState(id || "");
//   const [hasCreatedChat, setHasCreatedChat] = useState(Boolean(id));

//   const createChat = useMutation(api.chat.createChat);
//   const chatInfo = useQuery(
//     api.chat.getChatBySlug,
//     slugId ? { slug: slugId } : "skip"
//   );
//   if (chatInfo === "Chat not found") return null;
//   const messagesFromDB = useQuery(
//     api.message.getMessagesByChatId,
//     chatInfo?._id ? { chatId: chatInfo._id } : "skip"
//   );
//   if (!chatInfo?._id || messagesFromDB === undefined) {
//     return <p>Loading messages…</p>;
//   }
//   function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
//     return messages.map((message) => ({
//       id: message._id,
//       parts: message.parts as UIMessage["parts"],
//       role: message.role as UIMessage["role"],
//       // Note: content will soon be deprecated in @ai-sdk/react
//       content: "",
//       createdAt: new Date(message._creationTime),
//       experimental_attachments:
//         (message.attachments as Array<Attachment>) ?? [],
//     }));
//   }
//   // console.log("Chat Info", chatInfo);
//   const uiMessages = convertToUIMessages(messagesFromDB);
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
//     id: slugId,
//     initialMessages: uiMessages,
//     experimental_throttle: 100,
//     sendExtraMessageFields: true,
//     generateId: generateUUID,
//     fetch: fetchWithErrorHandlers,
//     experimental_prepareRequestBody: (body) => ({
//       id: slugId,
//       message: body.messages.at(-1),
//       selectedChatModel: initialChatModel,
//     }),
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });

//   const [attachments, setAttachments] = useState<Array<Attachment>>([]);

//   const handleFirstSubmit = async () => {
//     if (!hasCreatedChat) {
//       const { chatId, slug } = await createChat({
//         title: input,
//         userId: currentUserId,
//       });
//       setSlugId(slug);
//       setHasCreatedChat(true);
//       router.replace(`/chat/${slug}`);
//     }
//     realHandleSubmit();
//   };

//   const handleUnArchive = async () => {
//     await fetchMutation(api.chat.unarchiveChat, {
//       slug: slugId,
//       userId: currentUserId,
//     });
//     toast.success("Chat Unarchived!");
//     router.refresh();
//   };
//   const effectiveReadOnly = isReadonly || chatInfo?.isArchived === true;

//   useAutoResume({
//     autoResume,
//     initialMessages: uiMessages,
//     experimental_resume,
//     data,
//     setMessages,
//   });
//   const votes = useQuery(
//     api.votes.getVotesByChatSlug,
//     slugId ? { slug: slugId } : "skip"
//   );

//   if (slugId && votes === undefined) {
//     return <></>;
//   }

//   console.log("Votes Query", votes);
//   console.log("slugId", slugId);
//   return (
//     <div className="flex flex-col min-w-0 h-dvh bg-background">
//       <Messages
//         chatId={slugId}
//         status={status}
//         votes={votes}
//         messages={messages}
//         setMessages={setMessages}
//         reload={reload}
//         isReadonly={isReadonly}
//         isArtifactVisible={false}
//         append={append}
//         setInput={setInput}
//         currentUserId={currentUserId}
//       />
//       <form className="flex mx-auto px-4 bg-background pb-0 gap-2 w-full md:max-w-3xl">
//         {!effectiveReadOnly && (
//           <MultimodalInput
//             chatId={slugId}
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
//       {chatInfo && chatInfo.isArchived === true && (
//         <div className=" absolute bottom-20 flex flex-col space-y-3 p-4 w-full justify-center items-center">
//           <p className="text-sm text-muted-foreground w-full max-w-sm text-center">
//             This chat is archived. You can still view the messages, but you
//             cannot send new messages.
//           </p>
//           <Button
//             size={"sm"}
//             variant={"outline"}
//             onClick={() => handleUnArchive()}
//           >
//             <ArchiveRestoreIcon />
//             UnArchive Chat
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import React, { useState } from "react";
// import { useParams, usePathname, useRouter } from "next/navigation";
// import { useQuery, useMutation } from "convex/react";
// import { fetchMutation } from "convex/nextjs";
// import { useChat } from "@ai-sdk/react";
// import { Attachment, UIMessage } from "ai";
// import { toast } from "sonner";

// import { api } from "@/convex/_generated/api";
// import { Doc } from "@/convex/_generated/dataModel";
// import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
// import { useAutoResume } from "@/hooks/use-auto-resume";
// import { MultimodalInput } from "./input-box";
// import { Messages } from "./messages";
// import { Button } from "../ui/button";
// import { ArchiveRestoreIcon } from "lucide-react";

// type DBMessage = Doc<"message">;

// export function Chat({
//   id: initialSlug,
//   initialChatModel,
//   isReadonly,
//   currentUserId,
//   autoResume,
//   isArchived,
// }: {
//   id: string;
//   initialChatModel: string;
//   isReadonly: boolean;
//   currentUserId: string;
//   autoResume: boolean;
//   isArchived?: boolean;
// }) {
//   const params = useParams();
//   const chatSlug = params.slug;
//   console.log("chatSlug PArams", chatSlug);
//   const router = useRouter();
//   const [slug, setSlug] = useState(initialSlug || "");

//   const [hasCreatedChat, setHasCreatedChat] = useState(Boolean(initialSlug));

//   const createChat = useMutation(api.chat.createChat);

//   const chatInfo = useQuery(api.chat.getChatBySlug, slug ? { slug } : "skip");

//   const messagesFromDB = useQuery(
//     api.message.getMessagesByChatId,
//     chatInfo?._id ? { chatId: chatInfo._id } : "skip"
//   );

//   // fetch votes for message list
//   const votes = useQuery(
//     api.votes.getVotesByChatSlug,
//     slug ? { slug } : "skip"
//   );

//   // convert DB rows into `UIMessage[]`
//   const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
//     msgs.map((m) => ({
//       id: m._id,
//       parts: m.parts as UIMessage["parts"],
//       role: m.role as UIMessage["role"],
//       content: "",
//       createdAt: new Date(m._creationTime),
//       experimental_attachments: (m.attachments as Attachment[]) || [],
//     }));

//   // once loaded, seed useChat with these
//   const initialMessages = messagesFromDB
//     ? convertToUIMessages(messagesFromDB)
//     : [];

//   // wire up the AI chat
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

//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   useAutoResume({
//     autoResume,
//     initialMessages,
//     experimental_resume,
//     data,
//     setMessages,
//   });

//   // ─── 2. CONDITIONAL RENDERING AFTER HOOKS ────────────────────────────────
//   // if the chat slug is invalid
//   if (chatInfo === "Chat not found") {
//     return null;
//   }

//   // still loading chat metadata or messages
//   if (!chatInfo?._id || messagesFromDB === undefined) {
//     return <p className="p-4 text-center">Loading chat…</p>;
//   }

//   // still loading votes
//   if (slug && votes === undefined) {
//     return <p className="p-4 text-center">Loading votes…</p>;
//   }

//   // ─── 3. EVENT HANDLERS ───────────────────────────────────────────────────
//   const handleFirstSubmit = async () => {
//     if (!hasCreatedChat) {
//       const { chatId, slug: newSlug } = await createChat({
//         title: input,
//         userId: currentUserId,
//       });
//       setSlug(newSlug);
//       setHasCreatedChat(true);
//       router.replace(`/chat/${newSlug}`);
//     }
//     realHandleSubmit();
//   };

//   const handleUnArchive = async () => {
//     await fetchMutation(api.chat.unarchiveChat, {
//       slug,
//       userId: currentUserId,
//     });
//     toast.success("Chat Unarchived!");
//     router.refresh();
//   };

//   const effectiveReadOnly = isReadonly || chatInfo.isArchived === true;

//   // ─── 4. FINAL RENDER ─────────────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-w-0 h-dvh bg-background">
//       <Messages
//         chatId={slug}
//         status={status}
//         votes={votes!}
//         messages={messages}
//         setMessages={setMessages}
//         reload={reload}
//         isReadonly={isReadonly}
//         isArtifactVisible={false}
//         append={append}
//         setInput={setInput}
//         currentUserId={currentUserId}
//       />

//       <form className="flex mx-auto px-4 bg-background pb-0 gap-2 w-full md:max-w-3xl">
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

//       {chatInfo.isArchived === true && (
//         <div className="absolute bottom-20 flex flex-col space-y-3 p-4 w-full justify-center items-center">
//           <p className="text-sm text-muted-foreground w-full max-w-sm text-center">
//             This chat is archived. You can still view messages, but cannot send
//             new ones.
//           </p>
//           <Button size="sm" variant="outline" onClick={handleUnArchive}>
//             <ArchiveRestoreIcon />
//             Unarchive Chat
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { fetchMutation } from "convex/nextjs";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { Attachment, UIMessage } from "ai";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { MultimodalInput } from "./input-box";
import { Messages } from "./messages";
import { Button } from "../ui/button";
import { ArchiveRestoreIcon } from "lucide-react";

type DBMessage = Doc<"message">;

export function Chat({
  initialChatModel,
  isReadonly,
  currentUserId,
  autoResume,
  isArchived,
}: {
  initialChatModel: string;
  isReadonly: boolean;
  currentUserId: string;
  autoResume: boolean;
  isArchived?: boolean;
}) {
  // 1. Read the slug from the URL
  const params = useParams<{ slug: string }>();
  if (!params?.slug) {
    return <p className="p-4 text-center">Loading chat…</p>;
  }
  const slug = params.slug;

  // 2. ALL HOOKS AT THE TOP LEVEL
  const router = useRouter();
  const createChat = useMutation(api.chat.createChat);

  const chatInfo = useQuery(api.chat.getChatBySlug, slug ? { slug } : "skip");

  const messagesFromDB = useQuery(
    api.message.getMessagesByChatId,
    chatInfo?._id ? { chatId: chatInfo._id } : "skip"
  );

  const votes = useQuery(
    api.votes.getVotesByChatSlug,
    slug ? { slug } : "skip"
  );

  const convertToUIMessages = (msgs: DBMessage[]): UIMessage[] =>
    msgs.map((m) => ({
      id: m._id,
      parts: m.parts as UIMessage["parts"],
      role: m.role as UIMessage["role"],
      content: "",
      createdAt: new Date(m._creationTime),
      experimental_attachments: (m.attachments as Attachment[]) || [],
    }));

  const initialMessages = messagesFromDB
    ? convertToUIMessages(messagesFromDB)
    : [];

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
    id: slug,
    initialMessages,
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

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  useAutoResume({
    autoResume,
    initialMessages,
    experimental_resume,
    data,
    setMessages,
  });

  if (chatInfo === "Chat not found") {
    return null;
  }
  if (!chatInfo?._id || messagesFromDB === undefined) {
    return <p className="p-4 text-center">Loading messages…</p>;
  }
  if (votes === undefined) {
    return <p className="p-4 text-center">Loading votes…</p>;
  }

  const handleFirstSubmit = async () => {
    if (!chatInfo) {
      const { slug: newSlug } = await createChat({
        title: input,
        userId: currentUserId,
      });
      router.replace(`/chat/${newSlug}`);
    }
    realHandleSubmit();
  };

  const handleUnArchive = async () => {
    await fetchMutation(api.chat.unarchiveChat, {
      slug,
      userId: currentUserId,
    });
    toast.success("Chat Unarchived!");
    router.refresh();
  };

  const effectiveReadOnly = isReadonly || chatInfo.isArchived === true;

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages
        chatId={slug}
        status={status}
        votes={votes}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={effectiveReadOnly}
        isArtifactVisible={false}
        append={append}
        setInput={setInput}
        currentUserId={currentUserId}
      />

      <form className="flex mx-auto px-4 bg-background pb-0 gap-2 w-full md:max-w-3xl">
        {!effectiveReadOnly && (
          <MultimodalInput
            chatId={slug}
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

      {chatInfo.isArchived && (
        <div className="absolute bottom-0 bg-transparent  flex flex-col space-y-3 p-4 w-full justify-center items-center">
          <p className="text-sm text-muted-foreground w-full max-w-sm text-center">
            This chat is archived. You can still view messages, but cannot send
            new ones.
          </p>
          <Button size="sm" variant="outline" onClick={handleUnArchive}>
            <ArchiveRestoreIcon />
            Unarchive Chat
          </Button>
        </div>
      )}
    </div>
  );
}
