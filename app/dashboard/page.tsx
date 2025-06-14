import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";

const Page = async ({}) => {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  // console.log(user);
  return (
    <>
      <div className="flex flex-1 flex-col w-full min-h-screen rounded-lg bg-zinc-800">
        Hello
      </div>
    </>
  );
};

export default Page;
