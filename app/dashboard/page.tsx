import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";

const Page = async ({}) => {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() }
  );
  console.log(user);
  return (
    <>
      <div>Page</div>
    </>
  );
};

export default Page;
