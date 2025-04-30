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
    socialButtonsBlockButton: "bg-white text-black hover:bg-gold-500 hover:text-white",
    dividerText: "text-white",
    footerActionText: "text-white",
    footerActionLink: "text-gold-500 hover:text-gold-400",
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