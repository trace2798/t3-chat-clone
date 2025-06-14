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
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />{" "}
          <Skeleton className="h-6 w-full" />
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  console.log("USER CHATS:", userChats);
  if (userChats.length === 0)
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 text-primary/70 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          {userChats.map((chat) => (
            <ChatItem
              chat={chat}
              isActive={pathname === `/chat/${chat.slug}`}
              currentUserId={currentUserId}
              setOpenMobile={() => {}}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};

export default SidebarChat;
