import { authMiddleware } from "@clerk/nextjs";

// Export clerkMiddleware as the default middleware
export default authMiddleware();

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 