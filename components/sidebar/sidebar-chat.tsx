"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const SidebarChat = ({ currentUserId }: { currentUserId: string }) => {
  console.log("CURRENT USER ID SIDEBAR CHAT:", currentUserId);

  const userChats = useQuery(api.chat.getChatByUserId, {
    userId: currentUserId,
  });
  if (userChats === undefined) {
    return <div>Loading chats...</div>;
  }

  console.log("USER CHATS:", userChats);
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          {userChats.map((chat) => (
            <SidebarMenuItem key={chat._id}>
              <SidebarMenuButton asChild>
                <a href={`/chat/${chat.slug}`}>
                  {/* <item.icon /> */}
                  <span>{chat.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};

export default SidebarChat;
