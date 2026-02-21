// import { SignIn } from "@clerk/nextjs";

// export default function SignInPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <SignIn />
//     </div>
//   );
// }

'use client';

import { SignIn } from "@clerk/nextjs";
import { Layers } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* NOISE & GRID BACKGROUND (Matching your landing page) */}
      <div className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* Logo / Back to Home */}
        <Link href="/" className="flex items-center gap-3 mb-8 group transition-transform hover:scale-105">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform duration-500 group-hover:rotate-90">
            <Layers className="text-black w-5 h-5" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tighter">
            Canvas.
          </span>
        </Link>

        {/* Customized Clerk Sign In */}
        <SignIn 
          appearance={{
            variables: {
              colorPrimary: "#ffffff",
              colorText: "#ffffff",
              colorBackground: "transparent",
              colorInputBackground: "rgba(255, 255, 255, 0.03)",
              colorInputText: "#ffffff",
              colorTextSecondary: "#a3a3a3",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl w-full",
              headerTitle: "text-2xl font-bold text-white tracking-tight",
              headerSubtitle: "text-neutral-400 font-medium",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white",
              socialButtonsBlockButtonText: "text-white font-semibold color",
              dividerLine: "bg-white/10",
              dividerText: "text-neutral-500",
              formFieldLabel: "text-neutral-300 font-medium",
              formFieldInput: "bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-white",
              formButtonPrimary: "bg-white text-black hover:bg-neutral-200 transition-all font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
              footerActionText: "text-neutral-400",
              footerActionLink: "text-white hover:text-neutral-300 font-semibold hover:underline",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-neutral-400 hover:text-white",
            }
          }}
        />
      </div>
    </div>
  );
}