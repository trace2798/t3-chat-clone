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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChatItem } from "./sidebar-item";

const SidebarChat = ({ currentUserId }: { currentUserId: string }) => {
  const pathname = usePathname();
  // console.log("PARAMS:", pathname);
  // console.log("CURRENT USER ID SIDEBAR CHAT:", currentUserId);

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
            // <SidebarMenuItem
            //   key={chat._id}
            //   className="flex items-center justify-between w-full"
            // >
            //   <SidebarMenuButton asChild className="">
            //     <>
            //       <a href={`/chat/${chat.slug}`}>
            //         <span className="text-sm w-full max-w-[250px] truncate">
            //           {chat.title}
            //         </span>
            //       </a>
            //       <DropdownMenu>
            //         <DropdownMenuTrigger asChild>
            //           <Button size="sm" variant="outline" className="h-6 w-fit">
            //             <Ellipsis />
            //           </Button>
            //         </DropdownMenuTrigger>
            //         <DropdownMenuContent className="w-56" align="start">
            //           <DropdownMenuLabel>My Account</DropdownMenuLabel>
            //           <DropdownMenuGroup>
            //             <DropdownMenuItem>Profile</DropdownMenuItem>
            //             <DropdownMenuItem>Billing</DropdownMenuItem>
            //             <DropdownMenuItem>Settings</DropdownMenuItem>
            //             <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            //           </DropdownMenuGroup>
            //         </DropdownMenuContent>
            //       </DropdownMenu>
            //     </>
            //   </SidebarMenuButton>
            // </SidebarMenuItem>
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
