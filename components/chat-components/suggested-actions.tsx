"use client";

import { motion } from "motion/react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { VisibilityType } from "./visibility-selector";
import { Separator } from "../ui/separator";

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers["append"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  selectedVisibilityType: VisibilityType;
}

const tabs = [
  {
    name: "create",
    label: "Create",
    actions: [
      {
        title: "Write a short story about a robot discovering emotions",
        label: "",
        action: "Write a short story about a robot discovering emotions",
      },
      {
        title: "Help me outline a sci-fi novel set in a post-apocalyptic world",
        label: "",
        action:
          "Help me outline a sci-fi novel set in a post-apocalyptic world",
      },
      {
        title:
          "Create a character profile for a complex villain with sympathetic motives",
        label: "",
        action:
          "Create a character profile for a complex villain with sympathetic motives",
      },
      {
        title: "Give me 5 prompts for flash fiction",
        label: "",
        action: "Give me 5 creative writing prompts for flash fiction",
      },
    ],
  },
  {
    name: "explore",
    label: "Explore",
    actions: [
      {
        title: "Good books for fans of Rick Rubin",
        label: "",
        action: "Good books for fans of Rick Rubin",
      },
      {
        title: "Countries ranked by number of corgies",
        label: "",
        action: "Countries ranked by number of corgies",
      },
      {
        title: "Most successful companies in the world",
        label: "",
        action: "Most successful companies in the world",
      },
      {
        title: "How much does Claude cost?",
        label: "",
        action: "How much does Claude cost?",
      },
    ],
  },
  {
    name: "code",
    label: "Code",
    actions: [
      {
        title: "Write code to invert a binary search tree in Python",
        label: "",
        action: "Write code to invert a binary search tree in Python",
      },
      {
        title:
          "What's the difference between Promise.all and Promise.allSettled",
        label: "",
        action:
          "What's the difference between Promise.all and Promise.allSettled?",
      },
      {
        title: "Explain react's useEffect cleanup function",
        label: "",
        action: "Explain react's useEffect cleanup function",
      },
      {
        title: "Best practices for error handling in async/await",
        label: "",
        action: "Best practices for error handling in async/await",
      },
    ],
  },
  {
    name: "learn",
    label: "Learn",
    actions: [
      {
        title: "Begineer's guide to Typescript",
        label: "",
        action: "Begineer's guide to Typescript",
      },
      {
        title: "Explain the CAP theorem in distributed systems",
        label: "",
        action: "Explain the CAP theorem in distributed systems",
      },
      {
        title: "Why is AI so expensive?",
        label: "",
        action: "Why is AI so expensive?",
      },
      {
        title: "Are black holes real?",
        label: "",
        action: "Are black holes real?",
      },
    ],
  },
];

function PureSuggestedActions({
  chatId,
  append,
  handleSubmit,
}: SuggestedActionsProps) {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-5 w-full bg-transparent">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.name}
            className="hover:cursor-pointer hover:bg-accent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.name} value={tab.name} className="mt-10 md:mt-3">
          <div className="grid grid-cols-1 gap-3">
            {tab.actions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={`suggested-action-${suggestedAction.title}-${index}`}
                className="border-b"
              >
                <div
                  // variant="ghost"
                  onClick={async () => {
                    window.history.replaceState({}, "", `/chat/${chatId}`);
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                    handleSubmit();
                  }}
                  className="text-left rounded-xl pb-3 text-base flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start hover:cursor-pointer"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) =>
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType
);
