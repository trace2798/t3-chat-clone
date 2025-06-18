"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { buttonVariants } from "./ui/button";
import { chatModelsList } from "@/lib/model-list";

export function SelectModelSelector({
  currentUserId,
  value,
  onSelectModel,
}: {
  currentUserId: string;
  value: string;
  onSelectModel: (model: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "k" &&
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // const key = useQuery(api.key.getKeyByUserId, {
  //   userId: currentUserId as Id<"users">,
  // });
  const key = useQuery(
    api.key.getKeyByUserId,
    currentUserId ? { userId: currentUserId as Id<"users"> } : "skip"
  );
  console.log("CONVEX KEY", key);
  return (
    <>
      <div
        role="combobox"
        aria-expanded={open}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-fit max-w-[200px] justify-between text-muted-foreground text-sm hover:cursor-pointer"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="w-fit max-w-[150px] truncate">
          {value
            ? chatModelsList.find((model) => model.name === value)?.label
            : "Select model..."}
        </span>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Model..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {chatModelsList.map((model) => (
              <CommandItem
                key={model.name}
                value={model.name}
                onSelect={() => {
                  onSelectModel(model.name);
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span className="truncate">{model.label}</span>
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === model.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
