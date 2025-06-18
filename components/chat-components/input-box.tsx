"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { cn } from "@/lib/utils";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { Attachment, UIMessage } from "ai";
import equal from "fast-deep-equal";
import {
  ArrowDown,
  ArrowUp,
  Globe,
  Image,
  Mic,
  PaperclipIcon,
  StopCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { SelectModelSelector } from "../select-model-selector";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useSidebar } from "../ui/sidebar";
import { PreviewAttachment } from "./preview-attachment";

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  currentUserId,
  isSearchMode,
  onSearchModeChange,
  isImageMode,
  onImageModeChange,
  selectedModel,
  onModelChange,
}: {
  chatId: string;
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  append: UseChatHelpers["append"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  className?: string;
  currentUserId?: string;

  isSearchMode: boolean;
  onSearchModeChange: (flag: boolean) => void;
  isImageMode: boolean;
  onImageModeChange: (flag: boolean) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
      body: {
        isSearch: isSearchMode,
        isImage: isImageMode,
      },
    });

    setAttachments([]);
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("FormData", formData);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("Response Upload", response);
      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      console.log("Error Upload", error);
      toast.error(error);
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  const { isAtBottom, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (status === "submitted") {
      scrollToBottom();
    }
  }, [status, scrollToBottom]);
  const bothToolsModels = [
    "mistralai/mistral-small-3.1-24b-instruct",
    "google/gemini-2.5-flash-lite-preview-06-17",
    "anthropic/claude-4-sonnet-20250522",
  ];
  const searchOnlyModels = [
    "meta-llama/llama-4-maverick",
    "meta-llama/llama-4-scout",
  ];

  const canSearch =
    bothToolsModels.includes(selectedModel) ||
    searchOnlyModels.includes(selectedModel);

  const canGenerateImage = bothToolsModels.includes(selectedModel);
  return (
    <>
      <div className="relative flex flex-col gap-4 w-full max-w2xl mx-auto z-50">
        <div className=" w-full max-w-2xl mx-auto flex flex-col gap-4">
          <AnimatePresence>
            {!isAtBottom && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative left-1/2 flex justify-center -translate-x-1/2 z-50"
              >
                <Button
                  data-testid="scroll-to-bottom-button"
                  className="rounded-full"
                  size="icon"
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToBottom();
                  }}
                >
                  <ArrowDown />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="file"
            className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            tabIndex={-1}
          />

          {(attachments.length > 0 || uploadQueue.length > 0) && (
            <div
              data-testid="attachments-preview"
              className="flex flex-row gap-2 overflow-x-scroll items-end"
            >
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}

              {uploadQueue.map((filename) => (
                <PreviewAttachment
                  key={filename}
                  attachment={{
                    url: "",
                    name: filename,
                    contentType: "",
                  }}
                  isUploading={true}
                />
              ))}
            </div>
          )}
        </div>
        <div className=" w-full max-w-2xl mx-auto flex flex-col bg-input/30 rounded-t-2xl border border-b-0 dark:border-zinc-700 ">
          <div className="flex flex-col gap-2">
            <Textarea
              data-testid="multimodal-input"
              ref={textareaRef}
              placeholder="Send a message..."
              value={input}
              onChange={handleInput}
              className={cn(
                "min-h-[24px] max-h-[calc(20dvh)] overflow-hidden resize-none rounded-t-2xl rounded-b-none !text-base bg-muted pb-10 focus:border-none border-none",
                className
              )}
              rows={2}
              autoFocus
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();

                  if (status !== "ready") {
                    toast.error(
                      "Please wait for the model to finish its response!"
                    );
                  } else {
                    submitForm();
                  }
                }
              }}
            />
          </div>
          <div className=" w-full flex justify-between items-center ">
            <div className=" p-2 w-fit flex flex-row justify-start items-center space-x-2">
              <SelectModelSelector
                currentUserId={currentUserId || ""}
                value={selectedModel}
                onSelectModel={onModelChange}
              />

              {canSearch && (
                <SearchButton
                  triggerSearch={() => {
                    onSearchModeChange(!isSearchMode);
                    if (!isSearchMode) onImageModeChange(false);
                  }}
                  disabled={status !== "ready"}
                  isActive={isSearchMode}
                />
              )}

              {canGenerateImage && (
                <GenerateImageButton
                  triggerImage={() => {
                    onImageModeChange(!isImageMode);
                    if (!isImageMode) onSearchModeChange(false);
                  }}
                  disabled={status !== "ready"}
                  isActive={isImageMode}
                />
              )}
              {(selectedModel === "meta-llama/llama-4-scout" ||
                selectedModel === "meta-llama/llama-4-maverick" ||
                selectedModel ===
                  "google/gemini-2.5-flash-lite-preview-06-17" ||
                selectedModel === "mistralai/mistral-small-3.1-24b-instruct" ||
                selectedModel === "anthropic/claude-4-sonnet-20250522") &&
                (currentUserId ? (
                  <AttachmentsButton
                    fileInputRef={fileInputRef}
                    status={status}
                  />
                ) : (
                  <Button
                    data-testid="attachments-button"
                    className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:cursor-pointer hover:bg-accent"
                    disabled={!currentUserId}
                    variant="ghost"
                  >
                    <PaperclipIcon size={14} />
                  </Button>
                ))}
            </div>
            <div className="p-2 w-fit flex flex-row space-x-2 items-center justify-end">
              <Dictaphone input={input} setInput={setInput} />

              {status === "submitted" ? (
                <StopButton stop={stop} setMessages={setMessages} />
              ) : currentUserId ? (
                <SendButton
                  input={input}
                  submitForm={submitForm}
                  uploadQueue={uploadQueue}
                />
              ) : (
                <Link href={"/signin"}>
                  <Button className="h-6">Login to send a message</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;
    if (prevProps.isSearchMode !== nextProps.isSearchMode) return false;
    if (prevProps.isImageMode !== nextProps.isImageMode) return false;
    if (prevProps.selectedModel !== nextProps.selectedModel) return false;

    return true;
  }
);

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  status: UseChatHelpers["status"];
}) {
  return (
    <Button
      data-testid="attachments-button"
      size="sm"
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700  hover:cursor-pointer hover:bg-accent"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={status !== "ready"}
      variant="ghost"
    >
      <PaperclipIcon size={10} />
    </Button>
  );
}

