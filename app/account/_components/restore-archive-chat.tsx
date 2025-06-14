"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { useRouter } from "next/navigation";

const RestoreArchiveChatButton = ({
  slug,
  currentUserId,
}: {
  slug: string;
  currentUserId: string;
}) => {
    const router = useRouter();
  const handleUnArchive = () => {
    fetchMutation(api.chat.unarchiveChat, {
      slug: slug,
      userId: currentUserId,
    });
        router.refresh();
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-6"
        onClick={() => handleUnArchive()}
      >
        Restore
      </Button>
    </>
  );
};

export default RestoreArchiveChatButton;
