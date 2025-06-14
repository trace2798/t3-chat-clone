"use client";

import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const PermanentlyDeleteChatButton = ({
  slug,
  currentUserId,
}: {
  slug: string;
  currentUserId: string;
}) => {
  const router = useRouter();
  const handlePermanentlyDeleteChat = () => {
    fetchMutation(api.chat.permanentlyDeleteChatAndMessages, {
      slug: slug,
      userId: currentUserId,
    });
    router.refresh();
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="h-6">
            Permanently Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and all the data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full justify-between">
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-900 text-white"
              onClick={() => handlePermanentlyDeleteChat()}
            >
              Yes. Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PermanentlyDeleteChatButton;
