"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { useRouter } from "next/navigation";

const RestoreDeleteChatButton = ({
  slug,
  currentUserId,
}: {
  slug: string;
  currentUserId: string;
}) => {
  const router = useRouter();
  const handleRestore = () => {
    fetchMutation(api.chat.restoreSoftDeletedChat, {
      slug: slug,
      userId: currentUserId,
    });
    router.refresh();
  };

  return (
    <>
      <Button variant="outline" className="h-6" onClick={() => handleRestore()}>
        Restore
      </Button>
    </>
  );
};

export default RestoreDeleteChatButton;
