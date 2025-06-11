"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";

const frameworks = [
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

export function ExampleCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-fit max-w-[200px] justify-between"
        >
          <span className="w-fit max-w-[150px] truncate">
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-sm p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className=" truncate">{framework.label}</span>
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
        </Command>
        <Separator />
        <div className="w-full px-2 py-1">
          <Button
            className="hover:cursor-pointer hover:border"
            size="sm"
            variant="ghost"
          >
            All Models
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
