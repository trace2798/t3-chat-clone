import { motion } from "motion/react";
import { VisibilityType } from "./visibility-selector";
import { UseChatHelpers } from "@ai-sdk/react";
import { SuggestedActions } from "./suggested-actions";

export const Greeting = ({
  chatId,
  append,
  selectedVisibilityType,
  handleSubmit,
}: {
  chatId: string;
  append: UseChatHelpers["append"];
  selectedVisibilityType: VisibilityType;
  handleSubmit: UseChatHelpers["handleSubmit"];
}) => {
  return (
    <div
      key="overview"
      className="max-w-xl mx-auto md:mt-20 lg:mt-44 px-8 size-full flex flex-col justify-start"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-semibold"
      >
        How can I help you?
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl mt-5"
      >
        <SuggestedActions
          append={append}
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          handleSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
};
