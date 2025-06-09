import { FC } from "react";
import { SignInWithGitHub } from "./_components/signin-github";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <>
      <SignInWithGitHub />
    </>
  );
};

export default Page;
