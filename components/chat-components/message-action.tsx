import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import type { Message } from "ai";
import { fetchMutation } from "convex/nextjs";
import equal from "fast-deep-equal";
import {
  CopyIcon,
  GitBranchPlus,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
type Vote = Doc<"vote">;
export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
  currentUserId,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  currentUserId?: string;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;
  console.log("VOTES Message action", vote);
  const handleBranchChat = () => {
    const branchChat = fetchMutation(api.chat.branchChat, {
      chatSlug: chatId,
      messageId: message.id as Id<"message">,
      userId: currentUserId as Id<"users">,
    });
    console.log("BRANCH CHAT FE:", branchChat);
  };
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  ?.filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("\n")
                  .trim();

                if (!textFromParts) {
                  toast.error("There's no text to copy!");
                  return;
                }

                await copyToClipboard(textFromParts);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-upvote"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const update = await fetchMutation(api.votes.createVote, {
                  slug: chatId,
                  userId: currentUserId as Id<"users">,
                  messageId: message.id as Id<"message">,
                  type: "upvote",
                });
                if (update) {
                  toast.success("Upvoted!");
                }
              }}
            >
              <ThumbsUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-downvote"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const update = await fetchMutation(api.votes.createVote, {
                  slug: chatId,
                  userId: currentUserId as Id<"users">,
                  messageId: message.id as Id<"message">,
                  type: "downvote",
                });
                if (update) {
                  toast.success("Downvoted!");
                }
              }}
            >
              <ThumbsDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-branch"
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              onClick={() => handleBranchChat()}
            >
              <GitBranchPlus size={10} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create Branch</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  }
);
