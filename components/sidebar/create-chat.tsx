import { FC } from "react";
import { Button } from "../ui/button";
import { SquarePen } from "lucide-react";

interface CreateChatProps {}

const CreateChat: FC<CreateChatProps> = ({}) => {
  return (
    <>
      <Button
        size={"icon"}
        variant={"ghost"}
        // onClick={() => setOpen(true)}
        className="size-7"
      >
        <SquarePen className="size-4" />
      </Button>
    </>
  );
};

export default CreateChat;
