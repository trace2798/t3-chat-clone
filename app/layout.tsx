import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import {
  ConvexAuthNextjsServerProvider,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Submission for T3 Chat Cloneathon",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await convexAuthNextjsToken();
  const currentUser = token
    ? await fetchQuery(api.users.getUser, {}, { token })
    : null;
  const userChats = currentUser
    ? await fetchQuery(api.chat.getChatByUserId, { userId: currentUser._id })
    : null;
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <SidebarProvider className="">
                {/* {currentUser ? (
                  <AppSidebar
                    currentUser={currentUser}
                    userChats={userChats as any}
                  />
                ) : (
                  <div>Login</div>
                )} */}
                <AppSidebar
                  currentUser={currentUser}
                  userChats={userChats as any}
                />
                <SidebarInset className="">
                  <main>
                    <Toaster />
                    <div className="flex w-full">
                      <SidebarTrigger className="" currentUser={currentUser} />
                    </div>
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
