import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import RestoreArchiveChatButton from "./_components/restore-archive-chat";
import PermanentlyDeleteChatButton from "./_components/permanently-delete-chat";
import RestoreDeleteChatButton from "./_components/restore-delete-chat";

const Page = async ({}) => {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  if (!user) redirect("/login");
  const archivedChats = await fetchQuery(api.chat.getArchivedChatByUserId, {
    userId: user._id,
  });
  console.log("USER CHATS Archived", archivedChats);
  const deletedChats = await fetchQuery(api.chat.getDeletedChatByUserId, {
    userId: user._id,
  });
  return (
    <>
      <div className="absolute top-0 flex flex-col w-full min-h-screen bg-accent justify-center items-center">
        <div className="grid grid-cols-1 gap-4 w-full max-w-6xl">
          {/* <div className="flex flex-col space-y-2 w-full max-w-sm p-4 border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Archived Chats</h1>
            <Separator />
            <div className="flex flex-col space-y-2">
              {archivedChats.map((chat) => (
                <div
                  key={chat._id}
                  className="flex flex-row justify-between items-center"
                >
                  <p className="w-full truncate">{chat.title}</p>
                  <RestoreArchiveChatButton
                    slug={chat.slug}
                    currentUserId={user._id}
                  />
                </div>
              ))}
            </div>
          </div> */}
          <div className="flex flex-col space-y-2 w-full max-w-xl mx-auto p-4 border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Deleted Chats</h1>
            <Separator />
            <div className="flex flex-col space-y-2">
              {deletedChats.map((chat) => (
                <div key={chat._id} className="flex flex-col space-y-2">
                  <p className="w-full truncate">{chat.title}</p>
                  <div className="flex flex-row justify-between items-center">
                    <PermanentlyDeleteChatButton
                      slug={chat.slug}
                      currentUserId={user._id}
                    />
                    <RestoreDeleteChatButton
                      slug={chat.slug}
                      currentUserId={user._id}
                    />
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
