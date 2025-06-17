import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import AddKeyComponent from "./_components/openrouter-key-component";

const Page = async ({}) => {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  if (!user) redirect("/signin");

  const keyInfo = await fetchQuery(
    api.key.getKeyByUserId,
    { userId: user._id },
    { token: await convexAuthNextjsToken() }
  );
  console.log("CONVEX KEY INFO", keyInfo);
  return (
    <>
      <div className="absolute top-0 w-full flex items-center justify-center h-full">
        <div className="w-full max-w-lg">
          <AddKeyComponent keyInfo={keyInfo} currentUserId={user._id} />
        </div>
      </div>
    </>
  );
};

export default Page;
