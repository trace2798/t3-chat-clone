"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

const SidebarChat = ({ currentUserId }: { currentUserId: string }) => {
  const pathname = usePathname();
  console.log("PARAMS:", pathname);
  console.log("CURRENT USER ID SIDEBAR CHAT:", currentUserId);

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

// "use client";
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
// import { Button, buttonVariants } from "../ui/button";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "../ui/sidebar";

// const SidebarChat = ({ userChats }: { userChats: any[] }) => {

//   return (
//     <>
//       <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//         <SidebarGroupLabel>Chats</SidebarGroupLabel>
//         <SidebarMenu>
//           {userChats.map((chat) => (
//             <SidebarMenuItem key={chat._id}>
//               <SidebarMenuButton asChild>
//                 <a href={`/chat/${chat.slug}`}>
//                   {/* <item.icon /> */}
//                   <span>{chat.title}</span>
//                 </a>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroup>
//     </>
//   );
// };

// export default SidebarChat;
