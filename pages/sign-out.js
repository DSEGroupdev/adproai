import { SignOutButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut();
        router.push("/");
      } catch (error) {
        console.error("Error signing out:", error);
        // Redirect to home even if there's an error
        router.push("/");
      }
    };

    handleSignOut();
  }, [signOut, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Signing you out...</h1>
      </div>
    </div>
  );
} 