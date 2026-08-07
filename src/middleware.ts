import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, static assets, engine CSS/JS, and locale API
  matcher: [
    "/",
    "/((?!_next|_astro|assets|styles|api|favicon\\.ico|favicon\\.svg|.*\\..*).*)",
  ],
};
