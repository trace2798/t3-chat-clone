// "use client";
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
// import { usePathname } from "next/navigation";
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
// } from "../ui/sidebar";
// import { Skeleton } from "../ui/skeleton";
// import { ChatItem } from "./sidebar-item";
// import { Doc } from "@/convex/_generated/dataModel";

// type Chat = Doc<"chat">;

// type ChatWithParent = Chat & {
//   parent: Chat | null;
// };

// // Recursive renderer
// function RenderChatTree({
//   chatsByParent,
//   parentId,
//   level = 0,
//   activeSlug,
//   currentUserId,
// }: {
//   chatsByParent: Record<string, ChatWithParent[]>;
//   parentId: string | null;
//   level?: number;
//   activeSlug: string;
//   currentUserId: string;
// }) {
//   const children = chatsByParent[parentId ?? "null"] || [];
//   return (
//     <>
//       {children.map((chat) => (
//         <div key={chat._id}>
//           <ChatItem
//             chat={chat}
//             isActive={activeSlug === chat.slug}
//             currentUserId={currentUserId}
//             // You can pass `level` down so ChatItem can indent itself,
//             // or wrap it in a div with paddingLeft
//             // style={{ paddingLeft: level * 16 }}
//             setOpenMobile={() => {}}
//           />
//           {/* recurse to render branches */}
//           <RenderChatTree
//             chatsByParent={chatsByParent}
//             parentId={chat._id}
//             level={level + 1}
//             activeSlug={activeSlug}
//             currentUserId={currentUserId}
//           />
//         </div>
//       ))}
//     </>
//   );
// }

// const SidebarChat = ({ currentUserId }: { currentUserId: string }) => {
//   const pathname = usePathname();

//   const userChats = useQuery(api.chat.getChatByUserId, {
//     userId: currentUserId,
//   });
//   if (userChats === undefined) {
//     return (
//       <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//         <SidebarGroupLabel>Chats</SidebarGroupLabel>
//         <SidebarMenu className="flex flex-col space-y-3">
//           <Skeleton className="h-6 w-full" />
//           <Skeleton className="h-6 w-full" />
//           <Skeleton className="h-6 w-full" />
//           <Skeleton className="h-6 w-full" />
//           <Skeleton className="h-6 w-full" />{" "}
//           <Skeleton className="h-6 w-full" />
//         </SidebarMenu>
//       </SidebarGroup>
//     );
//   }

//   console.log("USER CHATS:", userChats);
//   if (userChats.length === 0)
//     return (
//       <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//         <SidebarGroupLabel>Chats</SidebarGroupLabel>
//         <SidebarGroupContent>
//           <div className="px-2 text-primary/70 w-full flex flex-row justify-center items-center text-sm gap-2">
//             Your conversations will appear here once you start chatting!
//           </div>
//         </SidebarGroupContent>
//       </SidebarGroup>
//     );
//   return (
//     <>
//       <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//         <SidebarGroupLabel>Chats</SidebarGroupLabel>
//         <SidebarMenu>
//           {userChats.map((chat) => (
//             <ChatItem
//               key={chat._id}
//               chat={chat}
//               isActive={pathname === `/chat/${chat.slug}`}
//               currentUserId={currentUserId}
//               setOpenMobile={() => {}}
//             />
//           ))}
//         </SidebarMenu>
//       </SidebarGroup>
//     </>
//   );
// };

// export default SidebarChat;
"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { ChatItem } from "./sidebar-item";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type Chat = Doc<"chat">;
type ChatWithParent = Chat & {
  parent: Chat | null;
};

function RenderChatTree({
  chatsByParent,
  parentId,
  level = 0,
  activeSlug,
  currentUserId,
}: {
  chatsByParent: Record<string, ChatWithParent[]>;
  parentId: string | null;
  level?: number;
  activeSlug: string;
  currentUserId: string;
}) {
  const children = chatsByParent[parentId ?? "null"] || [];
  return (
    <>
      {children.map((chat) => (
        <div
          key={chat._id}
          className={cn(`pl-${level * 1}`, level > 0 && "border-l  ml-1")}
        >
          <ChatItem
            chat={chat}
            isActive={activeSlug === chat.slug}
            currentUserId={currentUserId}
            //  style={{ paddingLeft: level * 16 }}
            setOpenMobile={() => {}}
          />
          <RenderChatTree
            chatsByParent={chatsByParent}
            parentId={chat._id}
            level={level + 1}
            activeSlug={activeSlug}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </>
  );
}

const SidebarChat = ({ currentUserId }: { currentUserId: string }) => {
  const pathname = usePathname();
  const userChats = useQuery(api.chat.getChatByUserId, {
    userId: currentUserId,
  });

  if (userChats === undefined) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu className="flex flex-col space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (userChats.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 text-primary/70 w-full text-center text-sm">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const chatsByParent: Record<string, ChatWithParent[]> = {};
  userChats.forEach((chat) => {
    const key = chat.parentChat ?? "null";
    if (!chatsByParent[key]) chatsByParent[key] = [];
    chatsByParent[key].push(chat as ChatWithParent);
  });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        <RenderChatTree
          chatsByParent={chatsByParent}
          parentId={null}
          activeSlug={pathname.replace("/chat/", "")}
          currentUserId={currentUserId}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarChat;
