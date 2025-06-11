"use client";

import {
  Calculator,
  Calendar,
  CheckIcon,
  ChevronsUpDownIcon,
  Smile,
} from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

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
            ? models.find((model) => model.value === value)?.label
            : "Select model..."}
        </span>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Model..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {models.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.label} // use label for better matching
                onSelect={() => {
                  setValue(framework.value);
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span className="truncate">{framework.label}</span>
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
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

const models = [
  {
    value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    label: "Meta Llama 3.1 8B Instruct Turbo",
  },
  {
    value: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
    label: "DeepSeek R1 Distill Llama 70B Free",
  },
  {
    value: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    label: "Meta Llama 3.2 11B Vision Instruct Turbo",
  },
  {
    value: "meta-llama/Llama-Vision-Free",
    label: "Meta Llama Vision Free",
  },
  {
    value: "lgai/exaone-3-5-32b-instruct",
    label: "EXAONE 3.5 32B Instruct",
  },
  {
    value: "lgai/exaone-deep-32b",
    label: "EXAONE Deep 32B",
  },
];
