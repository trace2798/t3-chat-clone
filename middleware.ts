import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// public
const isSignInPage = createRouteMatcher(["/signin"]);
const isSharePage = createRouteMatcher(["/share(.*)"]);

// private
const isChatPage = createRouteMatcher(["/chat(.*)"]);
const isAccountPage = createRouteMatcher(["/account(.*)"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authed = await convexAuth.isAuthenticated();
    if (isSignInPage(request) && authed) {
      return nextjsMiddlewareRedirect(request, "/chat");
    }
    if (isSignInPage(request) || isSharePage(request)) {
      return; // continue on through
    }

    if (isChatPage(request) && !authed) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }
    if (isAccountPage(request) && !authed) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }
  },
  {
    cookieConfig: {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  }
);

export const config = {
  matcher: [
    // apply to all pages & API routes except static files
    "/((?!.*\\..*|_next).*)",
    "/",
    "/api/:path*",
  ],
};
