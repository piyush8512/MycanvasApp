'use client';

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, LayoutDashboard, Share2, Sparkles, Users, Layers, Github, Twitter, Linkedin, MousePointer2 } from "lucide-react";
// REAL CLERK & NEXT.JS IMPORTS
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// --- Premium Scroll Reveal Component ---
const Reveal = ({ children, delay = 0, className = "", direction = "up" }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-y-0 translate-x-0 blur-none scale-100";
    switch (direction) {
      case "up": return "translate-y-12 blur-sm scale-95";
      case "down": return "-translate-y-12 blur-sm scale-95";
      case "left": return "translate-x-12 blur-sm scale-95";
      case "right": return "-translate-x-12 blur-sm scale-95";
      default: return "translate-y-12 blur-sm scale-95";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "opacity-100" : "opacity-0"} ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Premium Glow Card Component (Mouse Tracking) ---
const GlowCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm group transition-all duration-500 hover:border-white/20 hover:bg-neutral-900/50 hover:-translate-y-1 ${className}`}
    >
      {/* Dynamic Glow Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020202] text-white relative overflow-x-hidden font-sans selection:bg-white selection:text-black">
      
      {/* NOISE & GRID BACKGROUND */}
      <div className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* HEADER: Ultra-minimalist Glass Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020202]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#020202]/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
              <Layers className="text-black w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">
              Canvas.
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <SignedIn>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-all group">
                <LayoutDashboard className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Dashboard</span>
              </Link>
              <div className="pl-6 border-l border-white/10 flex items-center">
                {/* Real Clerk User Button */}
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                Log in
              </Link>
              <Link href="/sign-in">
                <button className="bg-white text-black text-sm font-semibold py-2 px-5 rounded-full hover:bg-neutral-200 transition-all duration-300 active:scale-95 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Get Started
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-56 pb-20 px-6 max-w-7xl mx-auto text-center">
        
        {/* Subtle glowing orb behind hero */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <Reveal delay={0}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer group">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">The new standard for organization</span>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <h2 className="text-5xl md:text-[5.5rem] font-extrabold tracking-tighter mb-8 leading-[1.05] text-white">
            Your digital mind, <br />
            <span className="text-neutral-600 inline-block relative">
              on an infinite canvas.
              <div className="absolute bottom-1 left-0 w-full h-1 bg-neutral-800 origin-left animate-[scaleX_1s_ease-out_forwards] scale-x-0" style={{ animationDelay: '1s' }} />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={300}>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed mx-auto font-medium">
            Stop losing links in endless lists. Save bookmarks directly from your apps, drag them onto spatial boards, and collaborate visually.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Open your Canvas
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
              <button className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 group flex items-center justify-center gap-2 bg-transparent border border-white/10 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300 active:scale-95">
                View Demo
              </button>
            </SignedOut>
          </div>
        </Reveal>

        {/* VISUAL MOCKUP: Premium Floating Cards */}
        <Reveal delay={600} className="mt-32 w-full max-w-5xl mx-auto perspective-[2000px]">
          <div className="relative w-full h-[500px] rounded-[2.5rem] border border-white/5 bg-neutral-950/40 backdrop-blur-xl overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]">
            
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            {/* Floating Card 1 (Left) */}
            <div className="absolute left-[8%] top-[25%] w-64 p-5 rounded-2xl border border-white/5 bg-[#050505]/90 backdrop-blur-xl shadow-2xl transform -rotate-6 transition-all duration-700 hover:rotate-0 hover:scale-105 hover:border-white/20 hover:z-30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing">
              <div className="w-full h-32 bg-neutral-900 rounded-xl mb-4 overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                 <Layers className="text-neutral-700 w-10 h-10" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white tracking-wide">Brand_Assets.pdf</h3>
                  <p className="text-xs text-neutral-500 mt-1">Added 2h ago</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center">
                  <MousePointer2 className="w-3 h-3 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Floating Card 2 (Center - Hero Card) */}
            <div className="absolute z-20 w-[340px] p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_80px_rgba(0,0,0,0.8)] transform transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 hover:border-white/20 cursor-default">
              <div className="flex items-center justify-between mb-8">
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-neutral-200 transition-transform hover:scale-110 z-30" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-neutral-400 transition-transform hover:scale-110 z-20" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-neutral-700 flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-110 z-10">+2</div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 flex items-center justify-center transition-all">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <h3 className="font-bold text-white text-2xl tracking-tight mb-2">Q4 Strategy Board</h3>
              <p className="text-sm text-neutral-400 font-medium">Active session with product team</p>
              
              <div className="mt-6 h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/3 rounded-full relative">
                   <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-sm animate-pulse" />
                </div>
              </div>
            </div>

            {/* Floating Card 3 (Right) */}
            <div className="absolute right-[8%] bottom-[20%] w-60 p-4 rounded-2xl border border-white/5 bg-[#050505]/90 backdrop-blur-xl shadow-2xl transform rotate-6 transition-all duration-700 hover:rotate-0 hover:scale-105 hover:border-white/20 hover:z-30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing">
              <div className="flex gap-4 items-center">
                 <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors">
                   <div className="w-4 h-4 bg-white rounded-sm relative z-10" />
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-sm text-white tracking-wide">Reference Video</h3>
                   <p className="text-xs text-neutral-500 mt-1">youtube.com</p>
                 </div>
              </div>
            </div>

          </div>
        </Reveal>

        {/* FEATURES BENTO GRID (Using GlowCard) */}
        <div className="mt-48 w-full max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-center mb-20 text-white">
              Everything in its right place.
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Reveal delay={100} direction="up">
              <GlowCard className="p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Spatial Organization</h3>
                <p className="text-neutral-400 leading-relaxed font-medium">Drag and drop links, images, and notes exactly where you want them. Map your thoughts visually instead of linearly.</p>
              </GlowCard>
            </Reveal>

            <Reveal delay={250} direction="up">
              <GlowCard className="p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Native Integration</h3>
                <p className="text-neutral-400 leading-relaxed font-medium">Save links directly from your browser, phone, or desktop straight into your specific canvas folders instantly.</p>
              </GlowCard>
            </Reveal>

            <Reveal delay={400} direction="up">
              <GlowCard className="p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Multiplayer Curation</h3>
                <p className="text-neutral-400 leading-relaxed font-medium">Add friends, share your canvases, and build living mood boards and project spaces together in real-time.</p>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#020202] pt-24 pb-12 mt-40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Layers className="text-black w-4 h-4" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tighter">Canvas.</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-sm font-medium">
                The spatial workspace for your digital life. Organize, collaborate, and think clearer on an infinite board.
              </p>
              <div className="flex items-center gap-5 text-neutral-500">
                <a href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300"><Github className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white hover:-translate-y-1 transition-all duration-300"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-6">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-neutral-600">
            <p>© {new Date().getFullYear()} Canvas Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles for animations injected in component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}} />
    </div>
  );
}