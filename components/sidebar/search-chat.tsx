"use client";

import { Search, User } from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

export function SearchChat({ currentUserId }: { currentUserId?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);
  // debounce the term by 3000ms
  const [debouncedTerm] = useDebounce(searchTerm, 3000);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const { state } = useSidebar();
  const chats =
    useQuery(api.chat.getChatSearch, {
      userId: currentUserId as string,
      query: debouncedTerm,
    }) ?? [];
  console.log("CHATS", chats);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        disabled={!currentUserId}
        size={state === "expanded" ? "sm" : "icon"}
        variant={"ghost"}
        onClick={() => setOpen(true)}
        className={cn(
          "h-7  hover:cursor-pointer",
          state === "expanded" ? "justify-start w-full" : "justify-center w-fit"
        )}
      >
        <Search className="size-4" />
        {state === "expanded" && "Search Chat"}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Chat..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />

        <CommandList>
          {searchTerm.length === 0 && (
            <CommandEmpty>Start typing to search chats.</CommandEmpty>
          )}
          {searchTerm.length > 0 && chats.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {chats.length > 0 && (
            <CommandGroup heading={`Chats (${chats.length})`}>
              {chats.map((chat) => (
                <Link key={chat._id.toString()} href={`/chat/${chat.slug}`}>
                  <CommandItem
                    value={chat.title}
                    onSelect={() => setOpen(false)}
                    className="hover:cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{chat.title}</span>
                    <CommandShortcut>↵</CommandShortcut>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
