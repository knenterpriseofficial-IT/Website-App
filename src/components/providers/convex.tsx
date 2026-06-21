import { ConvexProviderWithHerculesAuth } from "@usehercules/auth/convex-react";
import { ConvexReactClient } from "convex/react";
import { useEffect } from "react";
import { toast } from "sonner";

const convexUrl = import.meta.env.VITE_CONVEX_URL ?? "http://localhost:3000";
const convex = new ConvexReactClient(convexUrl);

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      import.meta.env.PROD &&
      (!import.meta.env.VITE_CONVEX_URL ||
        import.meta.env.VITE_CONVEX_URL.includes("localhost") ||
        import.meta.env.VITE_CONVEX_URL.includes("127.0.0.1"))
    ) {
      console.error(
        "CRITICAL CONFIGURATION ERROR: VITE_CONVEX_URL is missing or points to localhost in production! " +
          "Please configure VITE_CONVEX_URL in your Vercel project environment variables."
      );
      toast.error(
        "Database Connection Error: VITE_CONVEX_URL environment variable is missing or misconfigured in Vercel. Database saving/loading will not work.",
        {
          duration: 15000,
        }
      );
    }
  }, []);

  return (
    <ConvexProviderWithHerculesAuth client={convex}>
      {children}
    </ConvexProviderWithHerculesAuth>
  );
}

