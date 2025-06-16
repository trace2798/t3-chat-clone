import { codeDocumentHandler } from "@/artifacts/code/server";
import { imageDocumentHandler } from "@/artifacts/image/server";
import { sheetDocumentHandler } from "@/artifacts/sheet/server";
import { textDocumentHandler } from "@/artifacts/text/server";
import { ArtifactKind } from "@/components/artifact/artifact";
import { DataStreamWriter } from "ai";

import { Doc } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type Document = Doc<"document">;
export interface SaveDocumentProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}

export interface CreateDocumentCallbackProps {
  id: string;
  title: string;
  dataStream: DataStreamWriter;
  currentUserId: string;
}

export interface UpdateDocumentCallbackProps {
  document: Document;
  description: string;
  dataStream: DataStreamWriter;
  currentUserId: string;
}

export interface DocumentHandler<T = ArtifactKind> {
  kind: T;
  onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>;
  onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>;
}

export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        currentUserId: args.currentUserId,
      });

      if (args.currentUserId) {
        // await saveDocument({
        //   id: args.id,
        //   title: args.title,
        //   content: draftContent,
        //   kind: config.kind,
        //   userId: args.currentUserId,
        // });
        await fetchMutation(api.document.saveDocument, {
          title: args.title,
          content: draftContent,
          kind: config.kind,
          userId: args.currentUserId,
        });
      }

      return;
    },
    onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
        currentUserId: args.currentUserId,
      });

      if (args.currentUserId) {
      
        await fetchMutation(api.document.updateDocument, {
          id: args.document._id,
          title: args.document.title,
          content: draftContent,
          kind: config.kind,
        });
      }

      return;
    },
  };
}

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler as any,
  codeDocumentHandler as any,
  imageDocumentHandler as any,
  sheetDocumentHandler as any,
];

export const artifactKinds = ["text", "code", "image", "sheet"] as const;
