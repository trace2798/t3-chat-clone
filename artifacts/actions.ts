"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await fetchQuery(
    api.suggestion.getSuggestionsByDocumentId,
    {
      documentId: documentId as Id<"document">,
    }
  );
  return suggestions ?? [];
}
