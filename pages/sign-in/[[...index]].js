import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#D4AF37] hover:bg-[#C19B2E] text-black',
            card: 'bg-gray-900 border border-gray-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            formFieldLabel: 'text-gray-300',
            formFieldInput: 'bg-gray-800 border-gray-700 text-white',
            dividerLine: 'bg-gray-800',
            dividerText: 'text-gray-400',
            footerActionLink: 'text-[#D4AF37] hover:text-[#C19B2E]'
          }
        }}
      />
    </div>
  );
} 