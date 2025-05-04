import { SignUp } from "@clerk/nextjs";

const appearance = {
  elements: {
    card: "bg-[#181c23] border-none",
    formFieldInput: "bg-white text-black",
    formFieldInput__code: "bg-white text-black border border-gold-500",
    formFieldLabel: "text-white",
    headerTitle: "text-white",
    headerSubtitle: "text-white",
    formFieldHintText: "text-white",
    formFieldErrorText: "text-red-500",
    socialButtonsBlockButton: "bg-white text-black hover:bg-[#FFD700] hover:text-black border border-[#FFD700]",
    dividerText: "text-white",
    footerActionText: "text-white",
    footerActionLink: "text-white hover:text-[#FFD700]",
    alternativeMethodsBlockButton: "text-white",
    alternativeMethodsBlockButton__icon: "text-white",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-white",
    formButtonPrimary: "bg-[#FFD700] text-black hover:bg-[#e6c200]",
    formButtonReset: "text-white",
    formButton: "text-white",
    backLink: "text-white",
  },
};

export default function SignUpPage() {
  return (
    <SignUp 
      appearance={appearance} 
      verifyEmailWith="code"
      verificationTimeout={300}
    />
  );
} 