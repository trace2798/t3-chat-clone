import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

interface ImageEditorProps {
  title: string;
  content: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  status: string;
  isInline: boolean;
}

export function ImageEditor({
  title,
  content,
  status,
  isInline,
}: ImageEditorProps) {
  return (
    <div
      className={cn("flex flex-row items-center justify-center w-full", {
        "h-[calc(100dvh-60px)]": !isInline,
        "h-[200px]": isInline,
      })}
    >
      {status === "streaming" ? (
        <div className="flex flex-row gap-4 items-center">
          {!isInline && (
            <div className="animate-spin">
              <LoaderIcon size={16} />
            </div>
          )}
          <div>Generating Image...</div>
        </div>
      ) : (
        <picture>
          <img
            className={cn("w-full h-fit max-w-[800px]", {
              "p-0 md:p-20": !isInline,
            })}
            src={`data:image/png;base64,${content}`}
            alt={title}
          />
        </picture>
      )}
    </div>
  );
}
