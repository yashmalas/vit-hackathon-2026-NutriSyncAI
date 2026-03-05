"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { ActivitySquare, Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <PageTransition>
            <div className="min-h-screen flex bg-base">
                {/* Left Side: Animated Visual Panel (Hidden on Mobile) */}
                <div className="hidden lg:flex w-1/2 relative bg-surface overflow-hidden flex-col justify-between p-12 border-r border-border-glow/30">

                    {/* Background Elements */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-primary/10 blur-[120px] mix-blend-screen" />
                        <div className="absolute bottom-[10%] left-[-20%] w-[50%] h-[50%] rounded-full bg-accent-secondary/10 blur-[120px] mix-blend-screen" />

                        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="hex-auth" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                                    <path fill="none" stroke="#76ff03" strokeWidth="1" d="M25,21.7L12.5,28.9L0,21.7L0,7.2L12.5,0L25,7.2Z M25,50.6L12.5,57.8L0,50.6L0,36.1L12.5,28.9L25,36.1Z m25-14.4L37.5,43.4L25,36.1L25,21.7L37.5,14.4L50,21.7Z" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hex-auth)" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                            <ActivitySquare className="w-8 h-8 text-accent-primary" />
                            <span className="font-display font-bold text-xl tracking-tight text-primary">NUTRISYNC<span className="text-accent-primary"> AI</span></span>
                        </Link>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-20">
                        {/* Animated Rotating "DNA" or Core representation */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="relative w-64 h-64 flex items-center justify-center mb-12"
                        >
                            <Hexagon className="absolute w-64 h-64 text-accent-primary/20 stroke-[0.5]" />
                            <motion.div
                                animate={{ rotate: -720 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            >
                                <Hexagon className="absolute w-48 h-48 text-accent-secondary/30 stroke-[1]" />
                            </motion.div>
                            <div className="w-32 h-32 rounded-full border-4 border-accent-primary/50 border-t-accent-primary flex items-center justify-center blur-[1px]">
                                <div className="w-20 h-20 rounded-full border-4 border-accent-secondary/50 border-b-accent-secondary animate-spin-reverse" />
                            </div>
                        </motion.div>

                        <h2 className="font-display font-bold text-4xl text-center mb-4 text-primary">
                            Eat Smart. Live Strong.<br />Synced with Science.
                        </h2>
                        <p className="text-muted text-lg text-center max-w-md">
                            Your autonomous bio-nutrition engine. AI-powered precision for peak human performance.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-muted">
                        &copy; {new Date().getFullYear()} NutriSync AI v1.0
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
                    {children}
                </div>
            </div>
        </PageTransition>
    );
}
