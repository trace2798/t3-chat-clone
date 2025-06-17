"use client";

import * as React from "react";

import { SignInWithGitHub } from "@/app/(auth)/signin/_components/signin-github";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignOut } from "../auth/sign-out";
import CreateChat from "./create-chat";
import { SearchChat } from "./search-chat";
import SidebarChat from "./sidebar-chat";
import { Skeleton } from "../ui/skeleton";

export interface ChatItem {
  _creationTime: number;
  _id: string;
  slug: string;
  title: string;
  updatedAt: number;
  userId: string;
  visibility: "private" | "public";
}

type AppSidebarProps = {
  currentUser: {
    _id: string;
    name?: string;
  } | null;
  // Always an array; can be empty if no chats
  userChats: ChatItem[];
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({
  currentUser,
  userChats,
  ...props
}: AppSidebarProps) {
  if (!currentUser) {
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <span className="text-base font-semibold">AI Chat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {currentUser ? <SignOut /> : <SignInWithGitHub />}
      </SidebarFooter>
    </Sidebar>;
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <span className="text-base font-semibold">AI Chat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        {currentUser && <CreateChat />}
        {currentUser && <SearchChat currentUserId={currentUser?._id} />}
        {currentUser && <SidebarChat currentUserId={currentUser._id} />}
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
        {currentUser ? <SignOut /> : <SignInWithGitHub />}
      </SidebarFooter>
    </Sidebar>
  );
}
