"use client";

import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { memo, useState } from "react";
import { Markdown } from "./markdown";
import { MessageActions } from "./message-action";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn, sanitizeText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageEditor } from "./message-editor";
import { DocumentPreview } from "./document-preview";
import { MessageReasoning } from "./message-reasoning";
import type { UseChatHelpers } from "@ai-sdk/react";
import { GitBranchPlus, PencilIcon, SparklesIcon } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type Vote = Doc<"vote">;

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
  currentUserId,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  currentUserId?: string;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const handleBranchChat = () => {
    const branchChat = fetchMutation(api.chat.branchChat, {
      chatSlug: chatId,
      messageId: message.id as Id<"message">,
      userId: currentUserId as Id<"users">,
    });
    //console.log("BRANCH CHAT FE:", branchChat);
  };

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn("flex flex-col gap-4 w-full", {
              "min-h-96": message.role === "assistant" && requiresScrollPadding,
            })}
          >
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div
                  data-testid={`message-attachments`}
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning") {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === "user" && !isReadonly && (
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid="message-edit-button"
                                variant="ghost"
                                className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                                onClick={() => {
                                  setMode("edit");
                                }}
                              >
                                <PencilIcon size={10} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit message</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid="message-edit-button"
                                variant="ghost"
                                className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                                onClick={() => handleBranchChat()}
                              >
                                <GitBranchPlus size={10} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Create Branch</TooltipContent>
                          </Tooltip>
                        </div>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-primary text-primary-foreground px-3 py-2 rounded-xl":
                            message.role === "user",
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              //   if (type === 'tool-invocation') {
              //     const { toolInvocation } = part;
              //     const { toolName, toolCallId, state } = toolInvocation;

              //     if (state === 'call') {
              //       const { args } = toolInvocation;

              //       return (
              //         <div
              //           key={toolCallId}
              //           className={cn({
              //             skeleton: ['getWeather'].includes(toolName),
              //           })}
              //         >
              //           {toolName === 'getWeather' ? (
              //             <Weather />
              //           ) : toolName === 'createDocument' ? (
              //             <DocumentPreview isReadonly={isReadonly} args={args} />
              //           ) : toolName === 'updateDocument' ? (
              //             <DocumentToolCall
              //               type="update"
              //               args={args}
              //               isReadonly={isReadonly}
              //             />
              //           ) : toolName === 'requestSuggestions' ? (
              //             <DocumentToolCall
              //               type="request-suggestions"
              //               args={args}
              //               isReadonly={isReadonly}
              //             />
              //           ) : null}
              //         </div>
              //       );
              //     }

              //     if (state === 'result') {
              //       const { result } = toolInvocation;

              //       return (
              //         <div key={toolCallId}>
              //           {toolName === 'getWeather' ? (
              //             <Weather weatherAtLocation={result} />
              //           ) : toolName === 'createDocument' ? (
              //             <DocumentPreview
              //               isReadonly={isReadonly}
              //               result={result}
              //             />
              //           ) : toolName === 'updateDocument' ? (
              //             <DocumentToolResult
              //               type="update"
              //               result={result}
              //               isReadonly={isReadonly}
              //             />
              //           ) : toolName === 'requestSuggestions' ? (
              //             <DocumentToolResult
              //               type="request-suggestions"
              //               result={result}
              //               isReadonly={isReadonly}
              //             />
              //           ) : (
              //             <pre>{JSON.stringify(result, null, 2)}</pre>
              //           )}
              //         </div>
              //       );
              //     }
              //   }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state, args } = toolInvocation;

                if (state === "call") {
                  return (
                    <div
                      key={toolCallId}
                      className="flex items-center justify-center p-4 bg-gray-100 rounded"
                    >
                      {toolName === "generateImageTool" ? (
                        <span className="animate-pulse text-gray-500">
                          Generating image for “{args.prompt}”…
                        </span>
                      ) : null}
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId} className="my-4">
                      {toolName === "generateImageTool" ? (
                        <img
                          src={result.url}
                          alt={args.prompt}
                          className="max-w-full rounded shadow"
                        />
                      ) : null}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
