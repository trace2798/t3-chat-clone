// 'use client';

// import { useMemo } from 'react';
// import useSWR, { useSWRConfig } from 'swr';
// import { unstable_serialize } from 'swr/infinite';
// // // import { updateChatVisibility } from '@/app/(chat)/actions';
// // import {
// //   getChatHistoryPaginationKey,
// //   type ChatHistory,
// // } from '@/components/sidebar-history';
// // import type { VisibilityType } from '@/components/chat/visibility-selector';
// type VisibilityType = 'private' | 'public';
// export function useChatVisibility({
//   chatId,
//   initialVisibilityType,
// }: {
//   chatId: string;
//   initialVisibilityType: VisibilityType;
// }) {
//   const { mutate, cache } = useSWRConfig();
// //   const history: ChatHistory = cache.get('/api/history')?.data;

//   const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
//     `${chatId}-visibility`,
//     null,
//     {
//       fallbackData: initialVisibilityType,
//     },
//   );

//   const visibilityType = useMemo(() => {
//     if (!history) return localVisibility;
//     // const chat = history.chats.find((chat) => chat.id === chatId);
//     // if (!chat) return 'private';
//     return "public";
//   }, [history, chatId, localVisibility]);

//   const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
//     setLocalVisibility(updatedVisibilityType);
//     // mutate(unstable_serialize(getChatHistoryPaginationKey));

//     // updateChatVisibility({
//     //   chatId: chatId,
//     //   visibility: updatedVisibilityType,
//     // });
//   };

//   return { visibilityType, setVisibilityType };
// }
"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type VisibilityType = "private" | "public";

export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string | undefined;
  initialVisibilityType: VisibilityType;
}) {
  // //console.log("chatId", chatId);
  let visibilityFromDb: "public" | "private" | undefined = undefined;

  if (chatId) {
    visibilityFromDb = useQuery(api.chat.getChatVisibility, {
      chatId: chatId as Id<"chat">,
    });
  }

  const updateVisibility = useMutation(api.chat.updateChatVisibility);

  const visibilityType = visibilityFromDb ?? initialVisibilityType;
  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    if (!chatId) return;
    updateVisibility({
      chatId: chatId as Id<"chat">,
      visibility: updatedVisibilityType,
    });
  };

  return {
    visibilityType,
    setVisibilityType,
  };
}
