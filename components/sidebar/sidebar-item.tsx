"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import { fetchMutation } from "convex/nextjs";
import { useMutation } from "convex/react";
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  CheckCheckIcon,
  Eye,
  EyeClosedIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  Share2,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { toast } from "sonner";

type Chat = Doc<"chat">;
const PureChatItem = ({
  chat,
  isActive,
  setOpenMobile,
  currentUserId,
}: {
  chat: Chat;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
  currentUserId: string;
}) => {
  const router = useRouter();
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat._id,
    initialVisibilityType: chat.visibility,
  });

  const handleDelete = async () => {
    const deleteResponse = fetchMutation(api.chat.softDeleteChat, {
      slug: chat.slug,
      userId: currentUserId,
    });
    console.log("DELETE RESPONSE:", deleteResponse);
    router.push("/");
  };

  const archive = useMutation(api.chat.archiveChat);
  const unarchive = useMutation(api.chat.unarchiveChat);
  const handleToggleArchive = () => {
    if (chat.isArchived) {
      unarchive({ slug: chat.slug, userId: currentUserId });
      toast.success("Chat Unarchived!");
    } else {
      archive({ slug: chat.slug, userId: currentUserId });
      toast.success("Chat Archived!");
    }
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${chat.slug}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5 hover:cursor-pointer"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <div className="flex space-x-1 w-full items-center">
                {chat.visibility === "public" ? (
                  <Eye size={12} />
                ) : (
                  <EyeClosedIcon size={12} />
                )}
                <span>Visibility</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between"
                  onClick={() => {
                    setVisibilityType("private");
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <LockIcon size={12} />
                    <span>Private</span>
                  </div>
                  {visibilityType === "private" ? <CheckCheckIcon /> : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between"
                  onClick={() => {
                    setVisibilityType("public");
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <GlobeIcon />
                    <span>Public</span>
                  </div>
                  {visibilityType === "public" ? <CheckCheckIcon /> : null}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {chat.visibility === "public" ? (
            <DropdownMenuItem
              onSelect={() => {}}
              className="hover:cursor-pointer hover:bg-accent"
            >
              <ShareIcon />
              <span>Copy Link</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/share/${chat.slug}`)
                .then(() => {
                  toast.success("Link Copied");
                })
                .catch((err) => {
                  console.error("Copy failed", err);
                  toast.error("Failed to copy link");
                });
            }}
            className="hover:cursor-pointer hover:bg-accent"
            disabled={chat.visibility === "private"}
          >
            <Share2 />
            <span>
              {chat.visibility === "public" ? "Share Link" : "Share Link"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleToggleArchive}
            className="hover:cursor-pointer hover:bg-accent"
          >
            {chat.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
            <span>{chat.isArchived ? "Unarchive" : "Archive"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500 hover:bg-accent "
            onSelect={() => handleDelete()}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.chat.isArchived !== nextProps.chat.isArchived) return false;
  return true;
});
