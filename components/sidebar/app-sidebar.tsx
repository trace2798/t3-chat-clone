"use client";

import * as React from "react";

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
import { LayoutDashboard } from "lucide-react";
import { SignOut } from "../auth/sign-out";
import CreateChat from "./create-chat";
import { SearchChat } from "./search-chat";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInWithGitHub } from "@/app/(auth)/signin/_components/signin-github";

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "#",
//       icon: LayoutDashboard,
//     },
//   ],
// };

type AppSidebarProps = {
  currentUser: {
    name?: string;
    // add more fields as needed
  } | null;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ currentUser, ...props }: AppSidebarProps) {
  console.log("CURRENT USER:", currentUser);
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
        <SidebarGroup>
          <SidebarGroupLabel>Chat</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
        {currentUser ? <SignOut /> : <SignInWithGitHub />}
      </SidebarFooter>
    </Sidebar>
  );
}
