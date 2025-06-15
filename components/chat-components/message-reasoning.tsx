// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { Markdown } from "./markdown";
// import { ChevronDownIcon, ChevronUpIcon, Loader } from "lucide-react";

// interface MessageReasoningProps {
//   isLoading: boolean;
//   reasoning: string;
// }

// export function MessageReasoning({
//   isLoading,
//   reasoning,
// }: MessageReasoningProps) {
//   const [isExpanded, setIsExpanded] = useState(true);

//   const variants = {
//     collapsed: {
//       height: 0,
//       opacity: 0,
//       marginTop: 0,
//       marginBottom: 0,
//     },
//     expanded: {
//       height: "auto",
//       opacity: 1,
//       marginTop: "1rem",
//       marginBottom: "0.5rem",
//     },
//   };

//   return (
//     <div className="flex flex-col">
//       {isLoading ? (
//         <div className="flex flex-row gap-2 items-center">
//           <div className="font-medium">Reasoning</div>
//           <div className="animate-spin">
//             <Loader size={16} />
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-row gap-2 items-center">
//           <div className="font-medium text-sm">Reasoned for a few seconds </div>
//           <button
//             data-testid="message-reasoning-toggle"
//             type="button"
//             className="cursor-pointer"
//             onClick={() => {
//               setIsExpanded(!isExpanded);
//             }}
//           >
//             {isExpanded ? (
//               <ChevronUpIcon size={16} />
//             ) : (
//               <ChevronDownIcon size={16} />
//             )}
//           </button>
//         </div>
//       )}

//       <AnimatePresence initial={false}>
//         {isExpanded && (
//           <motion.div
//             data-testid="message-reasoning"
//             key="content"
//             initial="collapsed"
//             animate="expanded"
//             exit="collapsed"
//             variants={variants}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//             style={{ overflow: "hidden" }}
//             className="pl-4 text-primary/70 border-l flex flex-col gap-4 text-sm"
//           >
//             <Markdown>{reasoning}</Markdown>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Markdown } from "./markdown";
import { ChevronDownIcon, ChevronUpIcon, Loader } from "lucide-react";

interface MessageReasoningProps {
  isLoading: boolean;
  reasoning: string;
}

export function MessageReasoning({
  isLoading,
  reasoning,
}: MessageReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // const variants = {
  //   collapsed: { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
  //   expanded: {
  //     height: "auto",
  //     opacity: 1,
  //     marginTop: "1rem",
  //     marginBottom: "0.5rem",
  //   },
  // };

  const variants = {
    collapsed: {
      height: "4em",
      opacity: 1,
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="font-medium">Reasoning</div>
          <div className="animate-spin">
            <Loader size={16} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            data-testid="message-reasoning-toggle"
            type="button"
            className="cursor-pointer"
            onClick={() => setIsExpanded((e) => !e)}
          >
            {isExpanded ? (
              <ChevronUpIcon size={16} />
            ) : (
              <ChevronDownIcon size={16} />
            )}
          </button>
        </div>
      )}

      {/* {!isExpanded && (
        <div
          className="pl-4 pt-3 border-l line-clamp-2 text-primary/70 text-sm hover:cursor-pointer"
          onClick={() => setIsExpanded((e) => !e)}
        >
          {reasoning}
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            data-testid="message-reasoning"
            key="expanded"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="pl-4 text-primary/70 border-l flex flex-col gap-4 text-sm hover:cursor-pointer"
            onClick={() => setIsExpanded((e) => !e)}
          >
            <Markdown>{reasoning}</Markdown>
          </motion.div>
        )}
      </AnimatePresence> */}
      <AnimatePresence initial={false}>
        <motion.div
          key={isExpanded ? "expanded" : "collapsed"}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          exit="collapsed"
          variants={variants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          className="pl-4 border-l text-primary/70 text-sm cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <Markdown>{reasoning}</Markdown> : reasoning}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
