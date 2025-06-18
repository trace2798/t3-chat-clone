"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "motion/react";
import { memo } from "react";
import { Separator } from "../ui/separator";
// import type { VisibilityType } from "./visibility-selector";

interface SuggestedActionsProps {
  setInput: UseChatHelpers["setInput"];
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

        action: "Good books for fans of Rick Rubin",
      },
      {
        title: "Countries ranked by number of corgies",

        action: "Countries ranked by number of corgies",
      },
      {
        title: "Most successful companies in the world",

        action: "Most successful companies in the world",
      },
      {
        title: "How much does Claude cost?",
        action: "How much does Claude cost?",
      },
    ],
  },
  // {
  //   name: "code",
  //   label: "Code",
  //   actions: [
  //     {
  //       title: "Write code to invert a binary search tree in Python",

  //       action: "Write code to invert a binary search tree in Python",
  //     },
  //     {
  //       title:
  //         "What's the difference between Promise.all and Promise.allSettled",

  //       action:
  //         "What's the difference between Promise.all and Promise.allSettled?",
  //     },
  //     {
  //       title: "Explain react's useEffect cleanup function",

  //       action: "Explain react's useEffect cleanup function",
  //     },
  //     {
  //       title: "Best practices for error handling in async/await",

  //       action: "Best practices for error handling in async/await",
  //     },
  //   ],
  // },
  {
    name: "learn",
    label: "Learn",
    actions: [
      {
        title: "Begineer's guide to Typescript",

        action: "Begineer's guide to Typescript",
      },
      {
        title: "Explain the CAP theorem in distributed systems",

        action: "Explain the CAP theorem in distributed systems",
      },
      {
        title: "Why is AI so expensive?",

        action: "Why is AI so expensive?",
      },
      {
        title: "Are black holes real?",

        action: "Are black holes real?",
      },
    ],
  },
];

function PureSuggestedActions({ setInput }: SuggestedActionsProps) {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-5 w-full bg-transparent">
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={`tab-${index}`}
            value={tab.name}
            className="hover:cursor-pointer hover:bg-accent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab, index) => (
        <TabsContent
          key={`tab-content-${index}`}
          value={tab.name}
          className="mt-10 md:mt-3"
        >
          <div className="grid grid-cols-1 gap-1">
            {tab.actions.map((suggestedAction, index) => (
              <div key={`suggested-action-${suggestedAction.title}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div
                    typeof="button"
                    onClick={() => {
                      setInput(suggestedAction.title);
                    }}
                    className="text-left rounded-xl hover:bg-accent px-3 py-2 text-base flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start hover:cursor-pointer"
                  >
                    <span className="font-medium">{suggestedAction.title}</span>
                  </div>
                </motion.div>
                <Separator />
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
