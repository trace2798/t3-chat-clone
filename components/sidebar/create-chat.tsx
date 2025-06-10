import { FC } from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

interface CreateChatProps {}

const CreateChat: FC<CreateChatProps> = ({}) => {
  const { state } = useSidebar();
  return (
    <>
      <Button
        size={state === "expanded" ? "sm" : "icon"}
        variant={"ghost"}
        // onClick={() => setOpen(true)}
        className={cn(
          "h-7  hover:cursor-pointer",
          state === "expanded" ? "justify-start w-full" : "justify-center w-fit"
        )}
      >
        <SquarePen className="size-4" />
        {state === "expanded" && "New Chat"}
      </Button>
    </>
  );
};

export default CreateChat;
