import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // Automatically trigger sign out when the page loads
    const signOutButton = document.querySelector("[data-testid='clerk-sign-out-button']");
    if (signOutButton) {
      signOutButton.click();
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">Signing you out...</h1>
        <SignOutButton signOutCallback={() => router.push("/")} />
      </div>
    </div>
  );
} 