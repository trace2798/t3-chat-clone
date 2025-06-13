"use client";

import * as React from "react";

import { SignInWithGitHub } from "@/app/(auth)/signin/_components/signin-github";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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

type AppSidebarProps = {
  currentUser: {
    _id: string;
    name?: string;
  } | null;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ currentUser, ...props }: AppSidebarProps) {
  console.log("CURRENT USER Sidebar:", currentUser);
  const data = currentUser;

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
                <span className="text-base font-semibold">T3 Chat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <CreateChat />
        <SearchChat />
        
        {currentUser && <SidebarChat currentUserId={data?._id as string} />}
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
        {currentUser ? <SignOut /> : <SignInWithGitHub />}
      </SidebarFooter>
    </Sidebar>
  );
}
