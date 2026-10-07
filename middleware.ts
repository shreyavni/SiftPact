import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/",
    "/result(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/analyze(.*)",
    "/api/generate-pdf(.*)",
    "/api/send-report(.*)",
    "/api/export-pdf(.*)",
    "/api/health(.*)",
    "/api/laws(.*)",
    "/api/uploadthing(.*)", // If using uploadthing
    "/api/webhooks(.*)", // For Clerk webhooks
    "/dashboard(.*)",
    "/compare(.*)",
    "/settings(.*)",
    "/create-contract(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
