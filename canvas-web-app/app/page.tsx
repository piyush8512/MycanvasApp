"git use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Chrome,
  Download,
  Github,
  Layers,
  LayoutDashboard,
  Linkedin,
  MousePointer2,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Reveal = ({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: any) => {
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-y-0 translate-x-0 blur-none scale-100";
    switch (direction) {
      case "up":
        return "translate-y-12 blur-sm scale-95";
      case "down":
        return "-translate-y-12 blur-sm scale-95";
      case "left":
        return "translate-x-12 blur-sm scale-95";
      case "right":
        return "-translate-x-12 blur-sm scale-95";
      default:
        return "translate-y-12 blur-sm scale-95";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "opacity-100" : "opacity-0"} ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const GlowCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm group transition-all duration-500 hover:border-white/20 hover:bg-neutral-900/50 hover:-translate-y-1 ${className}`}
    >
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

const TiltStage = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (0.5 - py) * 10,
      y: (px - 0.5) * 14,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 220ms ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050507] text-white relative overflow-x-hidden selection:bg-white selection:text-black">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(42,97,255,0.15),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(0,226,157,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,124,42,0.1),transparent_38%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_70%_56%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#050507]/65 backdrop-blur-xl supports-backdrop-filter:bg-[#050507]/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110">
              <Layers className="text-black w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Canvas.
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#downloads" className="hover:text-white transition-colors">
              Downloads
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <SignedIn>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-all group"
              >
                <LayoutDashboard className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Dashboard</span>
              </Link>
              <div className="pl-6 border-l border-white/10 flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
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

      <main className="relative z-10 pt-44 pb-24 px-6 max-w-7xl mx-auto">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[760px] h-80 bg-cyan-300/10 blur-[130px] rounded-full pointer-events-none animate-[breathe_8s_ease-in-out_infinite]" />

        <section className="text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">
                Web + iOS + Android + Chrome Extension
              </span>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h2 className="text-5xl md:text-[5.4rem] font-black tracking-tight mb-8 leading-[1.02]">
              Build your second brain.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-white to-emerald-300">
                Explore it in 3D space.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={280}>
            <p className="text-lg md:text-xl text-neutral-300 max-w-3xl mb-12 leading-relaxed mx-auto font-medium">
              Canvas turns scattered links, screenshots, notes, docs, videos,
              and tasks into a single visual workspace. Save instantly from
              browser extension, continue on mobile, and collaborate with
              teammates on real-time boards.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_45px_rgba(255,255,255,0.16)]">
                    Open Your Canvas
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto group relative overflow-hidden flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                    Start Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
                </Link>
              </SignedOut>

              <a
                href="#workflow"
                className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-3"
              >
                <button className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-transparent border border-white/15 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 active:scale-95">
                  <Play className="w-4 h-4" />
                  See How It Works
                </button>
              </a>
            </div>
          </Reveal>

          <Reveal delay={550}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-neutral-300 font-medium">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                Real-time collaboration
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                Infinite canvas boards
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                Offline mobile sync
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">
                1-click link capture
              </span>
            </div>
          </Reveal>
        </section>

        <Reveal
          delay={620}
          className="mt-20 w-full max-w-6xl mx-auto perspective-[2000px]"
        >
          <TiltStage className="relative w-full h-[560px] rounded-[2.6rem] border border-white/10 bg-[#0a0a0f]/75 backdrop-blur-2xl overflow-hidden flex items-center justify-center shadow-[0_20px_120px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.14),transparent_35%)]" />
            <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

            <div
              className="absolute left-[8%] top-[18%] w-56 p-4 rounded-2xl border border-white/10 bg-[#040408]/95 shadow-2xl animate-[floatY_6s_ease-in-out_infinite]"
              style={{ transform: "translateZ(20px) rotate(-7deg)" }}
            >
              <div className="w-full h-24 bg-neutral-900 rounded-xl mb-3 border border-white/10 flex items-center justify-center">
                <MousePointer2 className="w-8 h-8 text-cyan-200" />
              </div>
              <h3 className="font-semibold text-sm">Drag to Cluster Ideas</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Group everything by context, not by folders only.
              </p>
            </div>

            <div
              className="absolute right-[8%] bottom-[14%] w-60 p-4 rounded-2xl border border-white/10 bg-[#040408]/95 shadow-2xl animate-[floatY_7.2s_ease-in-out_infinite]"
              style={{
                transform: "translateZ(26px) rotate(8deg)",
                animationDelay: "-1.8s",
              }}
            >
              <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-emerald-200" />
                </div>
                <span className="text-sm font-semibold">Live Team Session</span>
              </div>
              <p className="text-xs text-neutral-400">
                Invite collaborators and curate references in real time.
              </p>
            </div>

            <div className="absolute top-10 right-16 w-36 h-36 rounded-full border border-cyan-200/20 animate-[spin_16s_linear_infinite]" />
            <div className="absolute top-10 right-16 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.9)] animate-[orbit_16s_linear_infinite]" />

            <div
              className="absolute z-20 w-[390px] max-w-[86%] p-8 rounded-3xl border border-white/15 bg-[#0c0c13]/95 shadow-[0_35px_90px_rgba(0,0,0,0.78)]"
              style={{ transform: "translateZ(54px)" }}
            >
              <div className="flex items-center justify-between mb-7">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#0c0c13] bg-cyan-200" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0c0c13] bg-emerald-300" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0c0c13] bg-neutral-500 flex items-center justify-center text-xs font-bold">
                    +4
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-2xl tracking-tight mb-2">
                Product Launch Masterboard
              </h3>
              <p className="text-sm text-neutral-300">
                72 assets organized across strategy, design, and growth lanes.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  Links captured:{" "}
                  <span className="text-cyan-300 font-semibold">1,284</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  Active collaborators:{" "}
                  <span className="text-emerald-300 font-semibold">12</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  Mobile edits today:{" "}
                  <span className="text-orange-300 font-semibold">97</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                  Extension saves:{" "}
                  <span className="text-indigo-300 font-semibold">413</span>
                </div>
              </div>
            </div>
          </TiltStage>
        </Reveal>

        <section id="features" className="mt-40">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-6">
              Everything your ideas need to stay alive.
            </h2>
            <p className="text-center text-neutral-300 max-w-3xl mx-auto text-lg mb-16">
              Canvas is more than bookmarking. It is a visual operating system
              for research, project planning, personal knowledge, collaborative
              curation, and momentum.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <Reveal delay={80}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center mb-5">
                  <Layers className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Spatial Boards</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Build infinite canvases where links, notes, files, and media
                  can be arranged by proximity and meaning, not just rigid
                  lists.
                </p>
              </GlowCard>
            </Reveal>

            <Reveal delay={150}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-300/10 border border-emerald-300/20 flex items-center justify-center mb-5">
                  <Share2 className="w-5 h-5 text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Real-time Collaboration
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Invite teammates and friends, co-curate references together,
                  and keep everyone aligned with live updates and shared
                  context.
                </p>
              </GlowCard>
            </Reveal>

            <Reveal delay={220}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-indigo-300/10 border border-indigo-300/20 flex items-center justify-center mb-5">
                  <Chrome className="w-5 h-5 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Browser Extension Capture
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Save a page in one click with your Chrome extension and send
                  it directly into the exact board or folder where it belongs.
                </p>
              </GlowCard>
            </Reveal>

            <Reveal delay={290}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-orange-300/10 border border-orange-300/20 flex items-center justify-center mb-5">
                  <Smartphone className="w-5 h-5 text-orange-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Mobile-first Continuity
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Capture inspiration on iOS and Android, organize offline, and
                  let sync update your workspace when your connection is back.
                </p>
              </GlowCard>
            </Reveal>

            <Reveal delay={360}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-300/10 border border-fuchsia-300/20 flex items-center justify-center mb-5">
                  <Users className="w-5 h-5 text-fuchsia-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">Shared Spaces</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Create focused spaces for personal planning, team projects, or
                  inspiration boards, each with permission controls and
                  structure.
                </p>
              </GlowCard>
            </Reveal>

            <Reveal delay={430}>
              <GlowCard className="p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-teal-300/10 border border-teal-300/20 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Fast Search and Retrieval
                </h3>
                <p className="text-neutral-300 leading-relaxed">
                  Find anything instantly with keyword search, folder filters,
                  and visual grouping so your best references never disappear.
                </p>
              </GlowCard>
            </Reveal>
          </div>
        </section>

        <section id="workflow" className="mt-40">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-16">
              How Canvas fits your daily flow.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <div className="rounded-3xl border border-white/10 bg-white/3 p-8 h-full">
                <span className="inline-flex w-9 h-9 rounded-full bg-cyan-300/20 text-cyan-200 text-sm items-center justify-center font-bold mb-5">
                  1
                </span>
                <h3 className="text-xl font-bold mb-3">Capture everywhere</h3>
                <p className="text-neutral-300">
                  Save links with Chrome extension, drop notes from web, or add
                  ideas from your mobile app even when you are moving.
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-3xl border border-white/10 bg-white/3 p-8 h-full">
                <span className="inline-flex w-9 h-9 rounded-full bg-emerald-300/20 text-emerald-200 text-sm items-center justify-center font-bold mb-5">
                  2
                </span>
                <h3 className="text-xl font-bold mb-3">Organize visually</h3>
                <p className="text-neutral-300">
                  Use boards, spaces, and folders to map ideas in a way your
                  brain naturally understands. Rearrange quickly with drag and
                  drop.
                </p>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="rounded-3xl border border-white/10 bg-white/3 p-8 h-full">
                <span className="inline-flex w-9 h-9 rounded-full bg-orange-300/20 text-orange-200 text-sm items-center justify-center font-bold mb-5">
                  3
                </span>
                <h3 className="text-xl font-bold mb-3">
                  Build and ship together
                </h3>
                <p className="text-neutral-300">
                  Share boards with teammates, align on references instantly,
                  and move from scattered resources to clear project execution.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="downloads" className="mt-40">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center mb-6">
              Download Canvas on every device.
            </h2>
            <p className="text-center text-neutral-300 max-w-3xl mx-auto text-lg mb-14">
              Start on web, continue on mobile, and capture instantly with
              extension. One account, one synchronized creative workspace.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <GlowCard className="p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center">
                    <TabletSmartphone className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                    Mobile App
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">iOS and Android</h3>
                <p className="text-neutral-300 mb-5">
                  Capture and organize ideas on the go, with offline support and
                  background sync to your boards.
                </p>
                <ul className="space-y-2 text-sm text-neutral-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Offline mode with smart sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Quick add links and notes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Shared spaces and collaboration
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold py-3 px-5 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Get Mobile Access
                </Link>
              </GlowCard>
            </Reveal>

            <Reveal delay={200}>
              <GlowCard className="p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-300/10 border border-indigo-300/20 flex items-center justify-center">
                    <Chrome className="w-6 h-6 text-indigo-300" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-indigo-300/25 bg-indigo-300/10 text-indigo-200">
                    Extension
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Chrome Extension</h3>
                <p className="text-neutral-300 mb-5">
                  Save the page you are browsing into your selected board and
                  folder without leaving your current workflow.
                </p>
                <ul className="space-y-2 text-sm text-neutral-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    One-click page capture
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Select destination board instantly
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Works with your Canvas account
                  </li>
                </ul>
                <Link
                  href="/extension-login"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold py-3 px-5 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install Extension
                </Link>
              </GlowCard>
            </Reveal>

            <Reveal delay={300}>
              <GlowCard className="p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-300/10 border border-emerald-300/20 flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
                    Web App
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Browser Workspace</h3>
                <p className="text-neutral-300 mb-5">
                  Use the full-screen canvas, folder management, board sharing,
                  and deep organization features from any browser.
                </p>
                <ul className="space-y-2 text-sm text-neutral-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Unlimited canvas sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Powerful board and folder control
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    Designed for teams and solo creators
                  </li>
                </ul>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold py-3 px-5 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Open Web App
                </Link>
              </GlowCard>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050507] pt-20 pb-12 mt-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-1 md:col-span-2 pr-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Layers className="text-black w-4 h-4" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  Canvas.
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-sm">
                The visual workspace for modern teams and creators. Capture from
                extension, organize on web, and continue from mobile.
              </p>
              <div className="flex items-center gap-4 text-neutral-500">
                <a
                  href="#"
                  className="hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-4">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#workflow"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#downloads"
                    className="hover:text-white transition-colors"
                  >
                    Downloads
                  </a>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Web App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-4">
                Platforms
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-white transition-colors"
                  >
                    iOS App
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-white transition-colors"
                  >
                    Android App
                  </Link>
                </li>
                <li>
                  <Link
                    href="/extension-login"
                    className="hover:text-white transition-colors"
                  >
                    Chrome Extension
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Browser Version
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold tracking-tight mb-4">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-7 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Canvas Inc. All rights reserved.</p>
            <div className="flex items-center gap-5 mt-3 md:mt-0">
              <span>Built for web, mobile, and extension-first workflows.</span>
            </div>
          </div>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes floatY {
            0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
            50% { transform: translateY(-16px) rotate(var(--r, 0deg)); }
          }
          @keyframes breathe {
            0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.9; transform: translateX(-50%) scale(1.08); }
          }
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(72px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(72px) rotate(-360deg); }
          }
        `,
        }}
      />
    </div>
  );
}
