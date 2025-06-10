'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
// // import { updateChatVisibility } from '@/app/(chat)/actions';
// import {
//   getChatHistoryPaginationKey,
//   type ChatHistory,
// } from '@/components/sidebar-history';
// import type { VisibilityType } from '@/components/chat/visibility-selector';
type VisibilityType = 'private' | 'public';
export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
//   const history: ChatHistory = cache.get('/api/history')?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibilityType,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    // const chat = history.chats.find((chat) => chat.id === chatId);
    // if (!chat) return 'private';
    return "public";
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);
    // mutate(unstable_serialize(getChatHistoryPaginationKey));

    // updateChatVisibility({
    //   chatId: chatId,
    //   visibility: updatedVisibilityType,
    // });
  };

  return { visibilityType, setVisibilityType };
}