import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { SignInWithGitHub } from "./_components/signin-github";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2 absolute top-0 w-full">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent>
                <SignInWithGitHub />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src="/auth.webp"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] "
          />
        </div>
      </div>
    </>
  );
};

export default Page;