function PureSearchButton({
  triggerSearch,
  disabled,
  isActive,
}: {
  triggerSearch: () => void;
  disabled: boolean;
  isActive: boolean;
}) {
  return (
    <Button
      data-testid="search-button"
      size="sm"
      className={cn(
        " p-[2px] h-fit dark:border-zinc-700  hover:cursor-pointer hover:bg-accent rounded-full",
        isActive && "text-indigo-400"
      )}
      onClick={(event) => {
        event.preventDefault();
        triggerSearch();
      }}
      disabled={disabled}
      variant="ghost"
    >
      <Globe size={14} />
    </Button>
  );
}

function PureGenerateImageButton({
  triggerImage,
  disabled,
  isActive,
}: {
  triggerImage: () => void;
  disabled: boolean;
  isActive: boolean;
}) {
  const { isMobile } = useSidebar();
  return (
    <Button
      data-testid="search-button"
      size="sm"
      className={cn(
        " p-[2px] h-fit dark:border-zinc-700  hover:cursor-pointer hover:bg-accent rounded-full",
        isActive && "text-indigo-400"
      )}
      onClick={(event) => {
        event.preventDefault();
        triggerImage();
      }}
      disabled={disabled}
      variant="ghost"
    >
      <Image size={14} />
      {/* <span className={cn(isMobile && "hidden")}>Image</span> */}
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);
const SearchButton = memo(PureSearchButton);
const GenerateImageButton = memo(PureGenerateImageButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers["setMessages"];
}) {
  return (
    <Button
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600 "
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopCircle size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      data-testid="send-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600 hover:cursor-pointer hover:bg-primary/80"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUp size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});

type DictaphoneProps = {
  input: string;
  setInput: (input: string) => void;
};

export function Dictaphone({ input, setInput }: DictaphoneProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const wasListening = useRef(false);

  useEffect(() => {
    if (wasListening.current && !listening) {
      setInput(transcript.trim());
      resetTranscript();
    }
    wasListening.current = listening;
  }, [listening, transcript, resetTranscript, setInput]);

  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
    }
  }, [listening, resetTranscript]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          role="button"
          aria-disabled={!browserSupportsSpeechRecognition}
          onClick={
            browserSupportsSpeechRecognition ? toggleListening : undefined
          }
          className={cn(
            "rounded-full p-1.5 h-fit border dark:border-zinc-600 cursor-pointer",
            !browserSupportsSpeechRecognition &&
              "opacity-50 cursor-not-allowed",
            listening && "bg-background/80 text-green-600 animate-pulse"
          )}
        >
          {listening ? <StopCircle size={14} /> : <Mic size={14} />}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="p-1 text-sm w-fit">
        {browserSupportsSpeechRecognition
          ? "Dictate"
          : "Browser doesn't support speech recognition."}
      </HoverCardContent>
    </HoverCard>
  );
}
