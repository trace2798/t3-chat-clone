"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <Button
      onClick={signOut}
      variant="outline"
      className="font-mono gap-2 flex items-center"
    >
      <LogOut className="size-4" />
      <span>Sign out</span>
    </Button>
  );
}
